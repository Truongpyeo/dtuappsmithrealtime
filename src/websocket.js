class AppsmithWebSocket {
    constructor(url, options = {}) {
        this.url = url;
        this.callbacks = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    }

    connect() {
        this.ws = new WebSocket(this.url);
        this.setupEventHandlers();
    }

    on(event, callback) {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }
        this.callbacks.get(event).push(callback);
    }

    emit(event, data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ event, data }));
        }
    }

    setupEventHandlers() {
        this.ws.onmessage = (event) => {
            const { event: eventName, data } = JSON.parse(event.data);
            this.triggerCallbacks(eventName, data);
        }

        this.ws.onclose = () => {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => {
                    this.reconnectAttempts++;
                    this.connect();
                }, 1000 * Math.pow(2, this.reconnectAttempts));
            }
        }
    }
} 