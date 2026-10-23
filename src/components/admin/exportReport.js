// Xuất báo cáo Excel (.xlsx) cho kỳ đang xem trên dashboard: ngày / tuần / tháng / khoảng tùy chọn.
// Mỗi trang tính là một nhóm số liệu; toàn bộ lấy từ đúng kết quả đang hiển thị nên luôn khớp với màn hình.
// Thư viện xlsx chỉ được tải khi bấm xuất (import động) nên không làm nặng trang.

// Ghi chú cuối trang "Tổng quan" của file báo cáo (để trống nếu không cần).
const REPORT_NOTE = "";

const MODE_NAME = { day: "Ngày", week: "Tuần", month: "Tháng", range: "Khoảng thời gian" };
const two = (n) => String(n).padStart(2, "0");
const dmy = (d) => `${two(d.getDate())}/${two(d.getMonth() + 1)}/${d.getFullYear()}`;
const dmyFile = (d) => `${two(d.getDate())}-${two(d.getMonth() + 1)}-${d.getFullYear()}`;
const stamp = (d) => `${two(d.getHours())}:${two(d.getMinutes())} ${dmy(d)}`;

const pctCell = (v) => (v === undefined || v === null ? "" : { t: "n", v, z: "0.0%" });
const numCell = (v) => ({ t: "n", v, z: "#,##0" });
const moneyCell = (v) => ({ t: "n", v, z: '#,##0" đ"' });

function fileName(d, ext = "xlsx") {
  // tên file theo khoảng ngày thực sự có số liệu (không tính các ngày chưa tới)
  const start = d.rows[0].date;
  const end = d.rows[d.rows.length - 1].date;
  const span = start.getTime() === end.getTime() ? dmyFile(start) : `${dmyFile(start)}_den_${dmyFile(end)}`;
  const kind = { day: "Ngay", week: "Tuan", month: "Thang", range: "KhoangThoiGian" }[d.mode];
  return `BaoCao_2Vet_AnKhanh_${kind}_${span}.${ext}`;
}

