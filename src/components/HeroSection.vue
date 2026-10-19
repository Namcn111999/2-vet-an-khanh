<template>
  <section id="top" class="relative overflow-hidden bg-paper">
    <div class="relative max-w-content mx-auto px-5 md:px-8 pt-14 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-[1.05fr_1fr] gap-12 items-center">
      <div v-reveal>
        <p class="kicker mb-5">Vinhomes Smart City · An Khánh · Tây Mỗ · Hoài Đức</p>
        <h1 class="hero-title text-4xl md:text-[3.6rem] text-ink">
          Nơi thú cưng của bạn được chăm sóc như người nhà
        </h1>
        <p class="mt-6 text-lg text-ink/70 max-w-[46ch] leading-relaxed">
          2Vet An Khánh khám, điều trị và chăm sóc chó mèo tận tâm, phục vụ khu vực
          Vinhomes Smart City, An Khánh, Tây Mỗ và Hoài Đức. Đặt lịch trong một phút, được phản hồi ngay.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a href="#dat-lich" class="btn-primary">Đặt lịch khám ngay</a>
          <a
            href="https://m.me/2vetankhanh"
            target="_blank"
            rel="noopener"
            class="btn-secondary"
          >
            Nhắn tin Messenger
          </a>
        </div>

        <div class="mt-10 grid sm:grid-cols-2 gap-3 max-w-lg">
          <div class="flex items-start gap-3 p-4 rounded-2xl bg-tan/60">
            <span class="w-9 h-9 rounded-full bg-amber/15 text-amber-dark flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" stroke-width="1.8" /></svg>
            </span>
            <div>
              <p class="font-display text-[0.95rem] text-ink leading-snug" style="font-weight: 600">29 Lô A20, Lê Trọng Tấn – Geleximco</p>
              <p class="text-xs text-ink/45 mt-0.5">Tây Mỗ, Hà Nội</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-2xl bg-tan/60">
            <span class="w-9 h-9 rounded-full bg-amber/15 text-amber-dark flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8" /><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <div>
              <p class="font-display text-[0.95rem] text-ink leading-snug" style="font-weight: 600">Giờ mở cửa</p>
              <p class="text-xs text-ink/45 mt-0.5">8:00–12:00 · 14:00–19:00</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative" v-reveal="{ delay: 150 }">
        <div
          class="absolute -inset-4 md:-inset-6 bg-amber/12 -z-10"
          style="border-radius: 62% 38% 55% 45% / 45% 55% 45% 55%"
        ></div>
        <img
          src="/images/hero-photo.jpg"
          alt="Bác sĩ 2Vet An Khánh đang khám cho mèo"
          class="w-full aspect-[830/780] object-cover"
          style="border-radius: 62% 38% 55% 45% / 45% 55% 45% 55%"
        />
      </div>
    </div>
  </section>
</template>
