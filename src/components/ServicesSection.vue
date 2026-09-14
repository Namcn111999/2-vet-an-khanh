<template>
  <section id="dich-vu" class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
    <div v-reveal>
      <p class="kicker mb-4">Dịch vụ</p>
      <h2 class="section-title max-w-[22ch] mb-14">Ba dịch vụ chính, làm đúng và làm kỹ</h2>
    </div>

    <div class="space-y-16 md:space-y-24">
      <div
        v-for="(svc, i) in services"
        :key="svc.title"
        class="grid md:grid-cols-2 gap-8 md:gap-14 items-center"
        v-reveal
      >
        <div
          class="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed overflow-hidden aspect-[4/3]"
          :class="[svc.tint.border, svc.tint.bg, svc.tint.text, i % 2 === 1 ? 'md:order-2' : '']"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="opacity-70">
            <path
              d="M4 16.5L8.5 12l3 3 4-5L20 16.5M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p class="text-xs text-center px-4 leading-snug">{{ svc.imgLabel }}</p>
        </div>

        <div :class="i % 2 === 1 ? 'md:order-1' : ''">
          <span
            class="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full"
            :class="[svc.tint.bg, svc.tint.text]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="svc.tint.dot"></span>
            {{ svc.tag }}
          </span>
          <h3 class="font-display text-2xl md:text-3xl text-ink mt-4 mb-4" style="font-weight: 600">{{ svc.title }}</h3>
          <p class="text-ink/70 leading-relaxed max-w-[42ch]">{{ svc.desc }}</p>
          <ul class="mt-5 space-y-2.5">
            <li v-for="item in svc.points" :key="item" class="flex items-start gap-3 text-ink/80">
              <span
                class="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                :class="[svc.tint.bg, svc.tint.text]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const tints = {
  clay: { bg: "bg-clay/10", text: "text-clay", border: "border-clay/30", dot: "bg-clay" },
  amber: { bg: "bg-amber/15", text: "text-amber-dark", border: "border-amber/40", dot: "bg-amber" },
};

const services = [
  {
    tag: "Khám & điều trị",
    title: "Khám và điều trị bệnh",
    desc: "Thăm khám, chẩn đoán và điều trị nội – ngoại khoa cho chó mèo, từ các vấn đề thường gặp đến ca cần theo dõi sát.",
    points: ["Khám tổng quát & xét nghiệm cơ bản", "Điều trị nội trú khi cần", "Tư vấn theo dõi sau điều trị"],
    imgLabel: "Ảnh: bác sĩ đang khám cho chó/mèo trên bàn khám",
    tint: tints.clay,
  },
  {
    tag: "Grooming",
    title: "Tắm spa & làm đẹp",
    desc: "Vệ sinh, cắt tỉa lông, chăm sóc da lông theo từng giống loài, giúp thú cưng sạch sẽ và thoải mái.",
    points: ["Tắm, sấy, cắt tỉa lông", "Cắt móng, vệ sinh tai", "Gói chăm sóc định kỳ"],
    imgLabel: "Ảnh: thú cưng đang được tắm/grooming",
    tint: tints.amber,
  },
  {
    tag: "Tiêm phòng",
    title: "Tiêm phòng & khám định kỳ",
    desc: "Lên lịch tiêm phòng đầy đủ theo độ tuổi, nhắc lịch tự động để không bỏ lỡ mũi tiêm quan trọng nào.",
    points: ["Tiêm phòng theo phác đồ chuẩn", "Nhắc lịch tiêm tự động", "Khám sức khoẻ định kỳ"],
    imgLabel: "Ảnh: bác sĩ đang tiêm phòng cho thú cưng",
    tint: tints.clay,
  },
];
</script>
