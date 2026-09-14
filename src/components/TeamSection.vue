<template>
  <section id="doi-ngu" class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
    <div v-reveal>
      <p class="kicker mb-4">Đội ngũ</p>
      <h2 class="section-title max-w-[22ch] mb-12">Bác sĩ đồng hành cùng thú cưng của bạn</h2>
    </div>

    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
      <div v-for="(doc, i) in doctors" :key="doc.name" v-reveal="{ delay: i * 100 }">
        <div class="relative w-fit mx-auto">
          <div class="absolute -inset-1.5 rounded-full border-2 border-amber/40"></div>
          <PlaceholderImg :label="doc.imgLabel" aspect="aspect-square" rounded="rounded-full" class="max-w-[180px]" />
        </div>
        <div class="text-center mt-5">
          <h3 class="font-display text-xl text-ink" style="font-weight: 600">{{ doc.name }}</h3>
          <p class="text-sm text-amber-dark font-medium mt-1">{{ doc.role }}</p>
          <p class="text-sm text-ink/60 mt-2 max-w-[26ch] mx-auto">{{ doc.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import PlaceholderImg from "./PlaceholderImg.vue";

const doctors = [
  { name: "BS. [Tên bác sĩ]", role: "Trưởng khoa Nội", bio: "[Số năm] kinh nghiệm điều trị nội khoa thú cưng.", imgLabel: "Ảnh chân dung bác sĩ 1" },
  { name: "BS. [Tên bác sĩ]", role: "Ngoại khoa", bio: "Chuyên phẫu thuật và điều trị ngoại khoa.", imgLabel: "Ảnh chân dung bác sĩ 2" },
  { name: "[Tên nhân viên]", role: "Grooming & Chăm sóc", bio: "Phụ trách tắm spa, cắt tỉa cho chó mèo.", imgLabel: "Ảnh chân dung nhân viên grooming" },
];
</script>
