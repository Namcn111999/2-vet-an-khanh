<template>
  <section class="bg-tan border-y border-line">
    <div class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
      <div class="grid md:grid-cols-[0.8fr_1.2fr] gap-10">
        <div v-reveal>
          <p class="kicker mb-4">Bảng giá tham khảo</p>
          <h2 class="section-title max-w-[18ch]">Giá rõ ràng, không phát sinh bất ngờ</h2>
          <p class="text-ink/60 mt-4 max-w-[34ch]">
            Giá có thể thay đổi tuỳ tình trạng thú cưng. Nhắn tin để được tư vấn báo giá chính xác.
          </p>
          <a href="#dat-lich" class="btn-secondary mt-6">Liên hệ báo giá</a>
        </div>

        <ul class="divide-y divide-line" v-reveal="{ delay: 120 }">
          <li v-for="row in prices" :key="row.name" class="flex items-baseline justify-between py-4">
            <span class="text-ink/80">{{ row.name }}</span>
            <span class="font-display text-lg text-clay-dark whitespace-nowrap ml-6">{{ row.price }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const prices = [
  { name: "Khám tổng quát", price: "Từ [xxx.000]đ" },
  { name: "Tiêm phòng (1 mũi)", price: "Từ [xxx.000]đ" },
  { name: "Tắm + vệ sinh cơ bản", price: "Từ [xxx.000]đ" },
  { name: "Grooming trọn gói", price: "Từ [xxx.000]đ" },
  { name: "Xét nghiệm cơ bản", price: "Từ [xxx.000]đ" },
];
</script>
