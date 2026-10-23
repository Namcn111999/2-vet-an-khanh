// DỮ LIỆU MINH HOẠ cho trang /admin — dùng để trình bày giao diện. Số liệu được SINH TỰ ĐỘNG
// theo công thức cố định (mỗi lần mở trang đều ra cùng một kết quả), không phải số thật.
//
// Quy mô lấy theo số liệu thật của 24 giờ gần nhất trên Umami: 127 người truy cập,
// 138 lượt truy cập, 225 lượt xem. Ngày cuối cùng (hôm nay) khớp đúng 3 số này, các ngày trước
// dao động quanh cùng quy mô. Có ~5 tháng lịch sử để chọn xem theo Ngày / Tuần / Tháng.

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const HISTORY_DAYS = 150;
const TODAY_TOTALS = { visitors: 127, visits: 138, views: 225, mapClicks: 16 };
const TODAY_HOURLY_VISITS = [1, 1, 0, 0, 1, 0, 0, 0, 4, 3, 4, 1, 6, 8, 12, 6, 2, 10, 14, 18, 8, 15, 15, 5];
const TODAY_HOURLY_VIEWS = [1, 1, 0, 0, 1, 0, 0, 0, 4, 4, 7, 1, 9, 13, 24, 11, 4, 16, 18, 25, 20, 30, 18, 5];
const HOUR_WEIGHTS = TODAY_HOURLY_VIEWS.map((v) => v + 0.4);
const WEEKDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const FB_SHARE = 0.62; // phần lượt truy cập đến từ Facebook Ads
const MONTH_AD_SPEND = 1600000; // chi phí quảng cáo 30 ngày gần nhất

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addMonths = (d, n) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
};
const two = (n) => String(n).padStart(2, "0");
export const keyOf = (d) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
export const dm = (d) => `${two(d.getDate())}/${two(d.getMonth() + 1)}`;
export const dmy = (d) => `${dm(d)}/${d.getFullYear()}`;

// Chia total theo trọng số, tổng đúng bằng total (phương pháp phần dư lớn nhất)
function distribute(total, weights, r) {
  const w = weights.map((x) => x * (0.75 + r() * 0.5));
  const sum = w.reduce((s, x) => s + x, 0);
  const raw = w.map((x) => (x / sum) * total);
  const out = raw.map(Math.floor);
  let rest = total - out.reduce((s, x) => s + x, 0);
  raw
    .map((x, i) => [x - Math.floor(x), i])
    .sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => { if (rest > 0) { out[i] += 1; rest -= 1; } });
  return out;
}

export function createModel() {
  const today = startOfDay(new Date());
  const r = rng(7);
  const days = [];
  for (let i = 0; i < HISTORY_DAYS; i++) {
    const date = addDays(today, -(HISTORY_DAYS - 1 - i));
    const isToday = i === HISTORY_DAYS - 1;
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? 1.15 : 1;
    let visitors = Math.round((52 + 0.45 * i) * weekend * (0.82 + r() * 0.36));
    let visits = Math.round(visitors * (1.07 + r() * 0.03));
    let views = Math.round(visits * (1.58 + r() * 0.1));
    let mapClicks = Math.round(visits * (0.1 + r() * 0.045));
    let hv, hw, hm;
    if (isToday) {
      ({ visitors, visits, views, mapClicks } = TODAY_TOTALS);
      hv = TODAY_HOURLY_VISITS;
      hw = TODAY_HOURLY_VIEWS;
    } else {
      hv = distribute(visits, HOUR_WEIGHTS, r);
      const extra = distribute(views - visits, HOUR_WEIGHTS, r);
      hw = hv.map((v, h) => v + extra[h]); // lượt xem luôn >= lượt truy cập trong mỗi giờ
    }
    hm = distribute(mapClicks, HOUR_WEIGHTS, r);
    days.push({ date, key: keyOf(date), visitors, visits, views, mapClicks, hourlyVisits: hv, hourlyViews: hw, hourlyMap: hm });
  }
  // Chi phí quảng cáo theo ngày tỉ lệ với lượt truy cập từ Facebook; 30 ngày gần nhất = 1.600.000đ
  const last30 = days.slice(-30).reduce((s, d) => s + d.visits * FB_SHARE, 0);
  const k = MONTH_AD_SPEND / last30;
  days.forEach((d) => { d.spend = Math.round((d.visits * FB_SHARE * k) / 1000) * 1000; });

  const byKey = new Map(days.map((d) => [d.key, d]));
  return { today, first: days[0].date, days, byKey };
}

// Khoảng ngày của kỳ đang xem: "day" = 1 ngày, "week" = tuần T2–CN, "month" = tháng dương lịch
export function periodRange(mode, anchor) {
  if (mode === "day") return { start: anchor, end: anchor };
  if (mode === "week") {
    const off = (anchor.getDay() + 6) % 7;
    const start = addDays(anchor, -off);
    return { start, end: addDays(start, 6) };
  }
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  return { start, end: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0) };
}

export function periodLabel(mode, anchor) {
  const { start, end } = periodRange(mode, anchor);
  if (mode === "day") return `${WEEKDAY[anchor.getDay()] === "CN" ? "Chủ nhật" : "Thứ " + (anchor.getDay() + 1)}, ${dmy(anchor)}`;
  if (mode === "week") return `Tuần ${dm(start)} – ${dmy(end)}`;
  return `Tháng ${two(anchor.getMonth() + 1)}/${anchor.getFullYear()}`;
}

export function shiftAnchor(mode, anchor, dir) {
  if (mode === "day") return addDays(anchor, dir);
  if (mode === "week") return addDays(anchor, 7 * dir);
  return addMonths(anchor, dir);
}

