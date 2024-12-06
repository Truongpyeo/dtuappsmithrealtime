const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const parsed = JSON.parse(message);
            console.log('Received:', parsed);
            
            // Echo message back
            ws.send(JSON.stringify({
                event: parsed.event,
                data: parsed.data
            }));
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:8080'); 