export async function exportExcel(d, label) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const add = (name, aoa, widths) => {
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = widths.map((w) => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, ws, name);
  };
  const t = d.totals;
  const nDays = d.rows.length;
  const dur = d.avgDurationSec;

  // 1. Tổng quan
  const overview = [
    ["BÁO CÁO HOẠT ĐỘNG LANDING PAGE – 2VET AN KHÁNH"],
    ["Kỳ báo cáo", label],
    ["Loại kỳ", MODE_NAME[d.mode]],
    ["Số ngày", nDays],
    ["Xuất lúc", stamp(new Date())],
    [],
    ["Chỉ số", "Giá trị", "So với kỳ trước"],
    ["Người truy cập", numCell(t.visitors), pctCell(d.delta.visitors)],
    ["Lượt truy cập", numCell(t.visits), pctCell(d.delta.visits)],
    ["Lượt xem trang", numCell(t.views), pctCell(d.delta.views)],
    ["Lượt click vào bản đồ", numCell(t.mapClicks), pctCell(d.delta.mapClicks)],
    ["Tỉ lệ click vào bản đồ", pctCell(d.mapClickRate), ""],
    ["Tỉ lệ bấm Zalo / Messenger", pctCell(d.zaloClickRate), ""],
    ["Tỉ lệ click xem đánh giá Google", pctCell(d.reviewClickRate), ""],
    ["Tỉ lệ thoát", pctCell(d.bounceRate), ""],
    ["Thời gian trên trang (mm:ss)", `${Math.floor(dur / 60)}:${two(dur % 60)}`, ""],
    ["Chi phí quảng cáo", moneyCell(t.spend), pctCell(d.delta.spend)],
    ["Chi phí mỗi lượt truy cập từ quảng cáo", moneyCell(d.campaigns.reduce((s, c) => s + c.visits, 0) ? Math.round(t.spend / d.campaigns.reduce((s, c) => s + c.visits, 0)) : 0), ""],
  ];
  if (REPORT_NOTE) overview.push([], [REPORT_NOTE]);
  add("Tổng quan", overview, [40, 22, 18]);

  // 2. Theo ngày
  add("Theo ngày", [
    ["Ngày", "Người truy cập", "Lượt truy cập", "Lượt xem trang", "Click bản đồ", "Tỉ lệ click bản đồ", "Chi phí quảng cáo"],
    ...d.rows.map((r) => [dmy(r.date), numCell(r.visitors), numCell(r.visits), numCell(r.views), numCell(r.mapClicks), pctCell(r.visits ? r.mapClicks / r.visits : 0), moneyCell(r.spend)]),
    ["Tổng", numCell(t.visitors), numCell(t.visits), numCell(t.views), numCell(t.mapClicks), pctCell(t.visits ? t.mapClicks / t.visits : 0), moneyCell(t.spend)],
  ], [14, 16, 14, 16, 14, 18, 20]);

  // 3. Theo giờ (cộng dồn trong kỳ)
  add("Theo giờ", [
    ["Giờ", "Lượt truy cập", "Lượt xem trang"],
    ...d.hourlyVisits.map((v, h) => [`${two(h)}:00`, numCell(v), numCell(d.hourlyViews[h])]),
    ["Tổng", numCell(d.hourlyVisits.reduce((a, b) => a + b, 0)), numCell(d.hourlyViews.reduce((a, b) => a + b, 0))],
  ], [10, 16, 16]);

  // 4. Nguồn truy cập
  add("Nguồn truy cập", [
    ["Nguồn", "Lượt truy cập", "Tỉ trọng"],
    ...d.sources.map((s) => [s.name, numCell(s.value), pctCell(t.visits ? s.value / t.visits : 0)]),
    ["Tổng", numCell(d.sources.reduce((a, s) => a + s.value, 0)), pctCell(1)],
  ], [26, 16, 12]);

  // 5. Chiến dịch quảng cáo
  const ct = d.campaigns.reduce((a, c) => ({ visits: a.visits + c.visits, mapClicks: a.mapClicks + c.mapClicks, spend: a.spend + c.spend }), { visits: 0, mapClicks: 0, spend: 0 });
  add("Chiến dịch quảng cáo", [
    ["Nhóm dịch vụ", "Chiến dịch", "Lượt truy cập", "Click bản đồ", "Tỉ lệ click bản đồ", "Chi phí", "Chi phí / lượt truy cập"],
    ...d.campaigns.map((c) => [c.label, c.name, numCell(c.visits), numCell(c.mapClicks), pctCell(c.rate), moneyCell(c.spend), moneyCell(c.cpv)]),
    ["Tổng quảng cáo", "", numCell(ct.visits), numCell(ct.mapClicks), pctCell(ct.visits ? ct.mapClicks / ct.visits : 0), moneyCell(ct.spend), moneyCell(ct.visits ? Math.round(ct.spend / ct.visits) : 0)],
  ], [20, 28, 16, 14, 20, 18, 24]);

  // 6. Tương tác, dịch vụ, thiết bị
  add("Tương tác & dịch vụ", [
    ["Hành động của khách", "Tỉ lệ"],
    ["Click vào bản đồ", pctCell(d.mapClickRate)],
    ["Bấm Zalo / Messenger", pctCell(d.zaloClickRate)],
    ["Click xem đánh giá Google", pctCell(d.reviewClickRate)],
    [],
    ["Dịch vụ khách quan tâm", "Tỉ trọng"],
    ...d.services.map((s) => [s.name, pctCell(s.value / 100)]),
    [],
    ["Thiết bị", "Tỉ trọng"],
    ...d.devices.map((v) => [v.name, pctCell(v.value)]),
  ], [30, 14]);

  // 7. Khách click bản đồ gần đây
  add("Click bản đồ gần đây", [
    ["Thời gian", "Thiết bị", "Khu vực", "Dịch vụ quảng cáo"],
    ...d.recentMapClicks.map((r) => [r.time, r.device, r.area, r.source]),
  ], [20, 16, 24, 24]);

  XLSX.writeFile(wb, fileName(d));
}

// Xuất PDF tải thẳng về: chụp vùng báo cáo rồi cắt thành các trang A4
export async function exportPdf(el, d) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    windowWidth: 1100,
    ignoreElements: (n) => n.hasAttribute && n.hasAttribute("data-pdf-ignore"),
    onclone: (doc) => {
      doc.querySelectorAll("[data-pdf-only]").forEach((n) => {
        n.classList.remove("hidden");
        n.style.display = "block";
      });
    },
  });
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const m = 10;
  const w = pw - m * 2;
  const pageH = ph - m * 2;
  const mmPerPx = w / canvas.width;
  const slicePx = Math.floor(pageH / mmPerPx);
  for (let y = 0, page = 0; y < canvas.height; y += slicePx, page++) {
    const h = Math.min(slicePx, canvas.height - y);
    const part = document.createElement("canvas");
    part.width = canvas.width;
    part.height = h;
    const ctx = part.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, part.width, part.height);
    ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
    if (page > 0) pdf.addPage();
    pdf.addImage(part.toDataURL("image/jpeg", 0.92), "JPEG", m, m, w, h * mmPerPx);
  }
  pdf.save(fileName(d, "pdf"));
}
