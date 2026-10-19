<template>
  <section id="khach-hang" class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
    <div v-reveal>
      <p class="kicker mb-4">Khách hàng nói gì</p>
      <h2 class="section-title max-w-[22ch] mb-12">Những gia đình thú cưng đã tin tưởng 2Vet</h2>
    </div>

    <div v-reveal="{ delay: 50 }" class="flex flex-wrap items-center gap-x-4 gap-y-2 -mt-6 mb-10">
      <span class="font-display text-3xl text-clay-dark" style="font-weight: 600">4,8</span>
      <span class="text-amber text-xl tracking-wider" aria-label="4,8 trên 5 sao">★★★★★</span>
      <a :href="mapsUrl" target="_blank" rel="noopener" class="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">44 đánh giá trên Google</a>
    </div>

    <div class="grid md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center" v-reveal="{ delay: 100 }">
      <div class="relative w-28 md:w-40 mx-auto md:mx-0">
        <div class="absolute -inset-2 rounded-full border-2 border-amber/50"></div>
        <div class="aspect-square rounded-full bg-amber/15 flex items-center justify-center font-display text-4xl md:text-6xl text-clay-dark" style="font-weight: 600" aria-hidden="true">
          {{ initials(active.name) }}
        </div>
      </div>

      <div>
        <span class="font-display text-5xl text-amber/70 leading-none block mb-2" style="font-style: italic">“</span>
        <blockquote class="font-display text-2xl md:text-[1.75rem] leading-snug text-ink -mt-6" style="font-weight: 500">
          {{ active.quote }}
        </blockquote>
        <p class="mt-5 text-ink/60">
          <span class="font-semibold text-clay-dark">{{ active.name }}</span> — <span class="text-amber">★★★★★</span> đánh giá trên Google
        </p>

        <div class="flex items-center gap-2 mt-8">
          <button
            v-for="(t, idx) in testimonials"
            :key="t.name"
            @click="active = t"
            class="w-2.5 h-2.5 rounded-full transition-colors"
            :class="active.name === t.name ? 'bg-amber' : 'bg-ink/15 hover:bg-ink/30'"
            :aria-label="`Xem đánh giá ${idx + 1}`"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

// Đánh giá thật của khách trên Google Maps (nguyên văn). Thêm đánh giá mới: copy 1 object bên dưới.
const mapsUrl =
  "https://www.google.com/maps/place/B%E1%BB%87nh+vi%E1%BB%87n+th%C3%BA+y+2Vet+An+Kh%C3%A1nh/@21.0058754,105.7307084,17z/data=!3m1!4b1!4m6!3m5!1s0x3134534856d051a7:0x3dae2d9f362187f9!8m2!3d21.0058704!4d105.7332833!16s%2Fg%2F11mkff4l35";

const testimonials = [
  {
    name: "Thanh Tùng Trần",
    quote: "Các bác sĩ nhiệt tình, vui vẻ, cơ sở vật chất sạch sẽ và luôn hỗ trợ nhiệt tình ạ. Mình rất yên tâm khi gửi cún thăm khám và spa.",
  },
  {
    name: "Vĩ Phạm",
    quote: "Hôm nay tôi cho Sam và Bo đi kiểm tra sức khoẻ tổng quát và vệ sinh tai, các bác sĩ ở đây rất nhiệt tình 10đ. Chúc cơ sở ngày càng phát triển.",
  },
  {
    name: "Thuỳ Dương Đào Thị",
    quote: "Dịch vụ siêu tốt, chị bác sĩ nhiệt tình cute.",
  },
  {
    name: "Nguyen Chi Huong",
    quote: "Hôm nay mình đưa cún qua tắm và tiêm vacxin. Lần đầu nhưng rất hài lòng, giá hợp lý, nhân viên thân thiện chu đáo. Mình sẽ ủng hộ dài.",
  },
];

const active = ref(testimonials[0]);

function initials(name) {
  const parts = name.trim().split(/\s+/);
  return (parts[parts.length - 1][0] || "").toUpperCase();
}
</script>
