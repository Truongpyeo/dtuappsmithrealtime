class AppsmithRealtime {
    constructor(config = {}) {
        this.config = {
            url: config.url || 'ws://localhost:8080',
            autoReconnect: config.autoReconnect || true,
            ...config
        };
        this.socket = new AppsmithWebSocket(this.config.url, {
            maxReconnectAttempts: config.maxReconnectAttempts
        });
        this.rooms = new Map();
    }

    connect() {
        this.socket.connect();
        return this;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
        return this;
    }

    joinRoom(roomId) {
        if (!this.rooms.has(roomId)) {
            const room = new Room(roomId, this.socket);
            this.rooms.set(roomId, room);
            room.join();
        }
        return this.rooms.get(roomId);
    }

    on(event, callback) {
        this.socket.on(event, callback);
        return this;
    }

    emit(event, data) {
        this.socket.emit(event, data);
        return this;
    }
}

// Export class trực tiếp
module.exports = AppsmithRealtime; 