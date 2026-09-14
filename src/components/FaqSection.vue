<template>
  <section id="hoi-dap" class="bg-tan border-y border-line">
    <div class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-[0.8fr_1.2fr] gap-10">
      <div v-reveal>
        <p class="kicker mb-4">Câu hỏi thường gặp</p>
        <h2 class="section-title max-w-[18ch]">Giải đáp nhanh trước khi bạn đến</h2>
      </div>

      <div class="divide-y divide-line" v-reveal="{ delay: 100 }">
        <div v-for="(item, i) in faqs" :key="item.q">
          <button
            class="w-full flex items-center justify-between gap-4 py-5 text-left"
            @click="openIndex = openIndex === i ? -1 : i"
          >
            <span class="font-medium text-ink">{{ item.q }}</span>
            <span class="text-2xl leading-none text-clay-dark shrink-0">{{ openIndex === i ? "–" : "+" }}</span>
          </button>
          <p v-if="openIndex === i" class="text-ink/70 pb-5 pr-8 leading-relaxed">{{ item.a }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const openIndex = ref(0);

const faqs = [
  { q: "Tôi có cần đặt lịch trước không?", a: "Nên đặt lịch trước qua form hoặc nhắn tin để được ưu tiên giờ khám, tránh chờ lâu vào giờ cao điểm." },
  { q: "Phòng khám có nhận ca cấp cứu ngoài giờ không?", a: "[Điền chính sách cấp cứu thực tế của phòng khám tại đây]." },
  { q: "Chi phí khám và điều trị được tính như thế nào?", a: "Chi phí phụ thuộc vào tình trạng cụ thể của thú cưng. Bác sĩ sẽ tư vấn và báo giá rõ trước khi thực hiện bất kỳ dịch vụ nào." },
  { q: "Tôi có thể thanh toán bằng hình thức nào?", a: "[Điền các hình thức thanh toán được chấp nhận: tiền mặt / chuyển khoản / quét mã...]." },
];
</script>
