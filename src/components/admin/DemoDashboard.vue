<template>
  <div>
    <!-- Chọn kỳ xem: Ngày / Tuần / Tháng, lùi-tiến kỳ và chọn ngày cụ thể -->
    <!-- Tiêu đề chỉ hiện khi in / lưu PDF -->
    <div class="hidden print:block mb-6">
      <h2 class="font-display text-2xl text-clay-dark" style="font-weight: 600">Báo cáo hoạt động landing page – 2Vet An Khánh</h2>
      <p class="text-sm text-ink/60 mt-1">Kỳ báo cáo: {{ label }} ({{ d.rows.length }} ngày) · Xuất lúc {{ nowText }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-6 print:hidden">
      <div class="inline-flex rounded-full border border-line bg-white p-1 text-sm" role="tablist" aria-label="Khoảng thời gian">
        <button
          v-for="m in modes" :key="m.id" role="tab" :aria-selected="mode === m.id" @click="mode = m.id"
          class="px-4 py-1.5 rounded-full transition-colors"
          :class="mode === m.id ? 'bg-clay-dark text-paper' : 'text-ink/60 hover:text-ink'"
        >{{ m.label }}</button>
      </div>

      <div v-if="mode !== 'range'" class="inline-flex items-center gap-1">
        <button @click="move(-1)" :disabled="!canPrev" aria-label="Kỳ trước" class="w-9 h-9 rounded-full border border-line bg-white text-ink/70 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed">‹</button>
        <span class="px-3 text-sm font-semibold text-clay-dark min-w-[11rem] text-center">{{ label }}</span>
        <button @click="move(1)" :disabled="!canNext" aria-label="Kỳ sau" class="w-9 h-9 rounded-full border border-line bg-white text-ink/70 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed">›</button>
      </div>

      <label v-if="mode !== 'range'" class="inline-flex items-center gap-2 text-sm text-ink/60">
        <span class="hidden sm:inline">Chọn ngày</span>
        <input
          type="date" :value="dateInput" :min="minInput" :max="maxInput" @change="pickDate"
          class="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber/40"
        />
      </label>
      <button v-if="mode !== 'range' && !isCurrent" @click="anchor = model.today" class="text-sm text-clay-dark hover:text-clay font-medium">Về hôm nay</button>

      <!-- Khoảng thời gian tùy chọn: từ ngày – đến ngày, kèm mốc chọn nhanh -->
      <template v-if="mode === 'range'">
        <label class="inline-flex items-center gap-2 text-sm text-ink/60">
          Từ
          <input type="date" :value="toInput(rangeStart)" :min="minInput" :max="maxInput" @change="setRange('start', $event)"
            class="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber/40" />
        </label>
        <label class="inline-flex items-center gap-2 text-sm text-ink/60">
          đến
          <input type="date" :value="toInput(rangeEnd)" :min="minInput" :max="maxInput" @change="setRange('end', $event)"
            class="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber/40" />
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="p in presets" :key="p.days" @click="applyPreset(p.days)"
            class="px-3 py-1.5 rounded-full border text-xs font-medium transition-colors"
            :class="activePreset === p.days ? 'border-clay-dark bg-clay-dark text-paper' : 'border-line bg-white text-ink/60 hover:text-ink'"
          >{{ p.label }}</button>
        </div>
      </template>

      <!-- Xuất báo cáo theo đúng kỳ đang xem -->
      <div class="relative ml-auto" ref="exportEl">
        <button
          @click="exportOpen = !exportOpen" :disabled="exporting" aria-haspopup="menu" :aria-expanded="exportOpen"
          class="btn-primary !py-2 !px-5 text-sm"
        >
          {{ exporting ? "Đang xuất..." : "Xuất báo cáo" }} <span aria-hidden="true">▾</span>
        </button>
        <div v-if="exportOpen" role="menu" class="absolute right-0 mt-2 w-64 rounded-2xl border border-line bg-white shadow-lg p-2 z-20">
          <p class="px-3 pt-1 pb-2 text-xs text-ink/45">Báo cáo theo kỳ đang xem:<br /><b class="text-clay-dark">{{ label }}</b></p>
          <button role="menuitem" @click="doExcel" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-tan text-sm text-ink">
            Excel (.xlsx)<span class="block text-xs text-ink/45">Đầy đủ số liệu, nhiều trang tính</span>
          </button>
          <button role="menuitem" @click="doPdf" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-tan text-sm text-ink">
            PDF (in / lưu thành PDF)<span class="block text-xs text-ink/45">Giữ nguyên biểu đồ như trên màn hình</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Thẻ tổng quan -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="k in kpis" :key="k.label" class="bg-white border border-line rounded-2xl p-5">
        <p class="text-sm text-ink/50 mb-1">{{ k.label }}</p>
        <p class="stat-number text-3xl text-clay-dark">{{ k.value }}</p>
        <p v-if="k.delta !== undefined" class="text-xs mt-1.5 font-medium" :class="k.delta >= 0 ? 'text-green-700' : 'text-red-600'">
          {{ k.delta >= 0 ? "▲" : "▼" }} {{ Math.abs(Math.round(k.delta * 100)) }}% so với {{ prevText }}
        </p>
        <p v-else class="text-xs mt-1.5 text-ink/40">{{ k.note }}</p>
        <p v-if="k.sub" class="text-xs mt-0.5 text-ink/40">{{ k.sub }}</p>
      </div>
    </div>

    <!-- Xu hướng -->
    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <section class="lg:col-span-2 bg-white border border-line rounded-2xl p-5">
        <h3 class="font-semibold text-ink mb-1">Lượt truy cập theo ngày</h3>
        <p class="text-xs text-ink/45 mb-3">Người truy cập và lượt xem trang · {{ d.trendTitle }}</p>
        <TrendChart
          :labels="d.trend.labels"
          :series="[
            { name: 'Lượt xem trang', color: '#EAD8C7', values: d.trend.views, type: 'line', fill: true },
            { name: 'Người truy cập', color: '#FFA400', values: d.trend.visitors, type: 'line', fill: true },
          ]"
          aria-label="Biểu đồ đường lượt truy cập theo ngày"
        />
      </section>
      <section class="bg-white border border-line rounded-2xl p-5">
        <h3 class="font-semibold text-ink mb-1">Nguồn truy cập</h3>
        <p class="text-xs text-ink/45 mb-5">Khách đến từ đâu</p>
        <DonutChart :items="d.sources" aria-label="Biểu đồ tròn nguồn truy cập" />
      </section>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <section class="lg:col-span-2 bg-white border border-line rounded-2xl p-5">
        <h3 class="font-semibold text-ink mb-1">Lượt click vào bản đồ theo {{ d.mapSeries.unit }}</h3>
        <p class="text-xs text-ink/45 mb-3">Khách bấm xem đường đi tới phòng khám</p>
        <TrendChart
          :labels="d.mapSeries.labels"
          :series="[{ name: 'Click bản đồ', color: '#7B391A', values: d.mapSeries.values, type: 'bar' }]"
          :height="220"
          aria-label="Biểu đồ cột lượt click vào bản đồ theo ngày"
        />
      </section>
      <section class="bg-white border border-line rounded-2xl p-5">
        <h3 class="font-semibold text-ink mb-1">Khách tương tác với trang</h3>
        <p class="text-xs text-ink/45 mb-5">Tỉ lệ khách thực hiện từng hành động</p>
        <ul class="space-y-3">
          <li v-for="(f, i) in interactions" :key="f.name">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-ink/70">{{ f.name }}</span>
              <span class="font-semibold text-ink">{{ pct(f.rate) }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-tan overflow-hidden">
              <div class="h-full rounded-full" :style="{ width: Math.min(100, f.rate * 100 * 2.4) + '%', background: ['#7B391A', '#C97D3D', '#FFA400'][i] }"></div>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- Khung giờ, dịch vụ, thiết bị -->
    <div class="grid md:grid-cols-3 gap-4 mt-4">
      <section class="bg-white border border-line rounded-2xl p-5 md:col-span-2">
        <h3 class="font-semibold text-ink mb-1">Khung giờ khách truy cập</h3>
        <p class="text-xs text-ink/45 mb-3">Tổng theo giờ trong {{ d.single ? "ngày" : mode === "week" ? "tuần" : mode === "month" ? "tháng" : "khoảng thời gian" }} đang xem · dùng để chọn giờ chạy quảng cáo</p>
        <TrendChart
          :labels="hours"
          :series="[
            { name: 'Lượt xem trang', color: '#F2DCC0', values: d.hourlyViews, type: 'bar' },
            { name: 'Lượt truy cập', color: '#FFA400', values: d.hourlyVisits, type: 'bar' },
          ]"
          :height="200"
          aria-label="Biểu đồ cột lượt truy cập theo giờ trong ngày"
        />
      </section>
      <section class="bg-white border border-line rounded-2xl p-5">
        <h3 class="font-semibold text-ink mb-4">Dịch vụ khách quan tâm</h3>
        <ul class="space-y-3 mb-6">
          <li v-for="s in d.services" :key="s.name">
            <div class="flex justify-between text-sm mb-1"><span class="text-ink/70">{{ s.name }}</span><b>{{ s.value }}%</b></div>
            <div class="h-2.5 rounded-full bg-tan overflow-hidden"><div class="h-full rounded-full bg-amber" :style="{ width: s.value + '%' }"></div></div>
          </li>
        </ul>
        <h3 class="font-semibold text-ink mb-2 text-sm">Thiết bị</h3>
        <p class="text-sm text-ink/70" v-for="v in d.devices" :key="v.name">{{ v.name }}: <b>{{ pct(v.value) }}</b></p>
      </section>
    </div>

    <!-- Chiến dịch -->
    <section class="bg-white border border-line rounded-2xl p-5 mt-4">
      <h3 class="font-semibold text-ink mb-1">Hiệu quả theo chiến dịch quảng cáo</h3>
      <p class="text-xs text-ink/45 mb-4">Theo từng nhóm dịch vụ quảng cáo, khớp với mục "Dịch vụ khách quan tâm"</p>
      <div class="overflow-x-auto -mx-1">
        <table class="w-full text-sm min-w-[640px] print:min-w-0 print:text-xs">
          <thead>
            <tr class="text-left text-ink/50 border-b border-line">
              <th class="py-2 px-1 font-medium">Chiến dịch</th>
              <th class="py-2 px-1 font-medium text-right">Lượt truy cập</th>
              <th class="py-2 px-1 font-medium text-right">Click bản đồ</th>
              <th class="py-2 px-1 font-medium text-right">Tỉ lệ</th>
              <th class="py-2 px-1 font-medium text-right">Chi phí</th>
              <th class="py-2 px-1 font-medium text-right">Chi phí / lượt truy cập</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in d.campaigns" :key="c.name" class="border-b border-line/60 last:border-0">
              <td class="py-3 px-1"><p class="font-semibold text-ink">{{ c.label }}</p><p class="text-xs text-ink/40">{{ c.name }}</p></td>
              <td class="py-3 px-1 text-right">{{ c.visits }}</td>
              <td class="py-3 px-1 text-right font-semibold text-clay-dark">{{ c.mapClicks }}</td>
              <td class="py-3 px-1 text-right">{{ pct(c.rate) }}</td>
              <td class="py-3 px-1 text-right">{{ money(c.spend) }}</td>
              <td class="py-3 px-1 text-right font-semibold">{{ money(c.cpv) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t-2 border-line font-semibold text-ink">
              <td class="py-3 px-1">Tổng quảng cáo</td>
              <td class="py-3 px-1 text-right">{{ campTotal.visits.toLocaleString("vi-VN") }}</td>
              <td class="py-3 px-1 text-right text-clay-dark">{{ campTotal.mapClicks.toLocaleString("vi-VN") }}</td>
              <td class="py-3 px-1 text-right">{{ pct(campTotal.visits ? campTotal.mapClicks / campTotal.visits : 0) }}</td>
              <td class="py-3 px-1 text-right">{{ money(campTotal.spend) }}</td>
              <td class="py-3 px-1 text-right">{{ money(campTotal.visits ? Math.round(campTotal.spend / campTotal.visits) : 0) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

    <!-- Khách click bản đồ gần đây -->
    <section class="bg-white border border-line rounded-2xl p-5 mt-4">
      <h3 class="font-semibold text-ink mb-4">Khách click vào bản đồ gần đây <span class="text-xs font-normal text-ink/40">· {{ label }}</span></h3>
      <p v-if="!d.recentMapClicks.length" class="text-sm text-ink/50">Chưa có lượt click nào trong kỳ này.</p>
      <ul class="divide-y divide-line/60">
        <li v-for="l in d.recentMapClicks" :key="l.time + l.area" class="py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <div><p class="font-semibold text-ink text-sm">{{ l.area }}</p><p class="text-xs text-ink/45">{{ l.device }} · {{ l.time }}</p></div>
          <p class="text-xs text-ink/40">Dịch vụ quảng cáo: {{ l.source }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { exportExcel } from "./exportReport";
import TrendChart from "./TrendChart.vue";
import DonutChart from "./DonutChart.vue";
import { createModel, computePeriod, periodRange, periodLabel, shiftAnchor, keyOf, addDays } from "../../data/demoStats";

const model = createModel();
const modes = [
  { id: "day", label: "Ngày" },
  { id: "week", label: "Tuần" },
  { id: "month", label: "Tháng" },
  { id: "range", label: "Tùy chọn" },
];
const mode = ref("day");
const anchor = ref(model.today);

// Khoảng tùy chọn (mặc định 30 ngày gần nhất)
const rangeEnd = ref(model.today);
const rangeStart = ref(model.first > addDays(model.today, -29) ? model.first : addDays(model.today, -29));
const total = model.days.length;
const presets = [
  { days: 7, label: "7 ngày" },
  { days: 14, label: "14 ngày" },
  { days: 30, label: "30 ngày" },
  { days: total, label: `Tất cả (từ ${String(model.first.getDate()).padStart(2, "0")}/${String(model.first.getMonth() + 1).padStart(2, "0")})` },
].filter((p, i, arr) => p.days < total || i === arr.length - 1); // bỏ mốc dài hơn dữ liệu đang có
const spanDays = computed(() => Math.round((rangeEnd.value - rangeStart.value) / 86400000) + 1);
const activePreset = computed(() => {
  const isToday = rangeEnd.value.getTime() === model.today.getTime();
  const p = presets.find((x) => x.days === spanDays.value);
  return isToday && p ? p.days : null;
});
function applyPreset(n) {
  rangeEnd.value = model.today;
  rangeStart.value = n >= total ? model.first : addDays(model.today, -(n - 1));
}
function setRange(which, e) {
  if (!e.target.value) return;
  const [y, m, dd] = e.target.value.split("-").map(Number);
  const v = new Date(y, m - 1, dd);
  if (which === "start") { rangeStart.value = v; if (v > rangeEnd.value) rangeEnd.value = v; }
  else { rangeEnd.value = v; if (v < rangeStart.value) rangeStart.value = v; }
}

const d = computed(() => computePeriod(model, mode.value, anchor.value, { start: rangeStart.value, end: rangeEnd.value }));
const label = computed(() => periodLabel(mode.value, d.value.anchor, d.value.range));
const prevText = computed(() => ({ day: "hôm trước", week: "tuần trước", month: "tháng trước", range: "kỳ trước (cùng số ngày)" }[mode.value]));

// Lùi / tiến kỳ — không vượt quá hôm nay hay trước dữ liệu có sẵn
const canNext = computed(() => periodRange(mode.value, d.value.anchor).end < model.today);
const canPrev = computed(() => periodRange(mode.value, d.value.anchor).start > model.first);
const isCurrent = computed(() => d.value.anchor.getTime() === model.today.getTime());
function move(dir) {
  const next = shiftAnchor(mode.value, d.value.anchor, dir);
  anchor.value = next > model.today ? model.today : next < model.first ? model.first : next;
}
const toInput = (x) => keyOf(x);
const dateInput = computed(() => toInput(d.value.anchor));
const minInput = toInput(model.first);
const maxInput = toInput(model.today);
function pickDate(e) {
  if (!e.target.value) return;
  const [y, m, dd] = e.target.value.split("-").map(Number);
  anchor.value = new Date(y, m - 1, dd);
}

const campTotal = computed(() => ({
  visits: d.value.campaigns.reduce((s, c) => s + c.visits, 0),
  mapClicks: d.value.campaigns.reduce((s, c) => s + c.mapClicks, 0),
  spend: d.value.campaigns.reduce((s, c) => s + c.spend, 0),
}));
// Xuất báo cáo
const exportOpen = ref(false);
const exporting = ref(false);
const exportEl = ref(null);
const nowText = new Date().toLocaleString("vi-VN");
async function doExcel() {
  exportOpen.value = false;
  exporting.value = true;
  try {
    await exportExcel(d.value, label.value);
  } finally {
    exporting.value = false;
  }
}
function doPdf() {
  exportOpen.value = false;
  setTimeout(() => window.print(), 50);
}
function closeOnOutside(e) {
  if (exportEl.value && !exportEl.value.contains(e.target)) exportOpen.value = false;
}
onMounted(() => document.addEventListener("click", closeOnOutside));
onBeforeUnmount(() => document.removeEventListener("click", closeOnOutside));

const hours = Array.from({ length: 24 }, (_, h) => `${h}h`);
const pct = (v) => `${(v * 100).toFixed(1).replace(".", ",")}%`;
const money = (v) => `${v.toLocaleString("vi-VN")}đ`;
const mmss = (s) => `${Math.floor(s / 60)}p ${String(s % 60).padStart(2, "0")}s`;

// Các hành động của khách, sắp theo tỉ lệ giảm dần (click bản đồ cao nhất)
const interactions = computed(() =>
  [
    { name: "Click vào bản đồ", rate: d.value.mapClickRate },
    { name: "Bấm Zalo / Messenger", rate: d.value.zaloClickRate },
    { name: "Click xem đánh giá Google", rate: d.value.reviewClickRate },
  ].sort((a, b) => b.rate - a.rate)
);

const kpis = computed(() => {
  const x = d.value;
  return [
    { label: "Người truy cập", value: x.totals.visitors.toLocaleString("vi-VN"), delta: x.delta.visitors, sub: `${x.totals.visits.toLocaleString("vi-VN")} lượt truy cập` },
    { label: "Lượt xem trang", value: x.totals.views.toLocaleString("vi-VN"), delta: x.delta.views },
    { label: "Tỉ lệ click vào bản đồ", value: pct(x.mapClickRate), delta: x.delta.mapClicks },
    { label: "Tỉ lệ click đánh giá Google", value: pct(x.reviewClickRate), note: "Xem đánh giá 4,8★ trên Google" },
    { label: "Tỉ lệ thoát", value: pct(x.bounceRate), note: "Càng thấp càng tốt" },
    { label: "Thời gian trên trang", value: mmss(x.avgDurationSec), note: "Trung bình mỗi lượt" },
    { label: "Tỉ lệ bấm Zalo / Messenger", value: pct(x.zaloClickRate), note: "Khách chủ động nhắn tin" },
    { label: "Chi phí quảng cáo", value: money(x.totals.spend), note: label.value },
  ];
});
</script>
