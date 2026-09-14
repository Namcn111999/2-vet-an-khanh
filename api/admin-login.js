// Kiểm tra mật khẩu trang /admin — chạy phía server nên mật khẩu thật không nằm
// trong file JS gửi về trình duyệt (đỡ lộ hơn so với so sánh ngay trên client).
//
// Bắt buộc cấu hình biến môi trường ADMIN_PASSWORD trên Vercel trước khi dùng
// (Project Settings → Environment Variables). Xem README.md mục "Trang Admin".
//
// Lưu ý thật lòng: đây là lớp bảo vệ đơn giản (không có tài khoản người dùng, không
// giới hạn số lần thử sai) — đủ dùng để chặn người ngoài tình cờ vào trang, KHÔNG phải
// bảo mật cấp doanh nghiệp. Phù hợp cho nhu cầu nội bộ 1 phòng khám nhỏ.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) {
    res.status(500).json({ ok: false, error: "Chưa cấu hình ADMIN_PASSWORD trên server." });
    return;
  }

  const { password } = req.body || {};
  res.status(200).json({ ok: password === correctPassword });
}
