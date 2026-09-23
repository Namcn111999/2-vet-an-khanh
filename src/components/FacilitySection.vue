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
      <img src="/images/facility/examroom.jpg" alt="Bác sĩ khám cho thú cưng tại 2Vet An Khánh" class="w-full aspect-[4/5] object-cover rounded-2xl md:row-span-2 md:!aspect-auto md:h-full" />
      <img src="/images/facility/surgery.jpg" alt="Phòng phẫu thuật tại 2Vet An Khánh" class="w-full aspect-[4/3] object-cover rounded-2xl" />
      <img src="/images/facility/reception.jpg" alt="Khu vực chờ và quầy lễ tân 2Vet An Khánh" class="w-full aspect-[4/3] object-cover rounded-2xl" />
      <img src="/images/facility/grooming.jpg" alt="Khu grooming, tắm sấy tại 2Vet An Khánh" class="w-full aspect-[4/3] object-cover rounded-2xl md:col-span-2" />
    </div>
  </section>
</template>
