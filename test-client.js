const DTUAppsmithRealtime = require('./dist/index.umd.js');

// Test basic connection
console.log('Testing basic connection...');
const client = new DTUAppsmithRealtime({
    url: 'ws://localhost:8080'
});

client.on('open', () => {
    console.log('Connected successfully');
    runTests();
});

client.on('error', (error) => {
    console.error('Connection error:', error);
});

function runTests() {
    // Test message sending
    console.log('Testing message sending...');
    client.emit('test_event', { message: 'Test message' });

    // Test room functionality
    console.log('Testing room functionality...');
    const room = client.joinRoom('test_room');
    room.broadcast('room_message', { text: 'Hello room!' });

    // Cleanup after tests
    setTimeout(() => {
        room.leave();
        client.disconnect();
        console.log('Tests completed');
    }, 2000);
}

client.connect(); 