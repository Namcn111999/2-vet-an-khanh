<template>
  <header class="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
    <div class="max-w-content mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
      <a href="#top" class="flex items-center gap-2.5">
        <img src="/images/logo-mark.png" alt="2Vet An Khánh" class="h-9 w-9 object-contain" />
        <span class="font-display text-xl text-clay-dark" style="font-weight: 600">2Vet <span class="text-amber-dark">An Khánh</span></span>
      </a>

      <nav class="hidden md:flex items-center gap-7 text-sm font-medium text-ink/80">
        <a href="#dich-vu" class="hover:text-clay-dark transition-colors">Dịch vụ</a>
        <a href="#uu-dai" class="hover:text-clay-dark transition-colors">Ưu đãi</a>
        <a href="#doi-ngu" class="hover:text-clay-dark transition-colors">Đội ngũ</a>
        <a href="#khach-hang" class="hover:text-clay-dark transition-colors">Khách hàng</a>
        <a href="#hoi-dap" class="hover:text-clay-dark transition-colors">Hỏi đáp</a>
      </nav>

      <div class="flex items-center gap-3">
        <a
          href="tel:0963418126"
          class="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-clay-dark"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
          </svg>
          096 34 18126
        </a>
        <a href="#dat-lich" class="btn-primary !px-5 !py-2.5 text-sm">Đặt lịch ngay</a>
      </div>
    </div>
  </header>
</template>
