const AppsmithWebSocket = require('./src/websocket.js');

// Khởi tạo WebSocket client
const ws = new AppsmithWebSocket('ws://localhost:8080');

// Kết nối
ws.connect();

// Lắng nghe events
ws.on('test_event', (data) => {
    console.log('Received test_event:', data);
});

// Gửi message sau 1 giây
setTimeout(() => {
    ws.emit('test_event', { message: 'Hello Server!' });
}, 1000); 