const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
const sumArr = (list, key) => Array.from({ length: 24 }, (_, h) => list.reduce((s, d) => s + d[key][h], 0));

export function computePeriod(model, mode, anchorIn) {
  const anchor = startOfDay(anchorIn > model.today ? model.today : anchorIn < model.first ? model.first : anchorIn);
  const { start, end } = periodRange(mode, anchor);
  const days = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    const item = model.byKey.get(keyOf(d));
    if (item) days.push(item);
  }
  // kỳ trước để so sánh: cùng số ngày, lùi 1 ngày / 1 tuần / 1 tháng
  const prevDays = days
    .map((d) => model.byKey.get(keyOf(mode === "day" ? addDays(d.date, -1) : mode === "week" ? addDays(d.date, -7) : addMonths(d.date, -1))))
    .filter(Boolean);
  const tot = (a) => ({ visitors: sum(a, (d) => d.visitors), visits: sum(a, (d) => d.visits), views: sum(a, (d) => d.views), mapClicks: sum(a, (d) => d.mapClicks), spend: sum(a, (d) => d.spend) });
  const cur = tot(days);
  const prev = prevDays.length === days.length ? tot(prevDays) : null;
  const delta = (k) => (prev && prev[k] ? cur[k] / prev[k] - 1 : undefined);

  // Biến động nhẹ, cố định theo kỳ, cho các chỉ số không cộng dồn được
  const j = rng(days.length ? Math.round(days[0].date.getTime() / 86400000) * 31 + days.length * 7 + (mode === "day" ? 1 : mode === "week" ? 2 : 3) : 1);
  const jit = (v, span) => v * (1 + (j() - 0.5) * span);
  const mapRate = cur.visits ? cur.mapClicks / cur.visits : 0;

  // Biểu đồ xu hướng: ngày → 14 ngày kết thúc ở ngày đang xem; tuần/tháng → chính kỳ đó
  const trend = mode === "day"
    ? Array.from({ length: 14 }, (_, i) => model.byKey.get(keyOf(addDays(anchor, i - 13)))).filter(Boolean)
    : days;
  const trendLabel = (d) => (mode === "week" ? `${WEEKDAY[d.date.getDay()]} ${dm(d.date)}` : dm(d.date));

  const hv = sumArr(days, "hourlyVisits");
  const hw = sumArr(days, "hourlyViews");
  const hm = sumArr(days, "hourlyMap");

  const shares = [0.38, 0.29, 0.24, 0.09];
  const spendShare = [0.3375, 0.2125, 0.3625, 0.0875];
  const rates = [0.124, 0.116, 0.109, 0.112];
  const fbVisits = Math.round(cur.visits * FB_SHARE);
  const campaigns = [
    { name: "Campaign 1 · Messages", label: "Khám & điều trị" },
    { name: "Campaign 3 · Retargeting", label: "Tiêm phòng" },
    { name: "Campaign 2 · Messages", label: "Spa & grooming" },
    { name: "Test creative (Halloween…)", label: "Khác" },
  ].map((c, i) => {
    const visits = Math.round(fbVisits * shares[i]);
    const spend = Math.round((cur.spend * spendShare[i]) / 1000) * 1000;
    const mapClicks = Math.round(visits * rates[i]);
    return { ...c, visits, mapClicks, spend, rate: visits ? mapClicks / visits : 0, cpv: visits ? Math.round(spend / visits) : 0 };
  });

  return {
    mode,
    anchor,
    range: { start, end },
    hasData: days.length > 0,
    totals: cur,
    delta: { visitors: delta("visitors"), views: delta("views"), mapClicks: delta("mapClicks") },
    trend: { labels: trend.map(trendLabel), visitors: trend.map((d) => d.visitors), views: trend.map((d) => d.views) },
    trendTitle: mode === "day" ? "14 ngày gần nhất" : mode === "week" ? "Từng ngày trong tuần" : "Từng ngày trong tháng",
    mapSeries: mode === "day"
      ? { labels: Array.from({ length: 24 }, (_, h) => `${h}h`), values: hm, unit: "giờ" }
      : { labels: days.map(trendLabel), values: days.map((d) => d.mapClicks), unit: "ngày" },
    hourlyVisits: hv,
    hourlyViews: hw,
    mapClickRate: mapRate,
    reviewClickRate: jit(0.064, 0.1),
    zaloClickRate: jit(0.121, 0.1),
    bounceRate: jit(0.37, 0.1),
    avgDurationSec: Math.round(jit(105, 0.1)),
    sources: [
      { name: "Facebook Ads", value: Math.round(cur.visits * FB_SHARE), color: "#FFA400" },
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
    services: [
      { name: "Khám & điều trị", value: 38 },
      { name: "Tiêm phòng", value: 29 },
      { name: "Spa & grooming", value: 24 },
      { name: "Khác", value: 9 },
    ],
    campaigns,
    recentMapClicks: [
      { time: "Hôm nay 09:42", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "Spa & grooming" },
      { time: "Hôm nay 08:15", device: "Điện thoại", area: "Nam Từ Liêm, Hà Nội", source: "Khám & điều trị" },
      { time: "Hôm qua 20:31", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "Spa & grooming" },
      { time: "Hôm qua 17:08", device: "Máy tính", area: "Hà Đông, Hà Nội", source: "Tiêm phòng" },
      { time: "Hôm qua 11:54", device: "Điện thoại", area: "Hoài Đức, Hà Nội", source: "Tiêm phòng" },
    ],
  };
}
