<template>
  <div class="min-h-screen bg-tan/40 print:bg-white flex flex-col">
    <header class="bg-white border-b border-line print:hidden">
      <div class="max-w-content mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <img src="/images/logo-mark.png" alt="" class="h-8 w-8 object-contain" />
          <span class="font-display text-lg text-clay-dark" style="font-weight: 600">2Vet An Khánh · Báo cáo</span>
        </div>
        <a href="/" class="text-sm text-ink/60 hover:text-ink">← Về trang chủ</a>
      </div>
    </header>

    <main class="flex-1 max-w-content w-full mx-auto px-5 md:px-8 py-10 print:py-0 print:px-0">
      <div v-if="!unlocked" class="max-w-sm mx-auto mt-16">
        <h1 class="font-display text-2xl text-ink mb-2" style="font-weight: 600">Báo cáo 10/10 – 30/10/2026</h1>
        <p class="text-sm text-ink/60 mb-6">Nhập mật khẩu để xem báo cáo.</p>
        <form @submit.prevent="login" class="space-y-3">
          <input v-model="passwordInput" type="password" placeholder="Mật khẩu" class="w-full rounded-xl border border-line bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber/40" />
          <button type="submit" class="btn-primary w-full" :disabled="loggingIn">{{ loggingIn ? "Đang kiểm tra..." : "Xem báo cáo" }}</button>
          <p v-if="loginError" class="text-sm text-red-600">{{ loginError }}</p>
        </form>
      </div>
      <DemoDashboard v-else :fixed="fixed" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DemoDashboard from "./admin/DemoDashboard.vue";

// Báo cáo cố định kỳ 10/10 – 30/10/2026 (số liệu tính đến 02:14 ngày 30/10)
const fixed = { end: new Date(2026, 9, 30), note: "Số liệu tính đến 02:14 ngày 30/10/2026", partial: "Ngày 30/10 mới có số đến 02:14 sáng" };

const unlocked = ref(false);
const passwordInput = ref("");
const loggingIn = ref(false);
const loginError = ref("");

onMounted(() => {
  const m = document.createElement("meta"); m.name = "robots"; m.content = "noindex, nofollow"; document.head.appendChild(m);
  document.title = "Báo cáo 10/10 – 30/10/2026 – 2Vet An Khánh";
  try { if (sessionStorage.getItem("2vet_admin_unlocked") === "1") unlocked.value = true; } catch {}
});

async function login() {
  loggingIn.value = true;
  loginError.value = "";
  try {
    const res = await fetch("/api/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: passwordInput.value }) });
    const result = await res.json();
    if (result.ok) {
      unlocked.value = true;
      try { sessionStorage.setItem("2vet_admin_unlocked", "1"); } catch {}
    } else {
      loginError.value = result.error || "Sai mật khẩu.";
    }
  } catch {
    loginError.value = "Không kết nối được server.";
  } finally {
    loggingIn.value = false;
  }
}
</script>
