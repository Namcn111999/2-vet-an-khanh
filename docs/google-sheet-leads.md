# Nhận thông tin khách đặt lịch vào Google Sheet

1. Tạo Google Sheet mới (đặt tên tuỳ ý).
2. Menu **Tiện ích mở rộng > Apps Script**, xoá code mẫu, dán nội dung file `docs/apps-script.gs`, bấm lưu.
3. **Triển khai > Tạo bản triển khai mới > Loại: Ứng dụng web**. Thực thi bằng: **Tôi**. Người có quyền truy cập: **Bất kỳ ai**. Bấm Triển khai, cấp quyền khi được hỏi.
4. Copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
5. Vercel > Project > Settings > Environment Variables: thêm `VITE_LEAD_WEBHOOK_URL` = URL vừa copy (loại Config/Plain, không chọn Secret), rồi Redeploy.
6. Gửi thử form trên web, kiểm tra tab **Lead** trong Sheet.

Lưu ý: nếu sửa code Apps Script sau này, phải chọn **Quản lý bản triển khai > Chỉnh sửa > Phiên bản mới** thì mới có hiệu lực.
