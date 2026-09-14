<template>
  <!--
    ƯU ĐÃI ĐANG CHẠY — tự động chọn đúng chương trình theo ngày hiện tại.
    Muốn thêm/sửa chương trình: chỉnh file src/data/promos.js, KHÔNG cần sửa file này.
  -->
  <section id="uu-dai" class="bg-paper border-y border-line">
    <div class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20" v-reveal>
      <div class="grid md:grid-cols-[1fr_1.1fr] gap-10 items-center bg-white rounded-3xl border border-line overflow-hidden">
        <div class="p-8 md:p-10">
          <span class="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full bg-amber text-white mb-4">
            <span v-if="state === 'active'">Đang diễn ra · {{ dateRangeLabel }}</span>
            <span v-else-if="state === 'upcoming'">Sắp diễn ra · {{ dateRangeLabel }}</span>
            <span v-else>Ưu đãi</span>
          </span>
          <h2 class="font-display text-3xl md:text-4xl leading-tight text-ink" style="font-weight: 600">{{ promo.title }}</h2>
          <p class="mt-5 text-ink/70 leading-relaxed max-w-[42ch]">{{ promo.desc }}</p>
          <a href="#dat-lich" class="btn-primary mt-7">{{ promo.cta }}</a>
        </div>
        <PlaceholderImg :label="promo.imgLabel" aspect="aspect-[16/10]" rounded="" class="md:h-full" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import PlaceholderImg from "./PlaceholderImg.vue";
import { getPromoForDate } from "../data/promos";

// TODO (kiểm thử): có thể ép ngày giả lập để xem trước 1 chương trình cụ thể, VD:
// const { promo, state } = getPromoForDate(new Date("2026-09-25"));
const { promo, state } = getPromoForDate();

const dateRangeLabel = computed(() => {
  if (!promo.start || !promo.end) return "";
  const fmt = (d) => {
    const [, m, day] = d.split("-");
    return `${day}/${m}`;
  };
  return `${fmt(promo.start)} – ${fmt(promo.end)}`;
});
</script>
