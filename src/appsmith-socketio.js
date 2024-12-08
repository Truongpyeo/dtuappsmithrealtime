(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['socket.io-client'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node.js
        module.exports = factory(require('socket.io-client'));
    } else {
        // Browser globals (root is window)
        root.AppsmithSocket = factory(root.io);
    }
}(typeof self !== 'undefined' ? self : this, function (io) {

    class AppsmithSocket {
        constructor() {
            this.socket = null;
            this.listeners = new Map();
        }

        // Kết nối đến server
        connect(url = 'https://socket.thanhtruongit.io.vn') {
            this.socket = io(url, {
                transports: ['websocket'],
                reconnection: true
            });

            // Xử lý các sự kiện cơ bản
            this.socket.on('connect', () => {
                console.log('Connected to socket server');
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from socket server');
            });

            return this;
        }

        // Gửi event đến server
        emit(eventName, data) {
            if (!this.socket) {
                throw new Error('Socket connection not established');
            }
            this.socket.emit(eventName, data);
        }

        // Lắng nghe event từ server
        on(eventName, callback) {
            if (!this.socket) {
                throw new Error('Socket connection not established');
            }
            
            // Lưu callback để có thể remove sau này
            this.listeners.set(eventName, callback);
            this.socket.on(eventName, callback);
        }

        // Hủy lắng nghe event
        off(eventName) {
            if (!this.socket) {
                throw new Error('Socket connection not established');
            }

            const callback = this.listeners.get(eventName);
            if (callback) {
                this.socket.off(eventName, callback);
                this.listeners.delete(eventName);
            }
        }

        // Ngắt kết nối
        disconnect() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
                this.listeners.clear();
            }
        }
    }

    return AppsmithSocket;
})); 