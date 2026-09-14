// Lấy số liệu lượt truy cập từ Umami Analytics (real-time + hôm nay/7 ngày/30 ngày)
// cho trang /admin. Gọi từ server (không phải trực tiếp từ trình duyệt) để giữ kín
// API key của Umami.
//
// Cần cấu hình 3 biến môi trường trên Vercel trước khi dùng — xem README.md mục
// "Trang Admin" để biết cách lấy từng giá trị:
//   UMAMI_API_URL   — mặc định https://api.umami.is/v1 nếu dùng Umami Cloud
//   UMAMI_WEBSITE_ID
//   UMAMI_API_KEY
//
// Chưa cấu hình đủ 3 biến → trả về { configured: false } để trang /admin tự hiển thị
// hướng dẫn cấu hình thay vì báo lỗi khó hiểu.
//
// LƯU Ý: Umami có 2 bản (Cloud và tự host) với API hơi khác nhau theo từng phiên bản.
// Code dưới đây viết theo API Umami Cloud v1 tại thời điểm viết — nếu tự host Umami,
// có thể cần chỉnh lại đường dẫn endpoint hoặc cách đọc field trong response.

export default async function handler(req, res) {
  const baseUrl = (process.env.UMAMI_API_URL || "https://api.umami.is/v1").replace(/\/$/, "");
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const apiKey = process.env.UMAMI_API_KEY;

  if (!websiteId || !apiKey) {
    res.status(200).json({ configured: false });
    return;
  }

  const headers = { "x-umami-api-key": apiKey };
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  async function statsFor(startAt) {
    try {
      const url = `${baseUrl}/websites/${websiteId}/stats?startAt=${startAt}&endAt=${now}`;
      const r = await fetch(url, { headers });
      if (!r.ok) return null;
      const d = await r.json();
      return {
        pageviews: d.pageviews?.value ?? 0,
        visitors: d.visitors?.value ?? 0,
      };
    } catch {
      return null;
    }
  }

  async function activeNow() {
    try {
      const r = await fetch(`${baseUrl}/websites/${websiteId}/active`, { headers });
      if (!r.ok) return null;
      const d = await r.json();
      return Array.isArray(d) ? d.length : d?.visitors ?? null;
    } catch {
      return null;
    }
  }

  const [today, week, month, active] = await Promise.all([
    statsFor(now - DAY),
    statsFor(now - 7 * DAY),
    statsFor(now - 30 * DAY),
    activeNow(),
  ]);

  res.status(200).json({ configured: true, today, week, month, activeNow: active });
}
