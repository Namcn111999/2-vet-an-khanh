<template>
  <section id="khach-hang" class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
    <div v-reveal>
      <p class="kicker mb-4">Khách hàng nói gì</p>
      <h2 class="section-title max-w-[22ch] mb-12">Những gia đình thú cưng đã tin tưởng 2Vet</h2>
    </div>

    <div class="grid md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center" v-reveal="{ delay: 100 }">
      <div class="relative w-28 md:w-40 mx-auto md:mx-0">
        <div class="absolute -inset-2 rounded-full border-2 border-amber/50"></div>
        <PlaceholderImg :label="active.imgLabel" aspect="aspect-square" rounded="rounded-full" />
      </div>

      <div>
        <span class="font-display text-5xl text-amber/70 leading-none block mb-2" style="font-style: italic">“</span>
        <blockquote class="font-display text-2xl md:text-[1.75rem] leading-snug text-ink -mt-6" style="font-weight: 500">
          {{ active.quote }}
        </blockquote>
        <p class="mt-5 text-ink/60">
          <span class="font-semibold text-clay-dark">{{ active.name }}</span> — {{ active.pet }}
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
import PlaceholderImg from "./PlaceholderImg.vue";

const testimonials = [
  {
    name: "[Tên khách hàng]",
    pet: "chủ nuôi bé Mèo Miu",
    quote: "Bác sĩ giải thích rất kỹ tình trạng của bé, mình yên tâm hẳn sau lần khám đầu tiên.",
    imgLabel: "Ảnh khách hàng 1 cùng thú cưng",
  },
  {
    name: "[Tên khách hàng]",
    pet: "chủ nuôi bé Cún Lu",
    quote: "Đặt lịch qua tin nhắn nhanh, đến nơi không phải chờ lâu, nhân viên grooming làm rất cẩn thận.",
    imgLabel: "Ảnh khách hàng 2 cùng thú cưng",
  },
  {
    name: "[Tên khách hàng]",
    pet: "chủ nuôi bé Bông",
    quote: "Phòng khám sạch sẽ, bác sĩ nhẹ nhàng nên bé nhà mình không sợ mỗi lần đi tiêm phòng.",
    imgLabel: "Ảnh khách hàng 3 cùng thú cưng",
  },
];

const active = ref(testimonials[0]);
</script>
