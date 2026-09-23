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
//
// Ngoài lượt xem/lượt khách (traffic), file này còn đếm sự kiện "dat_lich" — đây là
// sự kiện được bắn lên mỗi khi khách bấm gửi form đặt lịch thành công (xem
// src/components/BookingFormSection.vue), cho biết CHUYỂN ĐỔI THẬT chứ không chỉ
// lượt ghé xem. Endpoint /events có thể khác tên tuỳ phiên bản Umami — nếu gọi lỗi,
// số "Lượt đặt lịch" sẽ tự hiện "—" thay vì làm hỏng cả trang.

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

  // Đếm số lần sự kiện "dat_lich" xảy ra trong khoảng thời gian, bằng cách lấy danh
  // sách sự kiện thô rồi đếm ở phía mình — cách này ổn định hơn qua các bản Umami
  // khác nhau so với dùng endpoint tổng hợp riêng cho event.
  async function leadsFor(startAt) {
    try {
      const url = `${baseUrl}/websites/${websiteId}/events?startAt=${startAt}&endAt=${now}&unit=day&timezone=Asia%2FHo_Chi_Minh`;
      const r = await fetch(url, { headers });
      if (!r.ok) return null;
      const d = await r.json();
      const list = Array.isArray(d) ? d : d.data || [];
      return list.filter((ev) => (ev.eventName || ev.name) === "dat_lich").length;
    } catch {
      return null;
    }
  }

  const [today, week, month, active, leadsToday, leadsWeek, leadsMonth] = await Promise.all([
    statsFor(now - DAY),
    statsFor(now - 7 * DAY),
    statsFor(now - 30 * DAY),
    activeNow(),
    leadsFor(now - DAY),
    leadsFor(now - 7 * DAY),
    leadsFor(now - 30 * DAY),
  ]);

  res.status(200).json({
    configured: true,
    today,
    week,
    month,
    activeNow: active,
    leads: { today: leadsToday, week: leadsWeek, month: leadsMonth },
  });
}
