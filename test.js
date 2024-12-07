const DTUAppsmithRealtime = require('./dist/index.umd.js').default;
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let client;
let availableEvents = [];

// Hàm để in menu events
function printEventMenu() {
    console.log('\nAvailable Events:');
    availableEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.name}`);
    });
    console.log('0. Exit');
}

// Hàm để đọc input từ user
function question(query) {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

// Hàm xử lý event được chọn
async function handleSelectedEvent(eventIndex) {
    if (eventIndex < 0 || eventIndex >= availableEvents.length) {
        console.log('Invalid event index');
        return;
    }

    const selectedEvent = availableEvents[eventIndex];
    console.log(`\nSelected event: ${selectedEvent.name}`);

    while (true) {
        const message = await question('Enter message (or "back" to return to menu): ');
        
        if (message.toLowerCase() === 'back') {
            break;
        }

        try {
            client.emit(selectedEvent.name, { message });
            console.log('Message sent');
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    }
}

// Thêm hàm sleep để đ�i kết nối
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main loop
async function main() {
    try {
        console.log('Connecting to server...');
        client = new DTUAppsmithRealtime({
            url: 'http://localhost:3555',
            socketType: 'socketio'
        });

        // Đăng ký listeners trước khi connect
        client.on('open', () => {
            console.log('Connected to server');
        });

        client.on('error', (error) => {
            console.error('Error:', error.message);
        });

        client.on('close', () => {
            console.log('Disconnected from server');
        });

        // Lắng nghe tất cả các loại responses
        client.on('message', (data) => {
            console.log('\nReceived message:', data);
        });

        ['message_response', 'notification_response', 'sos_response'].forEach(event => {
            client.on(event, (data) => {
                console.log(`\nReceived ${event}:`, data);
            });
        });

        // Kết nối
        await client.connect();
        
        // Đợi một chút để đảm bảo kết nối thành công
        await sleep(1000);

        if (!client.isConnected) {
            throw new Error('Failed to connect to server');
        }

        // Lấy danh sách events
        console.log('Fetching available events...');
        availableEvents = await client.fetchAvailableEvents();
        console.log('\nSuccessfully connected and fetched events');

        // Main loop
        while (true) {
            printEventMenu();
            const choice = await question('\nSelect an event (0-' + availableEvents.length + '): ');
            
            if (choice === '0') {
                console.log('Exiting...');
                break;
            }

            const eventIndex = parseInt(choice) - 1;
            await handleSelectedEvent(eventIndex);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (client) {
            client.disconnect();
        }
        rl.close();
    }
}

// Chạy chương trình
main().catch(console.error);

// Cleanup khi thoát
process.on('SIGINT', () => {
    console.log('\nExiting...');
    if (client) {
        client.disconnect();
    }
    rl.close();
    process.exit(0);
}); 