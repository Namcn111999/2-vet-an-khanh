<template>
  <footer class="bg-ink text-paper/80">
    <div class="max-w-content mx-auto px-5 md:px-8 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
      <div>
        <div class="flex items-center gap-2.5">
          <img src="/images/logo-mark.png" alt="2Vet An Khánh" class="h-9 w-9 object-contain" />
          <p class="font-display text-xl text-paper" style="font-weight: 600">2Vet <span class="text-amber">An Khánh</span></p>
        </div>
        <p class="mt-3 text-sm leading-relaxed max-w-[26ch]">
          Phòng khám thú y tận tâm tại khu vực Tây Mỗ, Hà Nội.
        </p>
      </div>

      <div>
        <p class="text-sm font-semibold text-paper mb-3">Liên hệ</p>
        <ul class="space-y-2 text-sm">
          <li>29 Lô A20 KĐT Geleximco A, Tây Mỗ, Hà Nội</li>
          <li>096 34 18126</li>
          <li>[email@2vetankhanh.vn]</li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold text-paper mb-3">Giờ mở cửa</p>
        <ul class="space-y-2 text-sm">
          <li>8:00 – 12:00 &amp; 14:00 – 19:00</li>
          <li>Tất cả các ngày trong tuần</li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-semibold text-paper mb-3">Kết nối</p>
        <ul class="space-y-2 text-sm">
          <li><a href="https://facebook.com/[tên-trang]" target="_blank" rel="noopener" class="hover:text-paper">Facebook</a></li>
          <li><a href="https://zalo.me/[oa-id]" target="_blank" rel="noopener" class="hover:text-paper">Zalo OA</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-paper/10">
      <div class="max-w-content mx-auto px-5 md:px-8 py-5 text-xs text-paper/50">
        © {{ year }} 2Vet An Khánh. Đã đăng ký bản quyền.
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>
