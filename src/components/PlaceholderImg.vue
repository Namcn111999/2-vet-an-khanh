<template>
  <!--
    Ô ẢNH TẠM — thay bằng ảnh thật khi có.
    Cách thay: đặt file ảnh vào /public/images/, rồi đổi thẻ này
    thành <img src="/images/ten-file.jpg" alt="..." class="[giữ nguyên class]" />
  -->
  <div
    class="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-clay/40 bg-tan text-clay-dark/80 overflow-hidden"
    :class="[rounded, aspect]"
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="opacity-60">
      <path
        d="M4 16.5L8.5 12l3 3 4-5L20 16.5M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <p class="text-xs text-center px-4 leading-snug">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: "Ảnh sẽ cập nhật" },
  aspect: { type: String, default: "aspect-[4/3]" },
  rounded: { type: String, default: "rounded-2xl" },
});
</script>
