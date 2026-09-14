<template>
  <Transition name="popup">
    <div v-if="visible" class="fixed inset-0 z-[60] flex items-center justify-center p-5" role="dialog" aria-modal="true" :aria-label="promo.title">
      <div class="absolute inset-0 bg-ink/50" @click="dismiss"></div>

      <div class="relative bg-white rounded-3xl w-full max-w-[420px] overflow-hidden">
        <button
          @click="dismiss"
          aria-label="Đóng"
          class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-ink/60 hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </button>

        <PlaceholderImg :label="promo.imgLabel" aspect="aspect-[16/9]" rounded="" />

        <div class="p-6">
          <span class="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber/15 text-amber-dark mb-3">
            <span v-if="state === 'active'">Đang diễn ra · {{ dateRangeLabel }}</span>
            <span v-else-if="state === 'upcoming'">Sắp diễn ra · {{ dateRangeLabel }}</span>
          </span>
          <h3 class="font-display text-2xl text-ink leading-snug" style="font-weight: 600">{{ promo.title }}</h3>
          <p class="mt-3 text-sm text-ink/70 leading-relaxed">{{ promo.desc }}</p>

          <div class="mt-5 flex flex-col gap-2.5">
            <a href="#dat-lich" @click="dismiss" class="btn-primary w-full">{{ promo.cta }}</a>
            <button @click="dismiss" class="text-sm text-ink/50 hover:text-ink/70 py-1">Để sau</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import PlaceholderImg from "./PlaceholderImg.vue";
import { getPromoForDate } from "../data/promos";

// Pop-up ưu đãi tự bật khi vào trang — dùng chung dữ liệu lịch khuyến mãi với PromoSection
// (src/data/promos.js), nên không cần khai báo nội dung riêng ở đây.
//
// Hành vi: chỉ bật khi đang có chương trình đang chạy hoặc sắp tới (bỏ qua trường hợp
// mặc định không có chương trình nào). Hiện lên MỖI LẦN khách vào/tải lại trang (không
// ghi nhớ đã đóng), tự bật sau 1,2s, tự động biến mất sau AUTO_HIDE_MS nếu khách không
// bấm đóng tay — đổi số dưới đây nếu muốn thời gian hiển thị khác.

const AUTO_HIDE_MS = 8000; // 8 giây — nằm trong khoảng 5-10s theo yêu cầu

const { promo, state } = getPromoForDate();
const visible = ref(false);
let hideTimer = null;

const dateRangeLabel = computed(() => {
  if (!promo.start || !promo.end) return "";
  const fmt = (d) => {
    const [, m, day] = d.split("-");
    return `${day}/${m}`;
  };
  return `${fmt(promo.start)} – ${fmt(promo.end)}`;
});

function dismiss() {
  visible.value = false;
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

onMounted(() => {
  const hasRealPromo = state === "active" || state === "upcoming";
  if (!hasRealPromo) return;

  setTimeout(() => {
    visible.value = true;
    hideTimer = setTimeout(() => {
      visible.value = false;
    }, AUTO_HIDE_MS);
  }, 1200);
});
</script>

<style scoped>
.popup-enter-active {
  transition: opacity 0.25s ease;
}
.popup-enter-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.popup-leave-active {
  transition: opacity 0.2s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
.popup-enter-from > div:last-child {
  transform: scale(0.94) translateY(8px);
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .popup-enter-active,
  .popup-leave-active,
  .popup-enter-active > div:last-child {
    transition: none;
  }
}
</style>
