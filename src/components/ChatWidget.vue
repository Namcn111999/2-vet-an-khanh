<template>
  <div class="chat-panel fixed z-50 bottom-24 right-5 md:right-8 w-[calc(100vw-2.5rem)] max-w-[360px] bg-white rounded-2xl border border-line flex flex-col overflow-hidden" style="height: min(520px, 70vh)">
    <div class="flex items-center gap-3 px-4 py-3.5 border-b border-line shrink-0">
      <img src="/images/logo-mark.png" alt="" class="w-9 h-9 object-contain" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-ink truncate">Trợ lý 2Vet An Khánh</p>
        <p class="text-xs text-ink/50 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
          Thường trả lời trong vài phút
        </p>
      </div>
      <button @click="$emit('close')" aria-label="Đóng khung chat" class="text-ink/40 hover:text-ink/70 p-1">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div ref="threadEl" class="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-tan/40">
      <div v-for="(m, i) in messages" :key="i" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
        <div
          class="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
          :class="m.role === 'user' ? 'bg-amber text-white rounded-br-md' : 'bg-white border border-line text-ink rounded-bl-md'"
        >
          <p>{{ m.text }}</p>
          <a
            v-if="m.action"
            @click.prevent="handleAction(m.action)"
            :href="m.action.href || '#'"
            class="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-amber-dark hover:text-clay-dark"
          >
            {{ m.action.label }}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </a>
        </div>
      </div>

      <div v-if="typing" class="flex justify-start">
        <div class="bg-white border border-line rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
          <span class="typing-dot"></span>
          <span class="typing-dot" style="animation-delay: 0.15s"></span>
          <span class="typing-dot" style="animation-delay: 0.3s"></span>
        </div>
      </div>
    </div>

    <div v-if="showQuickReplies" class="px-4 pb-2.5 flex flex-wrap gap-2 shrink-0">
      <button
        v-for="qr in quickReplies"
        :key="qr.label"
        @click="send(qr.text)"
        class="text-xs font-medium border border-clay/30 text-clay-dark rounded-full px-3 py-1.5 hover:bg-tan transition-colors"
      >
        {{ qr.label }}
      </button>
    </div>

    <form @submit.prevent="send(draft)" class="flex items-center gap-2 p-3 border-t border-line shrink-0">
      <input
        v-model="draft"
        type="text"
        placeholder="Nhập câu hỏi..."
        class="flex-1 rounded-full border border-line bg-tan/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/40"
      />
      <button
        type="submit"
        :disabled="!draft.trim()"
        aria-label="Gửi"
        class="w-10 h-10 rounded-full bg-amber text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z" stroke="white" stroke-width="1.6" stroke-linejoin="round" fill="white" /></svg>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import { matchIntent, fallbackReply, quickReplies } from "../data/chatbotIntents";

const emit = defineEmits(["close"]);

const messages = ref([
  {
    role: "bot",
    text: "Chào bạn! Mình là trợ lý của 2Vet An Khánh. Bạn cần hỏi về giờ mở cửa, bảng giá, đặt lịch hay dịch vụ nào không?",
  },
]);
const draft = ref("");
const typing = ref(false);
const threadEl = ref(null);
const showQuickReplies = ref(true);

async function scrollToBottom() {
  await nextTick();
  if (threadEl.value) threadEl.value.scrollTop = threadEl.value.scrollHeight;
}

function handleAction(action) {
  if (action.href) {
    window.location.href = action.href;
    return;
  }
  if (action.scrollTo) {
    const el = document.querySelector(action.scrollTo);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    emit("close");
  }
  if (action.external) {
    window.open(action.external, "_blank", "noopener");
  }
}

async function send(text) {
  const value = (text || "").trim();
  if (!value) return;
  messages.value.push({ role: "user", text: value });
  draft.value = "";
  showQuickReplies.value = false;
  typing.value = true;
  scrollToBottom();

  const minDelay = new Promise((resolve) => setTimeout(resolve, 450 + Math.random() * 350));
  const aiReply = await callAi();
  await minDelay;

  typing.value = false;
  if (aiReply) {
    messages.value.push({ role: "bot", text: aiReply });
  } else {
    // Chưa nối được AI thật (chưa deploy lên Vercel / chưa cấu hình API key) → dùng bộ trả lời dò từ khoá làm dự phòng.
    const intent = matchIntent(value);
    messages.value.push({
      role: "bot",
      text: intent ? intent.reply : fallbackReply,
      action: intent ? intent.action : { label: "Nhắn tin Messenger", href: "https://m.me/[tên-trang-facebook]" },
    });
  }
  scrollToBottom();
}

async function callAi() {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages.value.slice(-10) }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.reply || null;
  } catch {
    return null;
  }
}

onMounted(scrollToBottom);
</script>

<style scoped>
.chat-panel {
  animation: chat-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes chat-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
}
.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--tw-color, #b0a396);
  background: #b0a396;
  animation: typing-bounce 1s infinite ease-in-out;
}
@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .chat-panel {
    animation: none;
  }
  .typing-dot {
    animation: none;
  }
}
</style>
