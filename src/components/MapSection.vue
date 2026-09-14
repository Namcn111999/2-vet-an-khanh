<template>
  <section class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
    <div v-reveal>
      <p class="kicker mb-4">Vị trí & giờ mở cửa</p>
      <h2 class="section-title max-w-[18ch] mb-6">Ghé thăm 2Vet An Khánh</h2>
      <dl class="space-y-4 text-ink/80">
        <div>
          <dt class="text-sm text-ink/50">Địa chỉ</dt>
          <dd class="mt-0.5">29 Lô A20 KĐT Geleximco A, Tây Mỗ, Hà Nội</dd>
        </div>
        <div>
          <dt class="text-sm text-ink/50">Giờ mở cửa</dt>
          <dd class="mt-0.5">8:00 – 12:00 &amp; 14:00 – 19:00, tất cả các ngày trong tuần</dd>
        </div>
        <div>
          <dt class="text-sm text-ink/50">Hotline</dt>
          <dd class="mt-0.5">096 34 18126</dd>
        </div>
      </dl>
      <a href="#dat-lich" class="btn-primary mt-8">Chỉ đường & đặt lịch</a>
    </div>

    <div v-reveal="{ delay: 120 }">
      <div class="rounded-2xl overflow-hidden border border-line aspect-[4/3]">
        <iframe
          title="Bản đồ 2Vet An Khánh"
          src="https://www.google.com/maps?q=21.0058704,105.7332833&z=17&output=embed"
          class="w-full h-full"
          style="border: 0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <a
        href="https://www.google.com/maps/place/B%E1%BB%87nh+vi%E1%BB%87n+th%C3%BA+y+2Vet+An+Kh%C3%A1nh/@21.0058754,105.7307084,17z/data=!3m1!4b1!4m6!3m5!1s0x3134534856d051a7:0x3dae2d9f362187f9!8m2!3d21.0058704!4d105.7332833!16s%2Fg%2F11mkff4l35"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-1.5 text-sm text-clay-dark font-medium mt-3 hover:text-clay"
      >
        Mở trong Google Maps
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
  </section>
</template>
