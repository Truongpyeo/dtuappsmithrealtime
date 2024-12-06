class Room {
    constructor(roomId, socket) {
        this.roomId = roomId;
        this.socket = socket;
    }

    join() {
        this.socket.emit('join_room', { roomId: this.roomId });
    }

    leave() {
        this.socket.emit('leave_room', { roomId: this.roomId });
    }

    broadcast(event, data) {
        this.socket.emit('room_broadcast', {
            roomId: this.roomId,
            event,
            data
        });
    }
} 