# Appsmith Socket.IO Library

Thư viện Socket.IO đơn giản để sử dụng trong Appsmith.




## Cài đặt trong Appsmith

1. Thêm Socket.IO Client (bắt buộc):

Thêm URL sau vào Appsmith Resource Manager:
```
https://cdn.jsdelivr.net/npm/socket.io-client@4.7.4/dist/socket.io.min.js
```

2. Thêm Appsmith Socket.IO Library:
```
https://cdn.jsdelivr.net/npm/appsmith-socketio@3.0.0/dist/appsmith-socketio.min.js
```

## Cách sử dụng trong Appsmith

### 1. Khởi tạo kết nối trong Page Load:
```
https://cdn.jsdelivr.net/npm/socket.io-client@4.7.4/dist/socket.io.min.js
```

2. Thêm Appsmith Socket.IO Library:
```
https://cdn.jsdelivr.net/npm/appsmith-socketio@3.0.0/dist/appsmith-socketio.min.js
```

Tìm hiểu chi tiết hướng dẫn tại [Appsmith](https://docs.appsmith.com/core-concepts/writing-code/ext-libraries#prerequisites)



<code_block_to_apply_changes_from>

```javascript
// Page Load event
const socket = new AppsmithSocket().connect();
storeValue('socketClient', socket);
```

### 2. Lắng nghe events trong Page Load:

```javascript
const socket = appsmith.store.socketClient;

// Lắng nghe event 'message'
socket.on('message', (data) => {
  // Cập nhật state hoặc widget
  storeValue('lastMessage', data);
});

// Lắng nghe event 'notification'
socket.on('notification', (data) => {
  showAlert(data.message);
});
```

### 3. Gửi events từ Button/Widget:

```javascript
// Button onClick event
const socket = appsmith.store.socketClient;
socket.emit('message', {
  text: Input1.text,
  timestamp: new Date()
});
```

### 4. Ngắt kết nối khi rời page:

```javascript
// Page Unload event
const socket = appsmith.store.socketClient;
if (socket) {
  socket.disconnect();
}
```

### Ví dụ hoàn chỉnh cho một chat app đơn giản:

1. Page Load:

```javascript
// Khởi tạo socket và lưu vào store
const socket = new AppsmithSocket().connect();
storeValue('socketClient', socket);

// Lắng nghe tin nhắn mới
socket.on('chat_message', (data) => {
  // Giả sử bạn có một Table widget tên là MessageTable
  const currentMessages = MessageTable.tableData || [];
  storeValue('messages', [...currentMessages, data]);
});
```

2. Button Send Message:

```javascript
const socket = appsmith.store.socketClient;
const message = {
  text: MessageInput.text,
  sender: appsmith.user.email,
  timestamp: new Date()
};

// Gửi tin nhắn
socket.emit('chat_message', message);

// Clear input
resetWidget('MessageInput');
```

3. Table Widget Binding:

```javascript
// Bind data property với
{{appsmith.store.messages}}
```

## Xử lý lỗi và Reconnect

```javascript
const socket = new AppsmithSocket().connect();

socket.on('connect_error', (error) => {
  showAlert('Lỗi kết nối: ' + error.message, 'error');
});

socket.on('reconnect', (attemptNumber) => {
  showAlert('Đã kết nối lại sau ' + attemptNumber + ' lần thử');
});
```

## API Reference

### Phương thức
- `connect(url?)`: Kết nối đến server Socket.IO
- `emit(eventName, data)`: Gửi event
- `on(eventName, callback)`: Lắng nghe event
- `off(eventName)`: Hủy lắng nghe event
- `disconnect()`: Ngắt kết nối

### Events mặc định
- `connect`: Khi kết nối thành công
- `disconnect`: Khi mất kết nối
- `connect_error`: Khi có lỗi kết nối
- `reconnect`: Khi kết nối lại thành công

```
Lưu ý quan trọng:
1. Luôn thêm Socket.IO Client trước khi thêm thư viện này
2. Nên lưu instance socket vào store để tái sử dụng
3. Nhớ cleanup (disconnect) khi rời page
4. Xử lý các trường hợp mất kết nối và reconnect
5. Không nên tạo nhiều kết nối socket trong cùng một page
```

## 💡Nhà phát triển

- 📧 Email: thanhtruong23111999@gmail.com

- 📱 Hotline: 0376 659 652

*" 🏫 DTU_DZ - DUY TAN UNIVERSITY - SCS ✨"*

## 📞 Liên hệ
- Lê Thanh Trường       :  <u>thanhtruong23111999@gmail.com</u>
- Võ Văn Việt           :  <u>vietvo371@gmail.com</u>
- Nguyễn Ngọc Duy Thái  :  <u>kkdn011@gmail.com</u>

## 📚 Tài liệu
- [Hướng dẫn cài đặt](https://github.com/Truongpyeo/dtuappsmithrealtime/blob/master/docs/setup.md)

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
Dự án được phân phối dưới giấy phép [MIT License](https://github.com/Truongpyeo/dtuappsmithrealtime/blob/master/LICENSE)