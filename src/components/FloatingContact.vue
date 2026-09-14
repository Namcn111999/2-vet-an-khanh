<template>
  <div class="fixed bottom-6 right-5 md:right-8 z-50 flex flex-col items-end gap-3">
    <button
      type="button"
      @click="chatOpen = !chatOpen"
      class="fab-item group flex items-center gap-0"
      style="--fab-delay: 0ms"
      aria-label="Mở trợ lý chat"
    >
      <span class="fab-label max-w-0 group-hover:max-w-[160px] overflow-hidden whitespace-nowrap bg-ink text-paper text-sm font-medium px-0 group-hover:px-3.5 py-2 rounded-full transition-all duration-300 ease-out">
        Hỏi trợ lý 2Vet
      </span>
      <span class="relative w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 transition-transform duration-200 group-hover:scale-105 group-active:scale-95 bg-clay-dark">
        <span class="fab-pulse bg-clay-dark"></span>
        <span v-if="showNudge" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber text-white text-[10px] font-bold flex items-center justify-center">1</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.2-3.5A7.96 7.96 0 0 1 4 12z" stroke="white" stroke-width="1.6" stroke-linejoin="round" />
          <circle cx="9" cy="12" r="1" fill="white" /><circle cx="12" cy="12" r="1" fill="white" /><circle cx="15" cy="12" r="1" fill="white" />
        </svg>
      </span>
    </button>
  </div>

  <Transition name="fade">
    <ChatWidget v-if="chatOpen" @close="chatOpen = false" />
  </Transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ChatWidget from "./ChatWidget.vue";

const chatOpen = ref(false);
const showNudge = ref(false);

onMounted(() => {
  setTimeout(() => {
    if (!chatOpen.value) showNudge.value = true;
  }, 4000);
});
</script>

<style scoped>
.fab-item {
  opacity: 0;
  transform: translateX(24px);
  animation: fab-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--fab-delay);
}
@keyframes fab-in {
  to {
    opacity: 1;
    transform: none;
  }
}
.fab-pulse {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  opacity: 0.55;
  animation: fab-pulse 2.2s ease-out infinite;
}
@keyframes fab-pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .fab-item {
    opacity: 1;
    transform: none;
    animation: none;
  }
  .fab-pulse {
    animation: none;
    display: none;
  }
}
</style>
