// Danh sách chương trình khuyến mãi theo lịch — chỉ cần thêm/sửa ở đây,
// KHÔNG cần sửa gì trong PromoSection.vue. Trang sẽ tự chọn đúng chương
// trình đang trong khoảng ngày hiện tại để hiển thị, không cần deploy
// lại đúng ngày chương trình bắt đầu.
//
// Cách thêm chương trình mới: copy 1 object bên dưới, đổi id/start/end/nội dung.
// - start/end dạng "YYYY-MM-DD", tính theo giờ Việt Nam, bao gồm cả 2 ngày đầu-cuối.
// - Nếu 2 chương trình trùng ngày, chương trình đứng TRƯỚC trong mảng sẽ được ưu tiên.

export const promos = [
  {
    id: "giao-mua-2026-10",
    start: "2026-10-18",
    end: "2026-10-31",
    title: "Giao mùa – Nguy cơ cao chó mèo mắc bệnh truyền nhiễm",
    desc: "Thời tiết thay đổi thất thường là điểm lý tưởng để virus parvo ở chó và giảm bạch cầu ở mèo bùng phát. Tiêm phòng đầy đủ, đúng lịch và đưa bé đi khám định kỳ để bảo vệ thú cưng ngay hôm nay.",
    cta: "Đặt lịch tiêm phòng",
    img: "/images/promo/giao-mua-2026.jpg",
    imgLabel: "Banner Giao mùa – nguy cơ cao chó mèo mắc bệnh truyền nhiễm",
  },
  {
    id: "quoc-khanh-2026",
    start: "2026-09-01",
    end: "2026-09-03",
    title: "Mừng Quốc khánh 2/9 – Khám tổng quát đầu tháng",
    desc: "Giảm 20% phí khám tổng quát và xét nghiệm cơ bản. Tặng vòng chống ve rận mini cho 20 khách đặt lịch sớm nhất.",
    cta: "Đặt lịch nhận ưu đãi",
    imgLabel: "Banner Mừng Quốc khánh 2/9, đồng bộ ảnh đang chạy ads",
  },
  {
    id: "grooming-t9-2026",
    start: "2026-09-10",
    end: "2026-09-14",
    title: "Săn ưu đãi giữa tháng – Grooming làm đẹp",
    desc: "Giảm 15% gói tắm spa/grooming khi đặt lịch qua form hoặc tin nhắn Fanpage. Tặng thêm cắt móng miễn phí.",
    cta: "Đặt lịch grooming",
    imgLabel: "Banner ưu đãi Grooming giữa tháng 9",
  },
  {
    id: "trung-thu-2026",
    start: "2026-09-20",
    end: "2026-09-27",
    title: "Trung Thu Rộn Ràng – Bé ghé 2Vet, quà đã sẵn sàng",
    desc: "Spa trọn gói tặng ngay ảnh polaroid mini và phụ kiện xinh cho boss. Đăng ảnh tag 2Vet An Khánh, có cơ hội nhận voucher 100.000đ. Đặt lịch từ 28–30/09 để giữ chỗ đầu tháng 10 và nhận thêm Flash Sale 5–10%.",
    cta: "Đặt lịch nhận quà Trung Thu",
    img: "/images/promo/trung-thu-2026.jpg",
    imgLabel: "Banner Trung Thu yêu thương, đồng bộ ảnh đang chạy ads",
  },
  {
    id: "chot-so-t9-2026",
    start: "2026-09-28",
    end: "2026-09-30",
    title: "Chốt sổ tháng 9 – Đặt lịch sớm nhận ưu đãi tháng 10",
    desc: "Giảm thêm 5–10% cho khách đặt lịch trước cho đầu tháng 10. Số lượng ưu đãi có hạn trong 3 ngày cuối tháng.",
    cta: "Giữ chỗ sớm",
    imgLabel: "Banner Chốt sổ tháng 9",
  },
];

// Chương trình mặc định khi không có campaign nào đang chạy
// (VD: giữa các đợt sale, hoặc chưa tới ngày bắt đầu chương trình đầu tiên).
export const fallbackPromo = {
  id: "fallback",
  title: "Theo dõi Fanpage để không bỏ lỡ ưu đãi mới nhất",
  desc: "2Vet An Khánh thường xuyên có chương trình ưu đãi theo tuần/tháng cho khám bệnh, tiêm phòng và grooming.",
  cta: "Nhắn tin để được tư vấn",
  imgLabel: "Ảnh/banner chung của bệnh viện (không gắn chương trình cụ thể)",
};

function toDate(str) {
  return new Date(`${str}T00:00:00+07:00`);
}

// Trả về { promo, state } — state là "active" (đang chạy) hoặc "upcoming" (sắp tới) hoặc "none".
export function getPromoForDate(date = new Date()) {
  for (const p of promos) {
    const start = toDate(p.start);
    const end = new Date(toDate(p.end).getTime() + 24 * 60 * 60 * 1000 - 1);
    if (date >= start && date <= end) {
      return { promo: p, state: "active" };
    }
  }

  const upcoming = promos
    .filter((p) => toDate(p.start) > date)
    .sort((a, b) => toDate(a.start) - toDate(b.start))[0];

  if (upcoming) {
    return { promo: upcoming, state: "upcoming" };
  }

  return { promo: fallbackPromo, state: "none" };
}
