<template>
  <div>
    <!-- Thẻ tổng quan -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="k in kpis" :key="k.label" class="bg-white border border-line rounded-2xl p-5">
        <p class="text-sm text-ink/50 mb-1">{{ k.label }}</p>
        <p class="stat-number text-3xl text-clay-dark">{{ k.value }}</p>
        <p v-if="k.delta !== undefined" class="text-xs mt-1.5 font-medium" :class="k.delta >= 0 ? 'text-green-700' : 'text-red-600'">
          {{ k.delta >= 0 ? "▲" : "▼" }} {{ Math.abs(Math.round(k.delta * 100)) }}% so với 30 ngày trước
        </p>
        <p v-else class="text-xs mt-1.5 text-ink/40">{{ k.note }}</p>
      </div>
    </div>

    <!-- Xu hướng -->
    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <section class="lg:col-span-2 bg-white border border-line rounded-2xl p-5">
        <h3 class="font-semibold text-ink mb-1">Lượt truy cập theo ngày</h3>
        <p class="text-xs text-ink/45 mb-3">Người truy cập và lượt xem trang, 30 ngày gần nhất</p>
        <TrendChart
          :labels="d.days"
          :series="[
            { name: 'Lượt xem trang', color: '#EAD8C7', values: d.daily.map((x) => x.views), type: 'line', fill: true },
            { name: 'Người truy cập', color: '#FFA400', values: d.daily.map((x) => x.visitors), type: 'line', fill: true },
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
        <h3 class="font-semibold text-ink mb-1">Lượt click vào bản đồ theo ngày</h3>
        <p class="text-xs text-ink/45 mb-3">Khách bấm xem đường đi tới phòng khám</p>
        <TrendChart
          :labels="d.days"
          :series="[{ name: 'Click bản đồ', color: '#7B391A', values: d.daily.map((x) => x.mapClicks), type: 'bar' }]"
          :height="220"
          aria-label="Biểu đồ cột lượt click vào bản đồ theo ngày"
        />
      </section>
      <section class="bg-white border border-line rounded-2xl p-5">
        <h3 class="font-semibold text-ink mb-1">Khách tương tác với trang</h3>
        <p class="text-xs text-ink/45 mb-5">Tỉ lệ khách thực hiện từng hành động</p>
        <ul class="space-y-3">
          <li v-for="(f, i) in d.interactions" :key="f.name">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-ink/70">{{ f.name }}</span>
              <span class="font-semibold text-ink">{{ pct(f.rate) }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-tan overflow-hidden">
              <div class="h-full rounded-full" :style="{ width: Math.min(100, f.rate * 100 * 2.4) + '%', background: ['#C97D3D', '#7B391A', '#FFA400', '#EAD8C7'][i] }"></div>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- Khung giờ, dịch vụ, thiết bị -->
    <div class="grid md:grid-cols-3 gap-4 mt-4">
      <section class="bg-white border border-line rounded-2xl p-5 md:col-span-2">
        <h3 class="font-semibold text-ink mb-1">Khung giờ khách truy cập (24 giờ gần nhất)</h3>
        <p class="text-xs text-ink/45 mb-3">Dùng để chọn giờ chạy quảng cáo</p>
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
        <table class="w-full text-sm min-w-[640px]">
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
        </table>
      </div>
    </section>

    <!-- Khách click bản đồ gần đây -->
    <section class="bg-white border border-line rounded-2xl p-5 mt-4">
      <h3 class="font-semibold text-ink mb-4">Khách click vào bản đồ gần đây</h3>
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
import { computed } from "vue";
import TrendChart from "./TrendChart.vue";
import DonutChart from "./DonutChart.vue";
import { buildDemo } from "../../data/demoStats";

const d = buildDemo();
const hours = Array.from({ length: 24 }, (_, h) => `${h}h`);
const pct = (v) => `${(v * 100).toFixed(1).replace(".", ",")}%`;
const money = (v) => `${v.toLocaleString("vi-VN")}đ`;
const mmss = (s) => `${Math.floor(s / 60)}p ${String(s % 60).padStart(2, "0")}s`;

const totalSpend = d.campaigns.reduce((s, c) => s + c.spend, 0);
const kpis = computed(() => [
  { label: "Người truy cập", value: d.totals.visitors.toLocaleString("vi-VN"), delta: d.delta.visitors },
  { label: "Lượt xem trang", value: d.totals.views.toLocaleString("vi-VN"), delta: d.delta.views },
  { label: "Tỉ lệ click vào bản đồ", value: pct(d.mapClickRate), delta: d.delta.mapClicks },
  { label: "Tỉ lệ click đánh giá Google", value: pct(d.reviewClickRate), note: "Xem đánh giá 4,8★ trên Google" },
  { label: "Tỉ lệ thoát", value: pct(d.bounceRate), note: "Càng thấp càng tốt" },
  { label: "Thời gian trên trang", value: mmss(d.avgDurationSec), note: "Trung bình mỗi lượt" },
  { label: "Tỉ lệ bấm Zalo / Messenger", value: pct(d.zaloClickRate), note: "Khách chủ động nhắn tin" },
  { label: "Chi phí quảng cáo", value: money(totalSpend), note: "30 ngày gần nhất" },
]);
</script>
