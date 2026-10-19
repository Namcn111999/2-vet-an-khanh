<template>
  <section id="dat-lich" class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
    <div class="grid md:grid-cols-2 gap-12 items-start">
      <div v-reveal>
        <p class="kicker mb-4">Đặt lịch</p>
        <h2 class="section-title max-w-[18ch] mb-5">Để lại thông tin, đội ngũ sẽ liên hệ trong ít phút</h2>
        <p class="text-ink/60 max-w-[38ch] leading-relaxed">
          Hoặc nhắn tin trực tiếp qua Messenger / Zalo nếu cần hỗ trợ ngay:
        </p>
        <div class="flex flex-wrap gap-3 mt-5">
          <a href="https://zalo.me/0963418126" target="_blank" rel="noopener" class="btn-secondary">Zalo 096 34 18126</a>
          <a href="https://m.me/2vetankhanh" target="_blank" rel="noopener" class="btn-secondary">
            Messenger
          </a>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4" v-reveal="{ delay: 120 }">
        <div>
          <label class="block text-sm text-ink/70 mb-1.5" for="name">Tên của bạn</label>
          <input
            id="name"
            v-model="form.name"
            required
            type="text"
            class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label class="block text-sm text-ink/70 mb-1.5" for="phone">Số điện thoại</label>
          <input
            id="phone"
            v-model="form.phone"
            required
            type="tel"
            pattern="[0-9+ ]{9,12}"
            class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
            placeholder="09xx xxx xxx"
          />
        </div>

        <div>
          <label class="block text-sm text-ink/70 mb-1.5" for="service">Dịch vụ cần</label>
          <select
            id="service"
            v-model="form.service"
            class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
          >
            <option>Khám & điều trị bệnh</option>
            <option>Tiêm phòng</option>
            <option>Grooming</option>
            <option>Chưa chắc, cần tư vấn</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-ink/70 mb-1.5" for="time">Khung giờ mong muốn</label>
          <input
            id="time"
            v-model="form.time"
            type="text"
            class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
            placeholder="VD: chiều thứ 7"
          />
        </div>

        <button type="submit" class="btn-primary w-full !py-3.5" :disabled="status === 'sending'">
          {{ status === "sending" ? "Đang gửi..." : "Gửi thông tin đặt lịch" }}
        </button>

        <p v-if="status === 'success'" class="text-clay-dark text-sm">
          Đã nhận thông tin! Đội ngũ 2Vet An Khánh sẽ liên hệ lại sớm.
        </p>
        <p v-if="status === 'error'" class="text-red-600 text-sm">
          Có lỗi khi gửi, vui lòng nhắn Zalo hotline 096 34 18126 để đặt lịch nhanh hơn.
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";

const form = reactive({ name: "", phone: "", service: "Khám & điều trị bệnh", time: "" });
const status = ref("idle");

// Đọc UTM từ URL (VD: ?utm_campaign=trungthu2026) để biết khách đến từ chương trình nào.
function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
  };
}

async function handleSubmit() {
  status.value = "sending";
  const payload = { ...form, ...getUtmParams(), submittedAt: new Date().toISOString() };

  try {
    // Gửi thông tin khách vào Google Sheet qua Google Apps Script (xem docs/google-sheet-leads.md).
    // Địa chỉ webhook đặt ở biến môi trường VITE_LEAD_WEBHOOK_URL. Chưa đặt thì form vẫn chạy
    // bình thường nhưng chỉ log ra console.
    // URL Apps Script không phải bí mật (chỉ nhận dữ liệu, không đọc được Sheet), nên để sẵn mặc định ở đây;
    // vẫn có thể ghi đè bằng biến môi trường VITE_LEAD_WEBHOOK_URL.
    const webhook =
      import.meta.env.VITE_LEAD_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbzc6dIYoYtoIH5ayg3AKcTZ3EIxc2mRhvRbWQgO4XVk7gdYKqrYAmgM-pK7lANizrAa/exec";
    if (webhook) {
      // text/plain + no-cors để tránh preflight CORS của Apps Script; không đọc được phản hồi nên
      // chỉ báo lỗi khi mạng thật sự hỏng.
      await fetch(webhook, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
    }
    console.log("Booking form submitted:", payload);

    // Ghi nhận "lượt đặt lịch" là 1 sự kiện chuyển đổi trong Umami (tách biệt với
    // lượt xem trang thường) — trang /admin sẽ đọc số liệu này để hiện đúng số
    // khách đã thật sự để lại thông tin, không chỉ số người ghé xem.
    // An toàn nếu chưa gắn Umami: window.umami sẽ là undefined, dòng dưới tự bỏ qua.
    window.fbq?.("track", "Lead", { content_name: form.service });
    window.umami?.track("dat_lich", { service: form.service, utm_campaign: payload.utm_campaign });

    status.value = "success";
    form.name = "";
    form.phone = "";
    form.time = "";
  } catch (e) {
    status.value = "error";
  }
}
</script>
