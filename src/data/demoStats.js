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

function series(seed, base, growth) {
  const r = rng(seed);
  const end = new Date();
  const out = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(end);
    d.setDate(end.getDate() - (DAYS - 1 - i));
    const weekend = d.getDay() === 0 || d.getDay() === 6 ? 1.18 : 1;
    const visitors = Math.round((base + growth * i) * weekend * (0.85 + r() * 0.3));
    const visits = Math.round(visitors * (1.08 + r() * 0.06));
    const views = Math.round(visits * (1.25 + r() * 0.2));
    const mapClicks = Math.round(visits * (0.09 + r() * 0.06));
    out.push({ label: fmt(d), visitors, visits, views, mapClicks });
  }
  return out;
}

const sum = (arr, k) => arr.reduce((s, x) => s + x[k], 0);

export function buildDemo() {
  const daily = series(7, 38, 1.9);
  const prev = series(21, 30, 1.4);
  const tot = (a) => ({ visitors: sum(a, "visitors"), visits: sum(a, "visits"), views: sum(a, "views"), mapClicks: sum(a, "mapClicks") });
  const cur = tot(daily);
  const before = tot(prev);

  // Tổng chi phí quảng cáo ~1.6 triệu đồng
  const campaigns = [
    { name: "GIAOMUA1015", label: "Phòng bệnh giao mùa", visits: 612, mapClicks: 71, spend: 420000 },
    { name: "PHUNU2010", label: "Món quà phái đẹp 20/10", visits: 538, mapClicks: 68, spend: 480000 },
    { name: "HALLOWEEN3110", label: "Halloween cùng Boss", visits: 441, mapClicks: 49, spend: 400000 },
    { name: "TIEMPHONG", label: "Tiêm phòng & định kỳ", visits: 297, mapClicks: 30, spend: 300000 },
  ].map((c) => ({ ...c, rate: c.mapClicks / c.visits, cpv: Math.round(c.spend / c.visits) }));

  const hourly = [1, 0, 0, 0, 1, 2, 5, 14, 26, 31, 34, 38, 29, 22, 27, 30, 28, 33, 41, 46, 44, 32, 15, 6];

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
    avgDurationSec: 96,
    mapClickRate: 0.118,
    reviewClickRate: 0.064,
    zaloClickRate: 0.121,
    sources: [
      { name: "Facebook Ads", value: 1888, color: "#FFA400" },
      { name: "Fanpage (tự nhiên)", value: 425, color: "#7B391A" },
      { name: "Zalo", value: 247, color: "#C97D3D" },
      { name: "Google", value: 268, color: "#A6673C" },
      { name: "Truy cập trực tiếp", value: 193, color: "#EAD8C7" },
    ],
    devices: [
      { name: "Điện thoại", value: 0.84 },
      { name: "Máy tính", value: 0.14 },
      { name: "Máy tính bảng", value: 0.02 },
    ],
    hourly,
    services: [
      { name: "Khám & điều trị", value: 38 },
      { name: "Tiêm phòng", value: 29 },
      { name: "Spa & grooming", value: 24 },
      { name: "Khác", value: 9 },
    ],
    campaigns,
    interactions: [
      { name: "Bấm Zalo / Messenger", rate: 0.121 },
      { name: "Click vào bản đồ", rate: 0.118 },
      { name: "Click xem đánh giá Google", rate: 0.064 },
      { name: "Cuộn tới cuối trang", rate: 0.31 },
    ],
    recentMapClicks: [
      { time: "Hôm nay 09:42", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "PHUNU2010" },
      { time: "Hôm nay 08:15", device: "Điện thoại", area: "Nam Từ Liêm, Hà Nội", source: "GIAOMUA1015" },
      { time: "Hôm qua 20:31", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "PHUNU2010" },
      { time: "Hôm qua 17:08", device: "Máy tính", area: "Hà Đông, Hà Nội", source: "Facebook" },
      { time: "Hôm qua 11:54", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "HALLOWEEN3110" },
    ],
  };
}
