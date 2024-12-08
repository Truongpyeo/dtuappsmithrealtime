# DTU Appsmith Realtime

![Version](https://img.shields.io/npm/v/dtuappsmithrealtime)
![License](https://img.shields.io/npm/l/dtuappsmithrealtime)
![Downloads](https://img.shields.io/npm/dt/dtuappsmithrealtime)

Thư viện realtime Socket.IO cho Appsmith với các chức năng của DTU. Hỗ trợ kết nối realtime, quản lý phòng chat, và xử lý các sự kiện tùy chỉnh.

## 📦 Cài đặt

### NPM 

```bash
npm install dtuappsmithrealtime
```

### GitHub Packages
```bash
npm install @Truongpyeo/dtuappsmithrealtime
```

### CDN 
```html
<script src="https://cdn.jsdelivr.net/npm/dtuappsmithrealtime@1.1.8/dist/index.umd.js"></script>
```

### Appsmith
Thêm URL sau vào Resource của Appsmith:
```
https://cdn.jsdelivr.net/npm/dtuappsmithrealtime@1.1.8/dist/index.umd.js
```

### Appsmith Setup

1. Thêm socket.io-client vào Resources của Appsmith:
```
https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/dist/socket.io.min.js
```

2. Thêm DTUAppsmithRealtime:
```
https://cdn.jsdelivr.net/npm/dtuappsmithrealtime@1.1.8/dist/index.umd.js
```

⚠️ Lưu ý: Phải thêm socket.io-client TRƯỚC khi thêm DTUAppsmithRealtime

## 🚀 Tính năng

* Kết nối realtime qua WebSocket/Socket.IO 
* Tự động kết nối lại khi mất kết nối
* Hỗ trợ các sự kiện: message, notification, sos
* Quản lý phòng chat (rooms)
* Lắng nghe sự kiện động
* Xử lý lỗi và retry tự động

## 🎯 Sử dụng

### Khởi tạo kết nối

```javascript
const client = new DTUAppsmithRealtime({
    url: 'your_socket_url',
    socketType: 'socketio'  // hoặc 'websocket'
});

await client.connect();
```

### Lắng nghe sự kiện

```javascript
// Lắng nghe sự kiện cơ bản
client.on('message', (data) => {
    console.log('Received message:', data);
});

// Lắng nghe sự kiện tùy chỉnh
client.listenToEvent('custom_event', (data) => {
    console.log('Received custom event:', data);
});
```

### Gửi sự kiện

```javascript
// Gửi message
client.emit('message', {
    text: 'Hello world'
});

// Gửi SOS
client.sendSOS('Emergency message');
```

### Quản lý phòng

```javascript
// Tham gia phòng
const room = client.joinRoom('room1');

// Gửi tin nhắn trong phòng
room.broadcast('message', {
    text: 'Hello room'
});

// Rời phòng
room.leave();
```

## 📝 API Reference

### Khởi tạo
* `constructor(options)`: Khởi tạo client
* `connect()`: Kết nối tới server
* `disconnect()`: Ngắt kết nối

### Sự kiện
* `on(event, callback)`: Đăng ký lắng nghe sự kiện
* `off(event, callback)`: Hủy đăng ký sự kiện
* `emit(event, data)`: Gửi sự kiện
* `listenToEvent(eventName, callback)`: Lắng nghe sự kiện động
* `stopListening(eventName)`: Dừng lắng nghe sự kiện

### Phòng
* `joinRoom(roomId)`: Tham gia phòng
* `leaveRoom(roomId)`: Rời phòng
* `broadcast(roomId, event, data)`: Gửi tin nhắn trong phòng

### Tiện ích
* `getState()`: Lấy trạng thái kết nối
* `getAllEvents()`: Lấy danh sách sự kiện
* `fetchAvailableEvents()`: Lấy sự kiện từ server

## 📄 License

MIT License

## 💡Nhà phát triển

📧 Email: thanhtruong23111999@gmail.com 

📱 Hotline: +84 376 659 652

## 📞 Liên hệ
- Lê Thanh Trường       :  <u>thanhtruong23111999@gmail.com</u>
- Võ Văn Việt           :  <u>vietvo371@gmail.com</u>
- Nguyễn Ngọc Duy Thái  :  <u>kkdn011@gmail.com</u>

*" 🏫 DTU_DZ - DUY TAN UNIVERSITY - SCS ✨"*

## Repository

[github.com/Truongpyeo/dtuappsmithrealtime](https://github.com/Truongpyeo/dtuappsmithrealtime)