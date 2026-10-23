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
        <h3 class="font-semibold text-ink mb-1">Khách đặt lịch theo ngày</h3>
        <p class="text-xs text-ink/45 mb-3">Số lượt gửi form đặt lịch thành công</p>
        <TrendChart
          :labels="d.days"
          :series="[{ name: 'Lượt đặt lịch', color: '#7B391A', values: d.daily.map((x) => x.leads), type: 'bar' }]"
          :height="220"
          aria-label="Biểu đồ cột khách đặt lịch theo ngày"
        />
      </section>
      <section class="bg-white border border-line rounded-2xl p-5">
        <h3 class="font-semibold text-ink mb-1">Từ truy cập đến đặt lịch</h3>
        <p class="text-xs text-ink/45 mb-5">Khách rơi rụng ở bước nào</p>
        <ul class="space-y-3">
          <li v-for="(f, i) in d.funnel" :key="f.name">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-ink/70">{{ f.name }}</span>
              <span class="font-semibold text-ink">{{ f.value.toLocaleString("vi-VN") }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-tan overflow-hidden">
              <div class="h-full rounded-full" :style="{ width: (f.value / d.funnel[0].value) * 100 + '%', background: ['#EAD8C7', '#C97D3D', '#A6673C', '#7B391A'][i] }"></div>
            </div>
          </li>
        </ul>
        <p class="text-xs text-ink/45 mt-4">Tỉ lệ chuyển đổi: <b class="text-clay-dark">{{ pct(d.totals.leads / d.totals.visits) }}</b></p>
      </section>
    </div>

    <!-- Khung giờ, dịch vụ, thiết bị -->
    <div class="grid md:grid-cols-3 gap-4 mt-4">
      <section class="bg-white border border-line rounded-2xl p-5 md:col-span-2">
        <h3 class="font-semibold text-ink mb-1">Khung giờ khách truy cập nhiều nhất</h3>
        <p class="text-xs text-ink/45 mb-3">Dùng để chọn giờ chạy quảng cáo</p>
        <TrendChart
          :labels="hours"
          :series="[{ name: 'Lượt truy cập', color: '#FFA400', values: d.hourly, type: 'bar' }]"
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
      <p class="text-xs text-ink/45 mb-4">Đối chiếu theo mã UTM gắn trên link quảng cáo</p>
      <div class="overflow-x-auto -mx-1">
        <table class="w-full text-sm min-w-[640px]">
          <thead>
            <tr class="text-left text-ink/50 border-b border-line">
              <th class="py-2 px-1 font-medium">Chiến dịch</th>
              <th class="py-2 px-1 font-medium text-right">Lượt truy cập</th>
              <th class="py-2 px-1 font-medium text-right">Đặt lịch</th>
              <th class="py-2 px-1 font-medium text-right">Tỉ lệ</th>
              <th class="py-2 px-1 font-medium text-right">Chi phí</th>
              <th class="py-2 px-1 font-medium text-right">Chi phí / lịch</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in d.campaigns" :key="c.name" class="border-b border-line/60 last:border-0">
              <td class="py-3 px-1"><p class="font-semibold text-ink">{{ c.label }}</p><p class="text-xs text-ink/40">{{ c.name }}</p></td>
              <td class="py-3 px-1 text-right">{{ c.visits }}</td>
              <td class="py-3 px-1 text-right font-semibold text-clay-dark">{{ c.leads }}</td>
              <td class="py-3 px-1 text-right">{{ pct(c.cvr) }}</td>
              <td class="py-3 px-1 text-right">{{ money(c.spend) }}</td>
              <td class="py-3 px-1 text-right font-semibold">{{ money(c.cpl) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Khách gần đây -->
    <section class="bg-white border border-line rounded-2xl p-5 mt-4">
      <h3 class="font-semibold text-ink mb-4">Khách đặt lịch gần đây <span class="text-xs font-normal text-ink/40">(đã che số điện thoại)</span></h3>
      <ul class="divide-y divide-line/60">
        <li v-for="l in d.recentLeads" :key="l.time + l.name" class="py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <div><p class="font-semibold text-ink text-sm">{{ l.name }}</p><p class="text-xs text-ink/45">{{ l.phone }} · {{ l.time }}</p></div>
          <div class="text-right"><p class="text-sm text-ink/70">{{ l.service }}</p><p class="text-xs text-ink/40">Nguồn: {{ l.source }}</p></div>
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

const kpis = computed(() => [
  { label: "Người truy cập", value: d.totals.visitors.toLocaleString("vi-VN"), delta: d.delta.visitors },
  { label: "Lượt xem trang", value: d.totals.views.toLocaleString("vi-VN"), delta: d.delta.views },
  { label: "Khách đặt lịch", value: d.totals.leads.toLocaleString("vi-VN"), delta: d.delta.leads },
  { label: "Tỉ lệ chuyển đổi", value: pct(d.totals.leads / d.totals.visits), note: "Đặt lịch / lượt truy cập" },
  { label: "Tỉ lệ thoát", value: pct(d.bounceRate), note: "Càng thấp càng tốt" },
  { label: "Thời gian trên trang", value: mmss(d.avgDurationSec), note: "Trung bình mỗi lượt" },
  { label: "Chi phí quảng cáo", value: money(d.campaigns.reduce((s, c) => s + c.spend, 0)), note: "30 ngày gần nhất" },
  { label: "Chi phí mỗi lịch", value: money(Math.round(d.campaigns.reduce((s, c) => s + c.spend, 0) / d.campaigns.reduce((s, c) => s + c.leads, 0))), note: "Chi phí / khách đặt lịch" },
]);
</script>
