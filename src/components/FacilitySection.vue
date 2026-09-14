<template>
  <section class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12" v-reveal>
      <div>
        <p class="kicker mb-4">Cơ sở vật chất</p>
        <h2 class="section-title max-w-[22ch]">Không gian sạch sẽ, đầy đủ trang thiết bị</h2>
      </div>
      <p class="text-ink/60 max-w-[38ch]">
        Phòng khám, phòng phẫu thuật và khu vực chờ được bố trí gọn gàng, giúp cả thú
        cưng và chủ nuôi đều thấy an tâm.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-4 md:gap-5" v-reveal="{ delay: 100 }">
      <PlaceholderImg label="Ảnh: phòng khám tổng quát" aspect="aspect-[4/5]" class="md:row-span-2 md:!aspect-auto md:h-full" />
      <PlaceholderImg label="Ảnh: phòng phẫu thuật / trang thiết bị" aspect="aspect-[4/3]" />
      <PlaceholderImg label="Ảnh: khu vực chờ / quầy lễ tân" aspect="aspect-[4/3]" />
      <PlaceholderImg label="Ảnh: khu grooming / tắm sấy" aspect="aspect-[4/3]" class="md:col-span-2" />
    </div>
  </section>
</template>

<script setup>
import PlaceholderImg from "./PlaceholderImg.vue";
</script>
