# DTU Appsmith Realtime Plugin

## 🌟 Giới Thiệu
 
 DTU Appsmith Realtime Plugin là thư viện realtime Socket.IO cho Appsmith với các chức năng của DTU. Hỗ trợ kết nối realtime, quản lý phòng chat, và xử lý các sự kiện tùy chỉnh.
 
 Bạn có thể xem thêm thông tin tại
 -  GITHUB : [Realtime Appsmith Plugin](https://github.com/Truongpyeo/dtuappsmithrealtime)
 -  NPM : [Realtime Appsmith Plugin](https://www.npmjs.com/package/dtuappsmithrealtime/v/1.1.5)
### 🏆 Bối Cảnh
Plugin được phát triển như một phần của ứng dụng trong cuộc thi Mã Nguồn Mở năm 2024.

## ✨ Tính Năng
- Kết nối realtime qua WebSocket/Socket.IO
- Tự động kết nối lại khi mất kết nối
- Hỗ trợ các sự kiện: message, notification, sos
- Quản lý phòng chat (rooms)
- Lắng nghe sự kiện động
- Xử lý lỗi và retry tự động

## 📦 Cài đặt

### NPM

```bash
    npm install dtuappsmithrealtime
```

### CDN

```html
    <script src="https://cdn.jsdelivr.net/npm/dtuappsmithrealtime@1.1.5/dist/index.umd.js"></script>
```

### Appsmith
Thêm URL sau vào Resource của Appsmith:
```
    https://cdn.jsdelivr.net/npm/dtuappsmithrealtime@1.1.14/dist/index.umd.js
```

### Appsmith Setup
1. Thêm socket.io-client vào Resources của Appsmith:
```
    https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/dist/socket.io.min.js
```

2. Thêm DTUAppsmithRealtime:
```
    https://cdn.jsdelivr.net/npm/dtuappsmithrealtime@1.1.14/dist/index.esm.js
```

Tìm hiểu chi tiết tại [Appsmith](https://docs.appsmith.com/core-concepts/writing-code/ext-libraries#prerequisites)



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



## 📋 Yêu Cầu Tiên Quyết
- AppSmith version mới nhất
## 💡Nhà phát triển

- 📧 Email: thanhtruong23111999@gmail.com

- 📱 Hotline: 0376 659 652

*" 🏫 DTU_DZ - DUY TAN UNIVERSITY - SCS ✨"*

## 📞 Liên hệ
- Lê Thanh Trường       :  <u>thanhtruong23111999@gmail.com</u>
- Võ Văn Việt           :  <u>vietvo371@gmail.com</u>
- Nguyễn Ngọc Duy Thái  :  <u>kkdn011@gmail.com</u>



## 🤝 Đóng góp
Chúng tôi rất hoan nghênh mọi đóng góp! Xem [CONTRIBUTING](https://github.com/Truongpyeo/dtuappsmithrealtime/blob/master/CONTRIBUTING.md) để biết thêm chi tiết.

## 🔄 Quy trình phát triển
1. Fork repo này
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`) 
5. Tạo Pull Request

## 🐛 Báo lỗi
Nếu bạn phát hiện lỗi, vui lòng tạo issue mới với:
- Mô tả chi tiết lỗi
- Các bước tái hiện
- Screenshots nếu có
- Môi trường (browser, OS...)

## 📜 Changelog
Xem [CHANGELOG](https://github.com/Truongpyeo/dtuappsmithrealtime/blob/master/CHANGELOG.md) để biết lịch sử thay đổi.

## ⚖️ Code of Conduct
Xem [CODE_OF_CONDUCT](https://github.com/Truongpyeo/dtuappsmithrealtime/blob/master/CODE_OF_CONDUCT.md) để biết các quy tắc và hành vi được chấp nhận.

## Báo cáo lỗi & Góp ý
- Issues: [GitHub Issues](https://github.com/Truongpyeo/DTURelifeLink/issues)
- Security: Đối với các vấn đề bảo mật nhạy cảm, vui lòng liên hệ trực tiếp qua email: <u>thanhtruong23111999@gmail.com</u>


### 📝 License
Dự án này được cấp phép theo các điều khoản của giấy phép [MIT License](https://github.com/Truongpyeo/dtuappsmithrealtime/blob/master/LICENSE)

*"Được phát triển với ❤️ bởi Nhóm DTU-DZ"*
