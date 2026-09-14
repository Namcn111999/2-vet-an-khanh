<template>
  <div class="min-h-screen bg-tan/40 flex flex-col">
    <header class="bg-white border-b border-line">
      <div class="max-w-content mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <img src="/images/logo-mark.png" alt="" class="h-8 w-8 object-contain" />
          <span class="font-display text-lg text-clay-dark" style="font-weight: 600">2Vet Admin</span>
        </div>
        <a href="/" class="text-sm text-ink/60 hover:text-ink">← Về trang chủ</a>
      </div>
    </header>

    <main class="flex-1 max-w-content w-full mx-auto px-5 md:px-8 py-10">
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
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-display text-2xl text-ink" style="font-weight: 600">Lượt truy cập</h1>
          <button @click="load" class="text-sm text-clay-dark hover:text-clay font-medium" :disabled="loading">
            {{ loading ? "Đang tải..." : "Làm mới" }}
          </button>
        </div>

        <div v-if="loading && !data" class="text-ink/50">Đang tải số liệu...</div>

        <!-- Chưa cấu hình Umami -->
        <div v-else-if="data && !data.configured" class="bg-white border border-line rounded-2xl p-6 max-w-xl">
          <h2 class="font-semibold text-ink mb-2">Chưa kết nối công cụ đo lường</h2>
          <p class="text-sm text-ink/70 leading-relaxed mb-4">
            Trang admin đã sẵn sàng nhưng chưa có số liệu vì chưa cấu hình Umami Analytics. Làm theo 4 bước trong
            README.md (mục "Trang Admin") để bật:
          </p>
          <ol class="text-sm text-ink/70 space-y-1.5 list-decimal list-inside">
            <li>Đăng ký tài khoản miễn phí tại umami.is</li>
            <li>Tạo website, lấy Website ID và API key</li>
            <li>Thêm 3 biến môi trường trên Vercel (UMAMI_WEBSITE_ID, UMAMI_API_KEY, UMAMI_API_URL)</li>
            <li>Gắn script theo dõi vào index.html (đã có sẵn chỗ trống, chỉ cần điền ID)</li>
          </ol>
        </div>

        <!-- Có dữ liệu -->
        <div v-else-if="data && data.configured" class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white border border-line rounded-2xl p-5">
            <p class="text-sm text-ink/50 mb-1">Đang online</p>
            <p class="stat-number text-3xl text-amber-dark">{{ data.activeNow ?? "—" }}</p>
          </div>
          <div class="bg-white border border-line rounded-2xl p-5">
            <p class="text-sm text-ink/50 mb-1">Hôm nay</p>
            <p class="stat-number text-3xl text-clay-dark">{{ data.today?.pageviews ?? "—" }}</p>
            <p class="text-xs text-ink/40 mt-1">{{ data.today?.visitors ?? "—" }} khách</p>
          </div>
          <div class="bg-white border border-line rounded-2xl p-5">
            <p class="text-sm text-ink/50 mb-1">7 ngày qua</p>
            <p class="stat-number text-3xl text-clay-dark">{{ data.week?.pageviews ?? "—" }}</p>
            <p class="text-xs text-ink/40 mt-1">{{ data.week?.visitors ?? "—" }} khách</p>
          </div>
          <div class="bg-white border border-line rounded-2xl p-5">
            <p class="text-sm text-ink/50 mb-1">30 ngày qua</p>
            <p class="stat-number text-3xl text-clay-dark">{{ data.month?.pageviews ?? "—" }}</p>
            <p class="text-xs text-ink/40 mt-1">{{ data.month?.visitors ?? "—" }} khách</p>
          </div>
        </div>

        <p v-if="loadError" class="text-sm text-red-600 mt-4">{{ loadError }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const unlocked = ref(false);
const passwordInput = ref("");
const loggingIn = ref(false);
const loginError = ref("");

const data = ref(null);
const loading = ref(false);
const loadError = ref("");

onMounted(() => {
  if (sessionStorage.getItem("2vet_admin_unlocked") === "1") {
    unlocked.value = true;
    load();
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
      load();
    } else {
      loginError.value = result.error || "Sai mật khẩu.";
    }
  } catch {
    loginError.value = "Không kết nối được server. Trang admin chỉ hoạt động khi đã deploy lên Vercel.";
  } finally {
    loggingIn.value = false;
  }
}

async function load() {
  loading.value = true;
  loadError.value = "";
  try {
    const res = await fetch("/api/analytics");
    data.value = await res.json();
  } catch {
    loadError.value = "Không tải được số liệu. Kiểm tra lại kết nối hoặc cấu hình Umami.";
  } finally {
    loading.value = false;
  }
}
</script>
