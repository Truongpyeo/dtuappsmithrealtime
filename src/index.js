import { io } from 'socket.io-client';

class EventManager {
    constructor() {
        this.events = new Map();
    }

    registerEvent(eventName, options = {}) {
        this.events.set(eventName, {
            enabled: true,
            handler: eventName,
            ...options
        });
        return this.events.get(eventName);
    }

    getAllEvents() {
        return Array.from(this.events.entries()).map(([name, config]) => ({
            name,
            ...config
        }));
    }

    removeEvent(eventName) {
        return this.events.delete(eventName);
    }
}

class Room {
    constructor(roomId, socket) {
        this.roomId = roomId;
        this.socket = socket;
    }

    broadcast(event, data) {
        this.socket.emit('room_message', {
            roomId: this.roomId,
            event,
            data
        });
    }

    leave() {
        this.socket.emit('leave_room', { roomId: this.roomId });
    }
}

class DTUAppsmithRealtime {
    constructor(options = {}) {
        if (typeof window === 'undefined' || !window.io) {
            throw new Error(
                'socket.io-client is required. ' +
                'Please include https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/dist/socket.io.min.js ' +
                'before loading this library'
            );
        }
        this.io = window.io;
        
        this.url = options.url || 'http://localhost:3555';
        this.options = options.options || {};
        this.socket = null;
        this.eventManager = new EventManager();
        this.eventHandlers = new Map();
        this.rooms = new Map();
        this.isConnected = false;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            try {
                console.log('Initializing socket connection...');
                
                this.socket = this.io(this.url, {
                    transports: ['websocket'],
                    ...this.options
                });

                this.socket.connect();

                this.socket.on('connect', () => {
                    console.log('Socket connected successfully');
                    this.isConnected = true;
                    this._emit('open');
                    this._emit('connect');
                    resolve();
                });

                this.socket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error);
                    this._emit('error', error);
                    reject(error);
                });

                this.socket.on('disconnect', () => {
                    console.log('Socket disconnected');
                    this.isConnected = false;
                    this._emit('close');
                    this._emit('disconnect');
                });

                // Lắng nghe tin nhắn phòng
                this.socket.on('room_message', ({ roomId, event, data }) => {
                    this._emit(`room:${roomId}:${event}`, data);
                });

            } catch (error) {
                console.error('Error in connect:', error);
                reject(error);
            }
        });
    }

    // Thêm phương thức để lấy danh sách sự kiện từ server
    async fetchAvailableEvents() {
        if (!this.isConnected) {
            throw new Error('Must be connected to fetch events');
        }

        return new Promise((resolve, reject) => {
            this.socket.emit('get_available_events', null, (response) => {
                if (response.error) {
                    reject(new Error(response.error));
                } else {
                    // Đăng ký các sự kiện mới
                    response.events.forEach(event => {
                        this.eventManager.registerEvent(event.name, event);
                    });
                    resolve(response.events);
                }
            });

            // Timeout sau 5 giây
            setTimeout(() => {
                reject(new Error('Timeout fetching events'));
            }, 5000);
        });
    }

    // Thêm phương thức lắng nghe sự kiện động
    listenToEvent(eventName, callback) {
        if (!this.isConnected) {
            throw new Error('Must be connected to listen to events');
        }

        this.eventManager.registerEvent(eventName);
        this.on(eventName, callback);
        console.log(`Started listening to event: ${eventName}`);
    }

    // Thêm phương thức dừng lắng nghe sự kiện
    stopListening(eventName) {
        if (this.socket) {
            this.socket.off(eventName);
            this.eventManager.removeEvent(eventName);
            console.log(`Stopped listening to event: ${eventName}`);
        }
    }

    // Thêm phương thức tham gia phòng
    joinRoom(roomId) {
        if (!this.isConnected) {
            throw new Error('Must be connected to join room');
        }

        if (!this.rooms.has(roomId)) {
            this.socket.emit('join_room', { roomId });
            const room = new Room(roomId, this.socket);
            this.rooms.set(roomId, room);
        }

        return this.rooms.get(roomId);
    }

    // Thêm phương thức rời phòng
    leaveRoom(roomId) {
        if (this.rooms.has(roomId)) {
            const room = this.rooms.get(roomId);
            room.leave();
            this.rooms.delete(roomId);
        }
    }

    // Các phương thức hiện có
    emit(eventName, data, callback) {
        if (!this.isConnected) {
            throw new Error('Not connected to server');
        }

        try {
            if (callback) {
                this.socket.emit(eventName, data, callback);
            } else {
                this.socket.emit(eventName, data);
            }
        } catch (error) {
            console.error('Emit error:', error);
            throw error;
        }
    }

    on(event, callback) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(callback);

        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).delete(callback);
        }

        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    _emit(event, data) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} handler:`, error);
                }
            });
        }
    }

    disconnect() {
        if (this.socket) {
            // Rời khỏi tất cả các phòng
            this.rooms.forEach((room, roomId) => {
                this.leaveRoom(roomId);
            });
            
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.eventHandlers.clear();
            this.rooms.clear();
        }
    }

    getState() {
        return {
            isConnected: this.isConnected,
            socketId: this.socket?.id,
            rooms: Array.from(this.rooms.keys()),
            events: this.eventManager.getAllEvents()
        };
    }

    getAllEvents() {
        return this.eventManager.getAllEvents();
    }
}

// Export cho cả ESM và UMD
export default DTUAppsmithRealtime; 