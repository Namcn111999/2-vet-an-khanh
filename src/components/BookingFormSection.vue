<template>
  <section id="dat-lich" class="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
    <div class="grid md:grid-cols-2 gap-12 items-start">
      <div v-reveal>
        <p class="kicker mb-4">Đặt lịch</p>
        <h2 class="section-title max-w-[18ch] mb-5">Để lại thông tin, đội ngũ sẽ liên hệ trong ít phút</h2>
        <p class="text-ink/60 max-w-[38ch] leading-relaxed">
          Hoặc nhắn tin trực tiếp qua Messenger / gọi hotline nếu cần hỗ trợ ngay:
        </p>
        <div class="flex flex-wrap gap-3 mt-5">
          <a href="tel:0963418126" class="btn-secondary">Gọi 096 34 18126</a>
          <a href="https://m.me/[tên-trang-facebook]" target="_blank" rel="noopener" class="btn-secondary">
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
          Có lỗi khi gửi, vui lòng gọi hotline 096 34 18126 để đặt lịch nhanh hơn.
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
    // =====================================================================
    // TODO – NỐI VÀO NƠI NHẬN LEAD THẬT (chọn 1 trong các cách sau):
    //  1) Google Apps Script Web App ghi vào Google Sheet:
    //     await fetch("https://script.google.com/macros/s/XXXX/exec", {
    //       method: "POST", body: JSON.stringify(payload)
    //     });
    //  2) Zalo OA / CRM riêng: gọi API tương ứng ở đây.
    // Hiện tại form chỉ log ra console để bạn kiểm tra dữ liệu khi test.
    // =====================================================================
    console.log("Booking form submitted:", payload);

    status.value = "success";
    form.name = "";
    form.phone = "";
    form.time = "";
  } catch (e) {
    status.value = "error";
  }
}
</script>
