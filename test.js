const DTUAppsmithRealtime = require('./dist/index.umd.js');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Khởi tạo client
const client = new DTUAppsmithRealtime({
    url: 'https://socket.thanhtruongit.io.vn',
    options: {
        transports: ['websocket'],
        autoConnect: false
    }
});

// Xử lý các sự kiện kết nối
client.on('connect', () => {
    console.log('Connected to server');
    console.log('Socket ID:', client.getState().socketId);
});

client.on('disconnect', () => {
    console.log('Disconnected from server');
});

client.on('error', (error) => {
    console.log('Error:', error);
});

// Lắng nghe các sự kiện từ server
['message', 'notification', 'sos'].forEach(eventName => {
    client.on(eventName, (data) => {
        console.log(`\nReceived ${eventName}:`, data);
    });
});

// Hàm gửi tin nhắn
async function sendMessage(eventName, message) {
    try {
        return new Promise((resolve) => {
            client.emit(eventName, { message }, (response) => {
                console.log(`Response from ${eventName}:`, response);
                resolve(response);
            });
        });
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// Menu chính
async function showMenu() {
    try {
        console.log('Connecting to server...');
        
        // Kết nối với timeout
        const connectPromise = client.connect();
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout')), 5000);
        });

        await Promise.race([connectPromise, timeoutPromise]);
        console.log('Connected successfully!');

        while (true) {
            console.log('\nAvailable Events:');
            console.log('1. Send Message');
            console.log('2. Send Notification');
            console.log('3. Send SOS');
            console.log('0. Exit');

            const answer = await new Promise(resolve => {
                rl.question('\nSelect an option (0-3): ', resolve);
            });

            if (answer === '0') {
                console.log('Exiting...');
                break;
            }

            let eventName;
            switch (answer) {
                case '1':
                    eventName = 'message';
                    break;
                case '2':
                    eventName = 'notification';
                    break;
                case '3':
                    eventName = 'sos';
                    break;
                default:
                    console.log('Invalid option');
                    continue;
            }

            const message = await new Promise(resolve => {
                rl.question('Enter your message: ', resolve);
            });

            await sendMessage(eventName, message);
        }
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        if (client.getState().isConnected) {
            client.disconnect();
        }
        rl.close();
    }
}

// Chạy chương trình
showMenu().catch(error => {
    console.error('Fatal error:', error);
    if (client.getState().isConnected) {
        client.disconnect();
    }
    rl.close();
    process.exit(1);
});

// Xử lý khi người dùng nhấn Ctrl+C
process.on('SIGINT', () => {
    console.log('\nClosing connection...');
    if (client.getState().isConnected) {
        client.disconnect();
    }
    rl.close();
    process.exit(0);
}); 