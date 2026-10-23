<template>
  <div class="min-h-screen bg-tan/40 print:bg-white flex flex-col">
    <header class="bg-white border-b border-line print:hidden">
      <div class="max-w-content mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <img src="/images/logo-mark.png" alt="" class="h-8 w-8 object-contain" />
          <span class="font-display text-lg text-clay-dark" style="font-weight: 600">2Vet Admin</span>
        </div>
        <a href="/" class="text-sm text-ink/60 hover:text-ink">← Về trang chủ</a>
      </div>
    </header>

    <main class="flex-1 max-w-content w-full mx-auto px-5 md:px-8 py-10 print:py-0 print:px-0">
      <!-- Màn hình nhập mật khẩu -->
      <div v-if="!unlocked" class="max-w-sm mx-auto mt-16">
        <h1 class="font-display text-2xl text-ink mb-2" style="font-weight: 600">Đăng nhập quản trị</h1>
        <p class="text-sm text-ink/60 mb-6">Nhập mật khẩu để xem số liệu truy cập trang.</p>
        <form @submit.prevent="login" class="space-y-3">
          <input
            v-model="passwordInput"
            type="password"
            placeholder="Mật khẩu"
            class="w-full rounded-xl border border-line bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber/40"
          />
          <button type="submit" class="btn-primary w-full" :disabled="loggingIn">
            {{ loggingIn ? "Đang kiểm tra..." : "Đăng nhập" }}
          </button>
          <p v-if="loginError" class="text-sm text-red-600">{{ loginError }}</p>
        </form>
      </div>

      <!-- Dashboard -->
      <div v-else>
        <h1 class="font-display text-2xl text-ink mb-8 print:hidden" style="font-weight: 600">Thống kê</h1>

        <!-- Hiện đang hiển thị bộ số liệu mẫu (src/data/demoStats.js) để trình bày giao diện.
             Khi đi vào hoạt động thật, thay nguồn dữ liệu trong DemoDashboard.vue bằng số liệu thật. -->
        <DemoDashboard />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DemoDashboard from "./admin/DemoDashboard.vue";


const unlocked = ref(false);
const passwordInput = ref("");
const loggingIn = ref(false);
const loginError = ref("");


onMounted(() => {
  if (sessionStorage.getItem("2vet_admin_unlocked") === "1") {
    unlocked.value = true;
  }
});

async function login() {
  loggingIn.value = true;
  loginError.value = "";
  try {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput.value }),
    });
    const result = await res.json();
    if (result.ok) {
      unlocked.value = true;
      sessionStorage.setItem("2vet_admin_unlocked", "1");
    } else {
      loginError.value = result.error || "Sai mật khẩu.";
    }
  } catch {
    loginError.value = "Không kết nối được server. Trang admin chỉ hoạt động khi đã deploy lên Vercel.";
  } finally {
    loggingIn.value = false;
  }
}

</script>
