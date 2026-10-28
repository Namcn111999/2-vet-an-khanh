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

// Quảng cáo bắt đầu chạy từ 10/10/2026, nên dữ liệu mẫu cũng bắt đầu từ ngày này.
// 24/10/2026 là ngày khớp đúng số liệu thật 24 giờ gần nhất (127 / 138 / 225).
const FIRST_DAY = new Date(2026, 9, 10);
const REAL_DAY = new Date(2026, 9, 24);
const SPEND_TOTAL_TO_REAL_DAY = 1600000; // tổng chi phí quảng cáo từ 10/10 đến 24/10
const TODAY_TOTALS = { visitors: 127, visits: 138, views: 225, mapClicks: 47 };
const TODAY_HOURLY_VISITS = [5, 1, 0, 0, 1, 0, 0, 0, 4, 3, 4, 1, 6, 8, 12, 6, 2, 10, 14, 18, 8, 15, 15, 5];
const TODAY_HOURLY_VIEWS = [14, 1, 0, 0, 1, 0, 0, 0, 4, 4, 7, 1, 9, 13, 24, 11, 4, 16, 18, 25, 20, 30, 18, 5];
// 25/10: số thật đo lúc 20:31 (Umami) – ngày chưa kết thúc nên các giờ sau 20h chưa có số
const DAY25 = { key: "2026-10-25", visitors: 76, visits: 80, views: 105, mapClicks: 27, lastHour: 20 };
// 27/10: số thật Umami "24 giờ gần nhất" (chụp 12:21 ngày 28/10) – xếp theo giờ trong ngày
const DAY27 = {
  key: "2026-10-27", visitors: 107, visits: 111, views: 135, mapClicks: 38,
  hv: [2, 1, 1, 1, 5, 1, 5, 5, 6, 11, 9, 7, 7, 3, 3, 11, 6, 1, 4, 5, 6, 2, 7, 2],
  hw: [2, 1, 1, 1, 6, 2, 7, 7, 8, 16, 11, 7, 9, 3, 3, 13, 7, 1, 4, 5, 6, 2, 11, 2],
};
const HOUR_WEIGHTS = TODAY_HOURLY_VIEWS.map((v) => v + 0.4);
const WEEKDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
// 3 nhóm dịch vụ chính — dùng chung cho mục "Dịch vụ khách quan tâm" và bảng chiến dịch để luôn khớp nhau.
// share = tỉ lệ quan tâm (cũng là tỉ lệ lượt truy cập quảng cáo), spend = tỉ lệ chi phí, rate = tỉ lệ click bản đồ.
const SERVICE_GROUPS = [
  { label: "Khám & điều trị", campaign: "Campaign 1 · Messages", share: 0.42, spend: 0.37, rate: 0.355 },
  { label: "Tiêm phòng", campaign: "Campaign 3 · Retargeting", share: 0.32, spend: 0.23, rate: 0.34 },
  { label: "Spa & grooming", campaign: "Campaign 2 · Messages", share: 0.26, spend: 0.4, rate: 0.325 },
];
const FB_SHARE = 0.4; // phần lượt truy cập đến từ Facebook Ads (Google, Fanpage, Zalo… là các nguồn còn lại)
const DAILY_AD_BUDGET = 150000; // ngân sách quảng cáo đang cài mỗi ngày

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
  if (!sum) return w.map(() => 0);
  const raw = w.map((x) => (x / sum) * total);
  const out = raw.map(Math.floor);
  let rest = total - out.reduce((s, x) => s + x, 0);
  raw
    .map((x, i) => [x - Math.floor(x), i])
    .sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => { if (rest > 0) { out[i] += 1; rest -= 1; } });
  return out;
}

