<template>
  <div class="relative" @mouseleave="hover = null">
    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-auto select-none" role="img" :aria-label="ariaLabel" @mousemove="onMove" @touchmove.prevent="onTouch">
      <g v-for="t in ticks" :key="t.y">
        <line :x1="padL" :x2="W - padR" :y1="t.y" :y2="t.y" stroke="#EAD8C7" stroke-width="1" />
        <text :x="padL - 8" :y="t.y + 4" text-anchor="end" font-size="11" fill="#2A171099">{{ t.v }}</text>
      </g>
      <text v-for="(l, i) in xLabels" :key="l.i" :x="x(l.i)" :y="H - 8" text-anchor="middle" font-size="11" fill="#2A171099">{{ l.t }}</text>

      <g v-for="(s, si) in series" :key="s.name">
        <template v-if="s.type === 'bar'">
          <rect
            v-for="(v, i) in s.values" :key="i"
            :x="x(i) - barW / 2" :y="y(v)" :width="barW" :height="Math.max(0, base - y(v))"
            :fill="s.color" :opacity="hover === i ? 1 : 0.85" rx="2"
          />
        </template>
        <template v-else>
          <path v-if="s.fill" :d="area(s.values)" :fill="s.color" opacity="0.13" />
          <path :d="line(s.values)" fill="none" :stroke="s.color" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
        </template>
      </g>

      <g v-if="marker">
        <line :x1="x(marker.index)" :x2="x(marker.index)" :y1="padT" :y2="base" stroke="#4A2110" stroke-width="1.2" stroke-dasharray="4 4" />
        <text :x="x(marker.index) + 6" :y="padT + 12" font-size="11" fill="#4A2110" font-weight="600">{{ marker.label }}</text>
      </g>

      <g v-if="hover !== null">
        <line :x1="x(hover)" :x2="x(hover)" :y1="padT" :y2="base" stroke="#2A1710" stroke-opacity="0.25" />
        <circle v-for="s in lineSeries" :key="s.name" :cx="x(hover)" :cy="y(s.values[hover])" r="4" :fill="s.color" stroke="#fff" stroke-width="2" />
      </g>
    </svg>

    <div
      v-if="hover !== null"
      class="absolute top-2 pointer-events-none bg-ink text-paper text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap"
      :style="{ left: tipLeft }"
    >
      <p class="font-semibold mb-1">{{ labels[hover] }}</p>
      <p v-for="s in series" :key="s.name" class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full inline-block" :style="{ background: s.color }"></span>
        {{ s.name }}: <b>{{ s.values[hover] }}</b>
      </p>
    </div>

    <div class="flex flex-wrap gap-4 mt-2 text-xs text-ink/60">
      <span v-for="s in series" :key="s.name" class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full inline-block" :style="{ background: s.color }"></span>{{ s.name }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  labels: { type: Array, required: true },
  series: { type: Array, required: true }, // [{name, color, values, type: 'line'|'bar', fill}]
  height: { type: Number, default: 260 },
  marker: { type: Object, default: null }, // {index, label}
  ariaLabel: { type: String, default: "Biểu đồ" },
});

const W = 800;
const H = computed(() => props.height);
const padL = 40, padR = 12, padT = 12, padB = 28;
const base = computed(() => H.value - padB);
const hover = ref(null);

// Trục dọc chia 4 khoảng đều với mốc số nguyên "đẹp" (1, 2, 5, 10 × 10^k)
const max = computed(() => {
  const m = Math.max(1, ...props.series.flatMap((s) => s.values));
  const raw = m / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 5, 10].map((k) => k * pow).find((k) => k >= raw);
  return Math.max(4, Math.round(step * 4));
});
const n = computed(() => props.labels.length);
const barW = computed(() => Math.max(4, ((W - padL - padR) / n.value) * 0.62));
const x = (i) => padL + ((W - padL - padR) * (i + 0.5)) / n.value;
const y = (v) => padT + (base.value - padT) * (1 - v / max.value);

const ticks = computed(() => [0, 0.25, 0.5, 0.75, 1].map((f) => ({ v: Math.round(max.value * f), y: y(max.value * f) })));
const xLabels = computed(() => {
  const every = n.value > 20 ? 4 : n.value > 10 ? 2 : 1;
  // bỏ nhãn cuối nếu quá sát nhãn trước đó để không bị đè chữ
  return props.labels.map((t, i) => ({ t, i })).filter((l) => l.i % every === 0 && n.value - 1 - l.i >= every / 2 || l.i === n.value - 1);
});
const lineSeries = computed(() => props.series.filter((s) => s.type !== "bar"));

function line(vals) {
  return vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
}
function area(vals) {
  return `${line(vals)} L${x(vals.length - 1).toFixed(1)},${base.value} L${x(0).toFixed(1)},${base.value} Z`;
}

function idxFromClientX(el, cx) {
  const r = el.getBoundingClientRect();
  const px = ((cx - r.left) / r.width) * W;
  return Math.min(n.value - 1, Math.max(0, Math.round(((px - padL) * n.value) / (W - padL - padR) - 0.5)));
}
function onMove(e) { hover.value = idxFromClientX(e.currentTarget, e.clientX); }
function onTouch(e) { hover.value = idxFromClientX(e.currentTarget, e.touches[0].clientX); }

const tipLeft = computed(() => {
  if (hover.value === null) return "0";
  const pct = (x(hover.value) / W) * 100;
  return pct > 70 ? `calc(${pct}% - 150px)` : `calc(${pct}% + 10px)`;
});
</script>
