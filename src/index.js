import { io } from 'socket.io-client';

class EventManager {
    constructor() {
        this.events = new Map();
        this.handlers = new Map();
    }

    // Đăng ký event mới hoặc cập nhật event đã có
    registerEvent(eventName, options = {}) {
        const existingEvent = this.events.get(eventName);
        this.events.set(eventName, {
            enabled: options.enabled ?? true,
            handler: options.handler || eventName,
            format: options.format,
            description: options.description || '',
            ...options
        });
        return this.events.get(eventName);
    }

    // Xóa event
    removeEvent(eventName) {
        return this.events.delete(eventName);
    }

    // Bật/tắt event
    toggleEvent(eventName, enabled) {
        const event = this.events.get(eventName);
        if (event) {
            event.enabled = enabled;
            return true;
        }
        return false;
    }

    // Cập nhật cấu hình event
    updateEvent(eventName, options = {}) {
        const event = this.events.get(eventName);
        if (event) {
            Object.assign(event, options);
            return true;
        }
        return false;
    }

    // Lấy thông tin của một event
    getEvent(eventName) {
        return this.events.get(eventName);
    }

    // Lấy danh sách tất cả events
    getAllEvents() {
        return Array.from(this.events.entries()).map(([name, config]) => ({
            name,
            ...config
        }));
    }

    // Thêm lại phương thức emit
    emit(eventName, data) {
        const event = this.events.get(eventName);
        if (!event) {
            throw new Error(`Event ${eventName} is not registered`);
        }
        if (!event.enabled) {
            throw new Error(`Event ${eventName} is disabled`);
        }

        // Format data nếu có hàm format
        const formattedData = event.format ? event.format(data) : data;

        return {
            event: eventName,
            handler: event.handler || eventName,
            data: formattedData
        };
    }
}

export default class DTUAppsmithRealtime {
    constructor(options = {}) {
        this.url = options.url || 'ws://localhost:3555';
        this.socketType = options.socketType || 'websocket';
        this.socket = null;
        this.eventManager = new EventManager();
        this.eventHandlers = new Map();
        this.rooms = new Map();
        
        this.isConnected = false;
        this.isPending = false;
        this.lastError = null;

        // Đăng ký các events mặc định
        this._registerDefaultEvents();
    }

    _registerDefaultEvents() {
        // Đăng ký các events cơ bản
        this.eventManager.registerEvent('message', {
            handler: 'send_message',
            format: (data) => ({
                message: data.text
            })
        });

        this.eventManager.registerEvent('sos', {
            handler: 'sos',
            format: (data) => ({
                message: data.message,
                timestamp: new Date().toISOString()
            })
        });
    }

    // Phương thức để đăng ký event mới
    registerEvent(eventName, options = {}) {
        return this.eventManager.registerEvent(eventName, options);
    }

    // Sửa lại phương thức emit để sử dụng EventManager
    emit(eventName, data) {
        if (!this.isConnected) {
            throw new Error('Not connected to server');
        }

        try {
            const eventData = this.eventManager.emit(eventName, data);
            
            if (this.socketType === 'socketio') {
                this.socket.emit(eventData.handler, eventData.data);
            } else {
                this.socket.emit(eventData.event, eventData.data);
            }
        } catch (error) {
            console.error('Emit error:', error);
            throw error;
        }
    }

    // Thêm phương thức mới để khởi tạo events từ server
    async initializeEvents() {
        if (!this.isConnected) {
            throw new Error('Must be connected to initialize events');
        }

        return new Promise((resolve, reject) => {
            // Yêu cầu danh sách events từ server
            this.socket.emit('get_available_events');

            // Lắng nghe response chứa danh sách events
            this.socket.on('available_events', (data) => {
                try {
                    console.log('Received available events:', data.events);

                    // Đăng ký từng event
                    data.events.forEach(event => {
                        // Đăng ký event với EventManager
                        this.eventManager.registerEvent(event.name, {
                            handler: event.name,
                            enabled: true,
                            responseEvent: event.responseEvent
                        });

                        // Lắng nghe response cho event này
                        this.socket.on(event.responseEvent, (response) => {
                            this._emit(event.responseEvent, response);
                            console.log(`Received ${event.name} response:`, response);
                        });
                    });

                    resolve(data.events);
                } catch (error) {
                    console.error('Error initializing events:', error);
                    reject(error);
                }
            });

            // Thêm timeout để tránh treo
            setTimeout(() => {
                reject(new Error('Timeout waiting for events'));
            }, 5000);
        });
    }

    // Sửa lại phương thức connect để tự động khởi tạo events
    async connect() {
        try {
            this.socket = new SocketAdapter(this.socketType, this.url);
            this.socket.connect();

            // Đợi kết nối thành công
            await new Promise((resolve) => {
                this.socket.on('connect', () => {
                    this.isConnected = true;
                    this._emit('open');
                    resolve();
                });
            });

            // Khởi tạo events
            await this.initializeEvents();

            // Thiết lập các listeners khác
            this.socket.on('disconnect', () => {
                this.isConnected = false;
                this._emit('close');
            });

            this.socket.on('error', (error) => {
                this.lastError = error;
                this._emit('error', error);
            });

            // Lắng nghe tất cả messages
            this.socket.on('receive_message', (data) => {
                this._emit('message', data);
            });

        } catch (error) {
            this._emit('error', error);
            throw error;
        }
    }