// Chia total theo tỉ lệ, kết quả là số nguyên và tổng luôn đúng bằng total
function allocate(total, shares) {
  const sumShares = shares.reduce((a, b) => a + b, 0);
  const raw = shares.map((x) => (x / sumShares) * total);
  const out = raw.map(Math.floor);
  let rest = total - out.reduce((a, b) => a + b, 0);
  raw
    .map((x, i) => [x - Math.floor(x), i])
    .sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => { if (rest > 0) { out[i] += 1; rest -= 1; } });
  return out;
}

export function createModel() {
  let today = startOfDay(new Date());
  if (today < REAL_DAY) today = REAL_DAY;
  const n = Math.round((today - FIRST_DAY) / 86400000) + 1;
  const r = rng(7);
  const days = [];
  for (let i = 0; i < n; i++) {
    const date = addDays(FIRST_DAY, i);
    const isReal = keyOf(date) === keyOf(REAL_DAY);
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? 1.15 : 1;
    // lượt truy cập tăng dần theo ngân sách quảng cáo trong 2 tuần đầu rồi đi ngang
    let visitors = Math.round((62 + 4 * Math.min(i, 14)) * weekend * (0.87 + r() * 0.26));
    let visits = Math.round(visitors * (1.07 + r() * 0.03));
    let views = Math.round(visits * (1.58 + r() * 0.1));
    // click vào bản đồ là hành động chiếm tỉ trọng cao nhất (~31–37% lượt truy cập)
    let mapClicks = Math.round(visits * (0.31 + r() * 0.06));
    let hv, hw, hm;
    if (isReal) {
      ({ visitors, visits, views, mapClicks } = TODAY_TOTALS);
      hv = TODAY_HOURLY_VISITS;
      hw = TODAY_HOURLY_VIEWS;
    } else {
      hv = distribute(visits, HOUR_WEIGHTS, r);
      const extra = distribute(views - visits, HOUR_WEIGHTS, r);
      hw = hv.map((v, h) => v + extra[h]); // lượt xem luôn >= lượt truy cập trong mỗi giờ
    }
    let mw = HOUR_WEIGHTS;
    if (keyOf(date) === DAY25.key) {
      ({ visitors, visits, views, mapClicks } = DAY25);
      mw = HOUR_WEIGHTS.map((w, h) => (h <= DAY25.lastHour ? w : 0));
      hv = distribute(visits, mw, r);
      const extra = distribute(views - visits, mw, r);
      hw = hv.map((v, h) => v + extra[h]);
    }
    // Ngày hôm nay (realtime): chỉ có số liệu từ 0h đến giờ hiện tại, các giờ sau chưa phát sinh
    let partial = false;
    let elapsed = 1;
    const nowD = new Date();
    if (!isReal && keyOf(date) !== DAY25.key && keyOf(date) === keyOf(nowD)) {
      partial = true;
      const nh = nowD.getHours();
      elapsed = (nh + nowD.getMinutes() / 60) / 24;
      mw = HOUR_WEIGHTS.map((w, h) => (h < nh ? w : h === nh ? w * (nowD.getMinutes() / 60) : 0));
      const frac = mw.reduce((a, b) => a + b, 0) / HOUR_WEIGHTS.reduce((a, b) => a + b, 0);
      visits = Math.round(visits * frac);
      views = Math.max(visits, Math.round(views * frac));
      visitors = Math.min(visits, Math.round(visitors * frac));
      mapClicks = Math.round(visits * (0.31 + r() * 0.06));
      hv = distribute(visits, mw, r);
      const extra = distribute(views - visits, mw, r);
      hw = hv.map((v, h) => v + extra[h]);
    }
    if (keyOf(date) === DAY27.key) {
      ({ visitors, visits, views, mapClicks } = DAY27);
      hv = DAY27.hv;
      hw = DAY27.hw;
    }
    hm = distribute(mapClicks, mw, r);
    // Đặc điểm riêng của từng ngày: nguồn, thiết bị, dịch vụ, tỉ lệ… khác nhau giữa các ngày
    const ra = rng(Math.round(date.getTime() / 86400000) * 13 + 5);
    const srcCounts = allocate(visits, [FB_SHARE * (0.92 + ra() * 0.16), 0.15 * (0.75 + ra() * 0.5), 0.09 * (0.7 + ra() * 0.6), 0.28 * (0.85 + ra() * 0.3), 0.08 * (0.7 + ra() * 0.6)]);
    const mob = 0.77 + ra() * 0.1;
    const tab = 0.01 + ra() * 0.03;
    const devCounts = allocate(visits, [mob, 1 - mob - tab, tab]);
    const svcVisits = allocate(srcCounts[0], SERVICE_GROUPS.map((g) => g.share * (0.82 + ra() * 0.36)));
    const svcMap = SERVICE_GROUPS.map((g, k) => Math.round(svcVisits[k] * g.rate * (0.9 + ra() * 0.2)));
    days.push({
      date, key: keyOf(date), visitors, visits, views, mapClicks, hourlyVisits: hv, hourlyViews: hw, hourlyMap: hm,
      partial, elapsed, srcCounts, devCounts, svcVisits, svcMap,
      bounce: 0.33 + ra() * 0.08, duration: 92 + ra() * 28, reviewRate: 0.052 + ra() * 0.026, zaloRate: 0.13 + ra() * 0.05,
    });
  }

  // Chi phí quảng cáo: ngân sách cài 150.000đ/ngày hiện tại (24/10). Những ngày đầu chi thấp hơn rồi tăng dần,
  // tổng từ 10/10 đến 24/10 đúng bằng 1.600.000đ. Sau 24/10 chi quanh mức ngân sách.
  const realIdx = days.findIndex((d) => d.key === keyOf(REAL_DAY));
  const ramp = Array.from({ length: realIdx }, (_, i) => 63 + (87 * i) / realIdx);
  const rampSpend = allocate(Math.round((SPEND_TOTAL_TO_REAL_DAY - DAILY_AD_BUDGET) / 1000), ramp).map((x) => x * 1000);
  const rs = rng(99);
  days.forEach((d, i) => {
    if (i < realIdx) d.spend = rampSpend[i];
    else if (i === realIdx) d.spend = DAILY_AD_BUDGET;
    else d.spend = Math.round((DAILY_AD_BUDGET * (0.92 + rs() * 0.16) * d.elapsed) / 1000) * 1000;
    const sr = rng(i * 17 + 3);
    d.svcSpend = allocate(Math.round(d.spend / 1000), SERVICE_GROUPS.map((g) => g.spend * (0.88 + sr() * 0.24))).map((x) => x * 1000);
  });

  const byKey = new Map(days.map((d) => [d.key, d]));
  return { today, first: days[0].date, days, byKey };
}

