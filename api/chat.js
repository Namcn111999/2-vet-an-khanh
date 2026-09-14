// Vercel Serverless Function — nhận tin nhắn từ chatbot trên landing page,
// gọi sang Claude API để trả lời thật (hiểu ngôn ngữ tự nhiên), thay vì chỉ dò từ khoá.
//
// CHỈ CHẠY ĐƯỢC KHI ĐÃ DEPLOY LÊN VERCEL (hoặc chạy `vercel dev` cục bộ) — không chạy
// được với `npm run dev` thường (Vite không tự chạy thư mục /api), và KHÔNG chạy được
// trong file preview tĩnh (mở trực tiếp .html) vì đó không có server đứng sau.
//
// Bắt buộc phải cấu hình biến môi trường ANTHROPIC_API_KEY trong Vercel trước khi dùng
// (Project Settings → Environment Variables). Xem hướng dẫn chi tiết trong README.md.

const SYSTEM_PROMPT = `Bạn là trợ lý ảo của 2Vet An Khánh, một phòng khám thú y tại Việt Nam.

Thông tin phòng khám:
- Địa chỉ: 29 Lô A20 KĐT Geleximco A, Tây Mỗ, Hà Nội
- Hotline: 096 34 18126
- Giờ mở cửa: 8:00–12:00 và 14:00–19:00, tất cả các ngày trong tuần
- Dịch vụ: Khám & điều trị bệnh (nội - ngoại khoa), Grooming (tắm spa, cắt tỉa lông, cắt móng), Tiêm phòng & khám định kỳ

Quy tắc trả lời:
- Trả lời bằng tiếng Việt, ngắn gọn (tối đa 3-4 câu), thân thiện, đúng trọng tâm.
- Không tự bịa ra mức giá cụ thể, tên bác sĩ, hay cam kết y khoa nào không có trong thông tin trên — nếu được hỏi, mời khách để lại số điện thoại hoặc gọi hotline để được tư vấn chính xác.
- Nếu khách hỏi điều gì ngoài phạm vi phòng khám thú y, lịch sự từ chối và mời quay lại chủ đề.
- Nếu khách muốn đặt lịch, hướng dẫn họ điền form đặt lịch trên trang hoặc gọi hotline.
- Không đưa ra chẩn đoán y khoa cho tình trạng cụ thể của thú cưng qua chat — luôn khuyên nên đưa đến khám trực tiếp nếu có dấu hiệu bất thường.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Chưa cấu hình ANTHROPIC_API_KEY trên server." });
    return;
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Thiếu messages." });
    return;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.text,
        })),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: "Lỗi gọi Claude API", detail: errText });
      return;
    }

    const data = await response.json();
    const reply = data?.content?.find((c) => c.type === "text")?.text || "";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server", detail: String(err) });
  }
}