    //Đăng ký event handler
    on(event, callback) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(callback);
    }

    // Hủy đăng ký event handler
    off(event, callback) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).delete(callback);
        }
    }

    // Xử lý room
    joinRoom(roomId) {
        if (!this.isConnected) {
            throw new Error('Not connected to server');
        }

        if (!this.rooms.has(roomId)) {
            const room = {
                roomId,
                broadcast: (event, data) => {
                    this.emit('room', {
                        roomId,
                        event,
                        data
                    });
                },
                leave: () => {
                    this.rooms.delete(roomId);
                    this.emit('leaveRoom', { roomId });
                }
            };
            
            this.rooms.set(roomId, room);
            this.emit('joinRoom', { roomId });
            return room;
        }
        
        return this.rooms.get(roomId);
    }

    // Private method để emit events
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

    // Private method để xử lý room messages
    _handleRoomMessage(data) {
        const { roomId, event, message } = data;
        if (this.rooms.has(roomId)) {
            this._emit(`room:${roomId}:${event}`, message);
        }
    }

    // Ngắt kết nối
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.rooms.clear();
        }
    }

    // Lấy trạng thái kết nối
    getState() {
        return {
            isConnected: this.isConnected,
            isPending: this.isPending,
            lastError: this.lastError
        };
    }

    // Thêm phương thức sendSOS
    sendSOS(message = 'Emergency!') {
        if (!this.isConnected) {
            throw new Error('Not connected to server');
        }

        if (this.socketType === 'socketio') {
            this.socket.emit('sos', {
                message: message,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('SOS only supported in socketio mode');
        }
    }

    // Thêm phương thức lắng nghe phản hồi SOS
    onSOSResponse(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        this.on('sos_received', callback);
    }

    // Thêm các phương thức quản lý events
    removeEvent(eventName) {
        return this.eventManager.removeEvent(eventName);
    }

    enableEvent(eventName) {
        return this.eventManager.toggleEvent(eventName, true);
    }

    disableEvent(eventName) {
        return this.eventManager.toggleEvent(eventName, false);
    }

    updateEventConfig(eventName, options = {}) {
        return this.eventManager.updateEvent(eventName, options);
    }

    getEventConfig(eventName) {
        return this.eventManager.getEvent(eventName);
    }

    getAllEvents() {
        return this.eventManager.getAllEvents();
    }

    // Thêm phương thức mới để lấy danh sách events từ server
    async fetchAvailableEvents() {
        if (!this.isConnected) {
            throw new Error('Must be connected to fetch events');
        }

        try {
            // Sử dụng fetch API để l�y danh sách events
            const response = await fetch(`${this.url.replace(/^ws/, 'http')}/api/available-events`);
            const data = await response.json();
            
            if (data.success) {
                console.log('Available events:', data.events);
                
                // Đăng ký events vào EventManager
                data.events.forEach(event => {
                    this.eventManager.registerEvent(event.name, {
                        handler: event.name,
                        enabled: true,
                        responseEvent: event.responseEvent,
                        ackEvent: event.ackEvent,
                        isDefault: event.isDefault
                    });

                    // Tự động đăng ký listeners cho event
                    if (event.responseEvent) {
                        this.socket.on(event.responseEvent, (response) => {
                            this._emit(event.responseEvent, response);
                            console.log(`Received ${event.name} response:`, response);
                        });
                    }
                    if (event.ackEvent) {
                        this.socket.on(event.ackEvent, (ack) => {
                            this._emit(event.ackEvent, ack);
                            console.log(`${event.name} acknowledged:`, ack);
                        });
                    }

                    // Tạo hàm emit cho event này
                    this[`emit_${event.name}`] = (data) => {
                        this.socket.emit(event.name, data);
                    };
                });

                return data.events;
            } else {
                throw new Error(data.error || 'Failed to fetch events');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    // Thêm phương thức helper để gửi event
    sendEvent(eventName, data) {
        const emitFunction = this[`emit_${eventName}`];
        if (emitFunction) {
            emitFunction(data);
        } else {
            console.warn(`Event ${eventName} is not available`);
        }
    }
}

export class SocketAdapter {
    constructor(type, url, options = {}) {
        this.type = type; // 'websocket' hoặc 'socketio'
        this.url = url;
        this.options = options;
        this.connection = null;
    }

    connect() {
        if (this.type === 'socketio') {
            this.connection = io(this.url, {
                transports: ['websocket'],
                autoConnect: true,
                ...this.options
            });
        } else {
            this.connection = new WebSocket(this.url);
        }
    }

    on(event, callback) {
        if (this.type === 'socketio') {
            this.connection.on(event, callback);
        } else {
            switch(event) {
                case 'connect':
                    this.connection.onopen = callback;
                    break;
                case 'disconnect':
                    this.connection.onclose = callback;
                    break;
                case 'error':
                    this.connection.onerror = callback;
                    break;
                case 'message':
                    this.connection.onmessage = (e) => {
                        const data = JSON.parse(e.data);
                        callback(data);
                    };
                    break;
            }
        }
    }

    emit(event, data) {
        if (this.type === 'socketio') {
            this.connection.emit(event, data);
        } else {
            this.connection.send(JSON.stringify({
                event,
                data
            }));
        }
    }

    disconnect() {
        if (this.type === 'socketio') {
            this.connection.disconnect();
        } else {
            this.connection.close();
        }
    }

    once(event, callback) {
        if (this.type === 'socketio') {
            this.connection.once(event, callback);
        } else {
            // Với WebSocket, tự implement once
            const onceCallback = (data) => {
                this.off(event, onceCallback);
                callback(data);
            };
            this.on(event, onceCallback);
        }
    }

    off(event, callback) {
        if (this.type === 'socketio') {
            this.connection.off(event, callback);
        } else {
            switch(event) {
                case 'connect':
                    this.connection.onopen = null;
                    break;
                case 'disconnect':
                    this.connection.onclose = null;
                    break;
                case 'error':
                    this.connection.onerror = null;
                    break;
                case 'message':
                    this.connection.onmessage = null;
                    break;
            }
        }
    }
} 