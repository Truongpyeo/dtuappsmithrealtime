# Changelog

Tất cả những thay đổi đáng chú ý của dự án sẽ được ghi lại ở đây.

## [1.1.10] - 2024-12-08

### Added
- Thêm hỗ trợ ESM (ECMAScript Modules)
- Thêm file build index.esm.js cho modern JavaScript

### Changed
- Cải thiện cấu trúc build system
- Tối ưu hóa bundle size
- Cập nhật hướng dẫn cài đặt cho Appsmith
- Thêm hướng dẫn sử dụng ESM

### Fixed
- Sửa lỗi tương thích với Appsmith
- Cải thiện cách xử lý socket.io-client dependency

## [1.1.8] - 2024-12-08

### Changed
- Loại bỏ WebSocket, chỉ sử dụng Socket.IO
- Cải thiện cách xử lý kết nối và sự kiện
- Cập nhật README.md với hướng dẫn chi tiết hơn

### Added
- Thêm chức năng quản lý phòng chat (Room)
- Thêm các phương thức mới:
  - `listenToEvent()`
  - `stopListening()`
  - `getAllEvents()`
  - `fetchAvailableEvents()`
- Thêm xử lý lỗi tốt hơn
- Thêm tính năng tự động kết nối lại

## [1.1.7] - 2024-12-07

### Changed
- Sửa lỗi kết nối trong môi trường Node.js
- Cập nhật cấu hình webpack
- Cải thiện xử lý sự kiện

## [1.1.6] - 2024-12-06

### Added
- Thêm hỗ trợ cho Socket.IO
- Thêm các options cho kết nối

### Changed
- Cập nhật cấu trúc project
- Sửa lỗi trong việc xử lý callbacks

## [1.1.5] - 2024-12-05

### Added
- Phát hành phiên bản đầu tiên
- Hỗ trợ WebSocket và Socket.IO
- Các tính năng cơ bản:
  - Kết nối realtime
  - Gửi/nhận tin nhắn
  - Xử lý sự kiện

## [1.1.4] - 2024-12-04

### Added
- Thêm tính năng lắng nghe sự kiện động
- Thêm phương thức listenToEvent và stopListening
- Hỗ trợ đầy đủ cho Socket.IO

### Changed
- Cải thiện xử lý lỗi và kết nối lại
- Cập nhật tài liệu và ví dụ

### Fixed
- Sửa lỗi khi disconnect
- Sửa lỗi trong quản lý phòng

## [1.1.3] - 2024-12-03

### Added
- Thêm tính năng quản lý phòng
- Thêm các phương thức tiện ích

### Fixed
- Sửa lỗi reconnect
- Cải thiện performance

## [1.1.2] - 2024-12-02

### Added
- Hỗ trợ WebSocket và Socket.IO
- Thêm các sự kiện cơ bản

### Changed
- Tái cấu trúc code
- Cập nhật dependencies

## [1.1.1] - 2024-12-01

### Added
- Khởi tạo dự án
- Cấu trúc cơ bản của thư viện
- Tích hợp webpack và babel

### Changed
- Setup môi trường phát triển
- Cấu hình build system

## [1.1.0] - 2024-12-01

### Added
- Phiên bản beta đầu tiên
- Tính năng kết nối cơ bản
- Hệ thống xử lý sự kiện đơn giản