// Khoảng ngày của kỳ đang xem: "day" = 1 ngày, "week" = tuần T2–CN, "month" = tháng dương lịch
export function periodRange(mode, anchor, range) {
  if (mode === "range" && range) return { start: range.start, end: range.end };
  if (mode === "day") return { start: anchor, end: anchor };
  if (mode === "week") {
    const off = (anchor.getDay() + 6) % 7;
    const start = addDays(anchor, -off);
    return { start, end: addDays(start, 6) };
  }
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  return { start, end: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0) };
}

export function periodLabel(mode, anchor, range) {
  const { start, end } = periodRange(mode, anchor, range);
  if (mode === "range") return start.getTime() === end.getTime() ? dmy(start) : `${dm(start)} – ${dmy(end)}`;
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

export function computePeriod(model, mode, anchorIn, rangeIn) {
  const anchor = startOfDay(anchorIn > model.today ? model.today : anchorIn < model.first ? model.first : anchorIn);
  // khoảng tùy chọn: sắp xếp lại nếu chọn ngược, kẹp trong phạm vi dữ liệu có sẵn
  let range = null;
  if (mode === "range" && rangeIn) {
    let a = startOfDay(rangeIn.start);
    let b = startOfDay(rangeIn.end);
    if (a > b) [a, b] = [b, a];
    range = { start: a < model.first ? model.first : a, end: b > model.today ? model.today : b };
  }
  const { start, end } = periodRange(mode, anchor, range);
  const days = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    const item = model.byKey.get(keyOf(d));
    if (item) days.push(item);
  }
  // kỳ trước để so sánh: cùng số ngày, lùi 1 ngày / 1 tuần / 1 tháng
  const prevDays = days
    .map((d) => model.byKey.get(keyOf(
      mode === "day" ? addDays(d.date, -1)
      : mode === "week" ? addDays(d.date, -7)
      : mode === "range" ? addDays(d.date, -days.length)
      : addMonths(d.date, -1)
    )))
    .filter(Boolean);
  const tot = (a) => ({ visitors: sum(a, (d) => d.visitors), visits: sum(a, (d) => d.visits), views: sum(a, (d) => d.views), mapClicks: sum(a, (d) => d.mapClicks), spend: sum(a, (d) => d.spend) });
  const cur = tot(days);
  const prev = prevDays.length === days.length ? tot(prevDays) : null;
  const delta = (k) => (prev && prev[k] ? cur[k] / prev[k] - 1 : undefined);

  // Biến động nhẹ, cố định theo kỳ, cho các chỉ số không cộng dồn được
  const j = rng(days.length ? Math.round(days[0].date.getTime() / 86400000) * 31 + days.length * 7 + (mode === "day" ? 1 : mode === "week" ? 2 : 3) : 1);
  const jit = (v, span) => v * (1 + (j() - 0.5) * span);
  const mapRate = cur.visits ? cur.mapClicks / cur.visits : 0;

  const single = mode === "day" || (mode === "range" && days.length === 1);
  // Biểu đồ xu hướng: ngày → 14 ngày kết thúc ở ngày đang xem; tuần/tháng → chính kỳ đó
  const trend = single
    ? Array.from({ length: 14 }, (_, i) => model.byKey.get(keyOf(addDays(days[0] ? days[0].date : anchor, i - 13)))).filter(Boolean)
    : days;
  const trendLabel = (d) => (mode === "week" ? `${WEEKDAY[d.date.getDay()]} ${dm(d.date)}` : dm(d.date));

  const hv = sumArr(days, "hourlyVisits");
  const hw = sumArr(days, "hourlyViews");
  const hm = sumArr(days, "hourlyMap");

  // Nguồn truy cập: tổng các nguồn luôn bằng đúng tổng lượt truy cập của kỳ
  const srcVals = [0, 1, 2, 3, 4].map((k) => sum(days, (d) => d.srcCounts[k]));
  const wavg = (f) => (cur.visits ? sum(days, (d) => f(d) * d.visits) / cur.visits : 0);
  const devVals = [0, 1, 2].map((k) => sum(days, (d) => d.devCounts[k]));
  const sourceList = [
    { name: "Facebook Ads", color: "#FFA400" },
    { name: "Fanpage (tự nhiên)", color: "#7B391A" },
    { name: "Zalo", color: "#C97D3D" },
    { name: "Google", color: "#A6673C" },
    { name: "Truy cập trực tiếp", color: "#EAD8C7" },
  ].map((x, i) => ({ ...x, value: srcVals[i] }));

  // Chiến dịch: lượt truy cập chia hết phần "Facebook Ads", chi phí chia hết tổng chi phí của kỳ
  const fbVisits = srcVals[0];
  const visitsBy = SERVICE_GROUPS.map((g, k) => sum(days, (d) => d.svcVisits[k]));
  const spendBy = SERVICE_GROUPS.map((g, k) => sum(days, (d) => d.svcSpend[k]));
  const mapBy = SERVICE_GROUPS.map((g, k) => sum(days, (d) => d.svcMap[k]));
  const campaigns = SERVICE_GROUPS.map((g, i) => {
    const visits = visitsBy[i];
    const spend = spendBy[i];
    const mapClicks = mapBy[i];
    return { name: g.campaign, label: g.label, visits, mapClicks, spend, rate: visits ? mapClicks / visits : 0, cpv: visits ? Math.round(spend / visits) : 0 };
  });

  // Khách click bản đồ gần đây trong kỳ đang xem: lấy từ các giờ có click, mới nhất trước
  const areas = ["Hoài Đức, Hà Nội", "Hoài Đức, Hà Nội", "Nam Từ Liêm, Hà Nội", "Hà Đông, Hà Nội", "Thanh Xuân, Hà Nội"];
  const svcs = SERVICE_GROUPS.map((g) => g.label);
  const when = (dt) => {
    const diff = Math.round((model.today - dt) / 86400000);
    return diff === 0 ? "Hôm nay" : diff === 1 ? "Hôm qua" : dm(dt);
  };
  const recent = [];
  const rr = rng(days.length ? Math.round(days[0].date.getTime() / 86400000) + 5 : 5);
  for (let i = days.length - 1; i >= 0 && recent.length < 5; i--) {
    for (let h = 23; h >= 0 && recent.length < 5; h--) {
      if (days[i].hourlyMap[h] > 0) {
        const mm = Math.floor(rr() * 60);
        recent.push({
          time: `${when(days[i].date)} ${two(h)}:${two(mm)}`,
          device: rr() < 0.84 ? "Điện thoại" : "Máy tính",
          area: areas[Math.floor(rr() * areas.length)],
          source: svcs[Math.floor(rr() * svcs.length)],
        });
      }
    }
  }

  return {
    mode,
    single,
    anchor,
    range: { start, end },
    hasData: days.length > 0,
    totals: cur,
    delta: { visitors: delta("visitors"), visits: delta("visits"), views: delta("views"), mapClicks: delta("mapClicks"), spend: delta("spend") },
    // số liệu từng ngày trong kỳ — dùng cho báo cáo xuất file
    rows: days.map((d) => ({ date: d.date, visitors: d.visitors, visits: d.visits, views: d.views, mapClicks: d.mapClicks, spend: d.spend })),
    trend: { labels: trend.map(trendLabel), visitors: trend.map((d) => d.visitors), views: trend.map((d) => d.views) },
    trendTitle: single ? "14 ngày kết thúc ở ngày đang xem" : mode === "week" ? "Từng ngày trong tuần" : mode === "month" ? "Từng ngày trong tháng" : "Từng ngày trong khoảng đã chọn",
    mapSeries: single
      ? { labels: Array.from({ length: 24 }, (_, h) => `${h}h`), values: hm, unit: "giờ" }
      : { labels: days.map(trendLabel), values: days.map((d) => d.mapClicks), unit: "ngày" },
    hourlyVisits: hv,
    hourlyViews: hw,
    mapClickRate: mapRate,
    reviewClickRate: wavg((d) => d.reviewRate),
    zaloClickRate: wavg((d) => d.zaloRate),
    bounceRate: wavg((d) => d.bounce),
    avgDurationSec: Math.round(wavg((d) => d.duration)),
    sources: sourceList,
    devices: [
      { name: "Điện thoại", value: cur.visits ? devVals[0] / cur.visits : 0 },
      { name: "Máy tính", value: cur.visits ? devVals[1] / cur.visits : 0 },
      { name: "Máy tính bảng", value: cur.visits ? devVals[2] / cur.visits : 0 },
    ],
    services: (() => {
      const pc = allocate(100, visitsBy.map((v) => v || 0.0001));
      return SERVICE_GROUPS.map((g, i) => ({ name: g.label, value: pc[i] }));
    })(),
    campaigns,
    recentMapClicks: recent,
  };
}
