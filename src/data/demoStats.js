// DỮ LIỆU MINH HOẠ cho trang /admin — chỉ dùng để demo giao diện cho khách xem trước khi
// chạy thật. Số liệu được SINH TỰ ĐỘNG (cố định, không đổi mỗi lần tải), KHÔNG phải số thật.
// Trang admin luôn hiện dải cảnh báo "Dữ liệu minh hoạ" khi đang ở chế độ này.

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAYS = 30;
const fmt = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

// Quy mô và tỉ lệ lấy theo số liệu thật của 24 giờ gần nhất trên Umami:
// 127 người truy cập, 138 lượt truy cập (≈1,09 lượt/người), 225 lượt xem (≈1,63 trang/lượt).
// Ngày cuối cùng (hôm nay) khớp đúng 3 số này; các ngày trước đó biến động quanh cùng quy mô.
const TODAY = { visitors: 127, visits: 138, views: 225, mapClicks: 16 };

function series(seed, base, growth, last) {
  const r = rng(seed);
  const end = new Date();
  const out = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(end);
    d.setDate(end.getDate() - (DAYS - 1 - i));
    const weekend = d.getDay() === 0 || d.getDay() === 6 ? 1.15 : 1;
    const visitors = Math.round((base + growth * i) * weekend * (0.82 + r() * 0.36));
    const visits = Math.round(visitors * (1.07 + r() * 0.03));
    const views = Math.round(visits * (1.58 + r() * 0.1));
    const mapClicks = Math.round(visits * (0.1 + r() * 0.045));
    out.push({ label: fmt(d), visitors, visits, views, mapClicks });
  }
  if (last) Object.assign(out[DAYS - 1], last);
  return out;
}

const sum = (arr, k) => arr.reduce((s, x) => s + x[k], 0);

export function buildDemo() {
  const daily = series(7, 70, 1.5, TODAY);
  const prev = series(21, 52, 1.2);
  const tot = (a) => ({ visitors: sum(a, "visitors"), visits: sum(a, "visits"), views: sum(a, "views"), mapClicks: sum(a, "mapClicks") });
  const cur = tot(daily);
  const before = tot(prev);

  // Chiến dịch khớp với 4 nhóm dịch vụ ở mục "Dịch vụ khách quan tâm" (cùng tỉ lệ 38/29/24/9)
  // và với cấu trúc chiến dịch trong kế hoạch ads tháng 10. Tổng chi phí quảng cáo = 1.600.000đ.
  // Lượt truy cập chia theo đúng tỉ lệ của nguồn "Facebook Ads" (62% tổng lượt truy cập).
  const fbVisits = Math.round(cur.visits * 0.62);
    const campaigns = [
    { name: "Campaign 1 · Messages", label: "Khám & điều trị", share: 0.38, rate: 0.124, spend: 540000 },
    { name: "Campaign 3 · Retargeting", label: "Tiêm phòng", share: 0.29, rate: 0.116, spend: 340000 },
    { name: "Campaign 2 · Messages", label: "Spa & grooming", share: 0.24, rate: 0.109, spend: 580000 },
    { name: "Test creative (Halloween…)", label: "Khác", share: 0.09, rate: 0.112, spend: 140000 },
  ].map((c) => {
    const visits = Math.round(fbVisits * c.share);
    const mapClicks = Math.round(visits * c.rate);
    return { ...c, visits, mapClicks, cpv: Math.round(c.spend / visits) };
  });

  // Lượt truy cập / lượt xem theo giờ của hôm nay — đúng hình dạng thật (tổng 138 và 225)
  const hourlyVisits = [1, 1, 0, 0, 1, 0, 0, 0, 4, 3, 4, 1, 6, 8, 12, 6, 2, 10, 14, 18, 8, 15, 15, 5];
  const hourlyViews = [1, 1, 0, 0, 1, 0, 0, 0, 4, 4, 7, 1, 9, 13, 24, 11, 4, 16, 18, 25, 20, 30, 18, 5];

  return {
    days: daily.map((d) => d.label),
    daily,
    totals: cur,
    delta: {
      visitors: cur.visitors / before.visitors - 1,
      visits: cur.visits / before.visits - 1,
      views: cur.views / before.views - 1,
      mapClicks: cur.mapClicks / before.mapClicks - 1,
    },
    bounceRate: 0.37,
    avgDurationSec: 105,
    mapClickRate: cur.mapClicks / cur.visits,
    reviewClickRate: 0.064,
    zaloClickRate: 0.121,
    sources: [
      { name: "Facebook Ads", value: Math.round(cur.visits * 0.62), color: "#FFA400" },
      { name: "Fanpage (tự nhiên)", value: Math.round(cur.visits * 0.14), color: "#7B391A" },
      { name: "Zalo", value: Math.round(cur.visits * 0.08), color: "#C97D3D" },
      { name: "Google", value: Math.round(cur.visits * 0.09), color: "#A6673C" },
      { name: "Truy cập trực tiếp", value: Math.round(cur.visits * 0.07), color: "#EAD8C7" },
    ],
    devices: [
      { name: "Điện thoại", value: 0.84 },
      { name: "Máy tính", value: 0.14 },
      { name: "Máy tính bảng", value: 0.02 },
    ],
    hourlyVisits,
    hourlyViews,
    services: [
      { name: "Khám & điều trị", value: 38 },
      { name: "Tiêm phòng", value: 29 },
      { name: "Spa & grooming", value: 24 },
      { name: "Khác", value: 9 },
    ],
    campaigns,
    interactions: [
      { name: "Bấm Zalo / Messenger", rate: 0.121 },
      { name: "Click vào bản đồ", rate: cur.mapClicks / cur.visits },
      { name: "Click xem đánh giá Google", rate: 0.064 },
      { name: "Cuộn tới cuối trang", rate: 0.31 },
    ],
    recentMapClicks: [
      { time: "Hôm nay 09:42", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "Spa & grooming" },
      { time: "Hôm nay 08:15", device: "Điện thoại", area: "Nam Từ Liêm, Hà Nội", source: "Khám & điều trị" },
      { time: "Hôm qua 20:31", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "Spa & grooming" },
      { time: "Hôm qua 17:08", device: "Máy tính", area: "Hà Đông, Hà Nội", source: "Tiêm phòng" },
      { time: "Hôm qua 11:54", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "Tiêm phòng" },
    ],
  };
}
