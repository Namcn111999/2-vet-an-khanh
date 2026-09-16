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
          <img
            :src="doc.img"
            :alt="`${doc.name} – ${doc.role} tại 2Vet An Khánh`"
            class="w-[180px] h-[180px] rounded-full object-cover"
          />
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
const doctors = [
  {
    name: "BS. Vũ Thị Huyền",
    role: "Giám đốc BV / Bác sĩ thú y",
    bio: "Phụ trách chuyên môn và điều hành chung tại 2Vet An Khánh.",
    img: "/images/team/huyen.jpg",
  },
  {
    name: "BS. Hồ Diễn Thảo",
    role: "Bác sĩ thú y",
    bio: "Trực tiếp khám, điều trị và tư vấn chăm sóc thú cưng.",
    img: "/images/team/thao.jpg",
  },
  {
    name: "Nghiêm Thu Trang",
    role: "Lễ tân - Thu ngân",
    bio: "Hỗ trợ đặt lịch, đón tiếp và thanh toán cho khách hàng.",
    img: "/images/team/trang.jpg",
  },
];
</script>
