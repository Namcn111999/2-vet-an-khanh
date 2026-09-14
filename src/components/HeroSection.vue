<template>
  <section id="top" class="relative overflow-hidden bg-paper">
    <div class="relative max-w-content mx-auto px-5 md:px-8 pt-14 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-[1.05fr_1fr] gap-12 items-center">
      <div v-reveal>
        <p class="inline-flex items-center gap-2 text-[0.95rem] italic text-clay-dark font-medium mb-5">
          <span class="w-2 h-2 rounded-full bg-amber inline-block not-italic"></span>
          Tây Mỗ, Hà Nội
        </p>
        <h1 class="hero-title text-4xl md:text-[3.6rem] text-ink">
          Nơi thú cưng của bạn được chăm sóc như người nhà
        </h1>
        <p class="mt-6 text-lg text-ink/70 max-w-[46ch] leading-relaxed">
          2Vet An Khánh khám, điều trị và chăm sóc chó mèo tận tâm ngay tại khu vực
          Tây Mỗ. Đặt lịch trong một phút, được phản hồi ngay.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a href="#dat-lich" class="btn-primary">Đặt lịch khám ngay</a>
          <a
            href="https://m.me/[tên-trang-facebook]"
            target="_blank"
            rel="noopener"
            class="btn-secondary"
          >
            Nhắn tin Messenger
          </a>
        </div>

        <dl class="mt-12 grid grid-cols-3 gap-6 max-w-md">
          <div>
            <dt class="stat-number text-2xl text-amber-dark">8:00–19:00</dt>
            <dd class="text-sm text-ink/50 mt-1">Mở cửa cả tuần</dd>
          </div>
          <div>
            <dt class="stat-number text-2xl text-amber-dark">3</dt>
            <dd class="text-sm text-ink/50 mt-1">Dịch vụ chính</dd>
          </div>
          <div>
            <dt class="stat-number text-2xl text-amber-dark">[N]+</dt>
            <dd class="text-sm text-ink/50 mt-1">Thú cưng đã khám</dd>
          </div>
        </dl>
      </div>

      <div class="relative" v-reveal="{ delay: 150 }">
        <div
          class="absolute -inset-4 md:-inset-6 bg-amber/12 -z-10"
          style="border-radius: 62% 38% 55% 45% / 45% 55% 45% 55%"
        ></div>
        <div
          class="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber/50 bg-tan text-clay-dark/70 overflow-hidden aspect-[4/5] w-full"
          style="border-radius: 62% 38% 55% 45% / 45% 55% 45% 55%"
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
          <p class="text-xs text-center px-4 leading-snug">
            Ảnh Hero: bác sĩ đang khám/âu yếm chó hoặc mèo, ánh sáng tự nhiên — khổ dọc
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
