// Bộ câu hỏi/trả lời cho chatbot — dạng dò từ khoá (rule-based), không cần server/API.
// Cách thêm câu hỏi mới: copy 1 object trong mảng `intents`, đổi `keywords` (từ khoá
// người dùng có thể gõ, không dấu/có dấu đều nên liệt kê) và `reply`.
// Muốn nâng cấp lên AI thật (hiểu ngôn ngữ tự nhiên, trả lời linh hoạt hơn) thì cần nối
// sang một API chatbot (VD: qua Claude API) ở một backend riêng — xem ghi chú trong README.

export const intents = [
  {
    id: "gio-mo-cua",
    keywords: ["giờ", "mở cửa", "đóng cửa", "làm việc", "mấy giờ"],
    reply: "2Vet An Khánh mở cửa 8:00 – 12:00 và 14:00 – 19:00, tất cả các ngày trong tuần (kể cả cuối tuần) nhé!",
  },
  {
    id: "dia-chi",
    keywords: ["địa chỉ", "ở đâu", "chỗ nào", "map", "bản đồ", "đường nào"],
    reply: "Phòng khám ở 29 Lô A20 KĐT Geleximco A, Tây Mỗ, Hà Nội. Bạn bấm nút bên dưới để xem đường đi nhé.",
    action: { label: "Xem bản đồ", scrollTo: "#top", external: "https://www.google.com/maps/place/B%E1%BB%87nh+vi%E1%BB%87n+th%C3%BA+y+2Vet+An+Kh%C3%A1nh/@21.0058754,105.7307084,17z/data=!3m1!4b1!4m6!3m5!1s0x3134534856d051a7:0x3dae2d9f362187f9!8m2!3d21.0058704!4d105.7332833!16s%2Fg%2F11mkff4l35" },
  },
  {
    id: "gia-kham",
    keywords: ["giá", "phí", "bao nhiêu tiền", "chi phí", "báo giá", "tiền"],
    reply: "Chi phí tuỳ tình trạng cụ thể của thú cưng. Mình để bảng giá tham khảo bên dưới, hoặc để lại số điện thoại để phòng khám tư vấn chính xác hơn nhé.",
    action: { label: "Xem bảng giá tham khảo", scrollTo: "#uu-dai" },
  },
  {
    id: "dat-lich",
    keywords: ["đặt lịch", "hẹn lịch", "booking", "đăng ký khám", "lịch khám"],
    reply: "Bạn để lại tên và số điện thoại ở form đặt lịch, đội ngũ sẽ liên hệ lại trong ít phút nhé!",
    action: { label: "Đi tới form đặt lịch", scrollTo: "#dat-lich" },
  },
  {
    id: "tiem-phong",
    keywords: ["tiêm phòng", "vắc xin", "vaccine", "chích ngừa"],
    reply: "2Vet có dịch vụ tiêm phòng theo phác đồ chuẩn và nhắc lịch tiêm tự động cho bạn, không lo quên mũi nào.",
    action: { label: "Xem chi tiết dịch vụ", scrollTo: "#dich-vu" },
  },
  {
    id: "grooming",
    keywords: ["grooming", "tắm", "cắt tỉa", "spa", "cắt lông", "cắt móng"],
    reply: "Dịch vụ Grooming gồm tắm, sấy, cắt tỉa lông, cắt móng và vệ sinh tai cho chó mèo.",
    action: { label: "Xem chi tiết dịch vụ", scrollTo: "#dich-vu" },
  },
  {
    id: "kham-benh",
    keywords: ["khám", "bệnh", "ốm", "bị bệnh", "đau", "khám tổng quát"],
    reply: "2Vet khám tổng quát, chẩn đoán và điều trị nội – ngoại khoa cho chó mèo. Nếu bé đang có dấu hiệu bất thường, bạn nên đặt lịch sớm để được kiểm tra kỹ nhé.",
    action: { label: "Đặt lịch khám ngay", scrollTo: "#dat-lich" },
  },
  {
    id: "hotline",
    keywords: ["hotline", "số điện thoại", "gọi điện", "liên hệ", "số hotline"],
    reply: "Bạn gọi ngay 096 34 18126 để được hỗ trợ nhanh nhất nhé!",
    action: { label: "Gọi 096 34 18126", href: "tel:0963418126" },
  },
];

export const fallbackReply =
  "Mình chưa chắc câu trả lời cho câu hỏi này. Bạn nhắn trực tiếp qua Messenger hoặc gọi hotline 096 34 18126 để được hỗ trợ nhanh và chính xác nhất nhé!";

export const quickReplies = [
  { label: "Giờ mở cửa?", text: "Giờ mở cửa của phòng khám?" },
  { label: "Bảng giá?", text: "Chi phí khám bao nhiêu?" },
  { label: "Đặt lịch khám", text: "Tôi muốn đặt lịch khám" },
  { label: "Địa chỉ ở đâu?", text: "Phòng khám ở đâu?" },
];

export function matchIntent(userText) {
  const normalized = userText.toLowerCase();
  for (const intent of intents) {
    if (intent.keywords.some((kw) => normalized.includes(kw))) {
      return intent;
    }
  }
  return null;
}
