<template>
  <div class="flex flex-col sm:flex-row items-center gap-6">
    <svg viewBox="0 0 120 120" class="w-36 h-36 shrink-0 -rotate-90" role="img" :aria-label="ariaLabel">
      <circle cx="60" cy="60" :r="r" fill="none" stroke="#F6EEE2" stroke-width="18" />
      <circle
        v-for="(s, i) in arcs" :key="i" cx="60" cy="60" :r="r" fill="none" :stroke="s.color" stroke-width="18"
        :stroke-dasharray="`${s.len} ${C - s.len}`" :stroke-dashoffset="-s.off"
      />
    </svg>
    <ul class="w-full space-y-2 text-sm">
      <li v-for="s in arcs" :key="s.name" class="flex items-center justify-between gap-3">
        <span class="flex items-center gap-2 text-ink/70"><span class="w-2.5 h-2.5 rounded-full inline-block" :style="{ background: s.color }"></span>{{ s.name }}</span>
        <span class="font-semibold text-ink">{{ Math.round(s.pct * 100) }}%</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ items: { type: Array, required: true }, ariaLabel: { type: String, default: "Biểu đồ tròn" } });
const r = 42;
const C = 2 * Math.PI * r;
const arcs = computed(() => {
  const total = props.items.reduce((s, i) => s + i.value, 0) || 1;
  let off = 0;
  return props.items.map((i) => {
    const pct = i.value / total;
    const a = { name: i.name, color: i.color, pct, len: pct * C, off };
    off += pct * C;
    return a;
  });
});
</script>
