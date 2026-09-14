# Landing Page – 2Vet An Khánh

Dự án Vue 3 + Tailwind CSS, build ra file tĩnh (HTML/CSS/JS), deploy được ở bất kỳ hosting nào (Vercel, Netlify, hoặc upload thẳng lên Hostinger).

## 1. Chạy thử trên máy

```bash
npm install
npm run dev
```

Mở link hiện ra trong terminal (thường là `http://localhost:5173`).

## 2. Build bản chính thức

```bash
npm run build
```

Kết quả nằm trong thư mục `dist/` — đây chính là bộ file tĩnh để deploy.

## 3. Deploy

### Cách A – Vercel/Netlify (khuyến nghị, tự động deploy mỗi khi đổi code)
1. Đẩy project này lên 1 repo GitHub riêng.
2. Vào vercel.com hoặc netlify.com → "Import" repo đó → chọn build command `npm run build`, output directory `dist`.
3. Sau khi deploy xong, vào phần **Domains** của Vercel/Netlify, thêm domain đã mua ở Hostinger, làm theo hướng dẫn đổi bản ghi DNS (thường là 1 bản ghi CNAME hoặc A) trong hPanel Hostinger.

### Cách B – Upload thủ công lên Hostinger
1. Chạy `npm run build` để có thư mục `dist/`.
2. Nén toàn bộ **nội dung bên trong** `dist/` thành file .zip.
3. Vào hPanel Hostinger → File Manager → vào thư mục `public_html` của domain.
4. Upload + giải nén file .zip vào đó (đảm bảo file `index.html` nằm ngay trong `public_html`, không nằm trong 1 thư mục con).

## 4. Thay ảnh thật

Mọi vị trí ảnh hiện đang là **ô placeholder màu be/nâu nhạt, viền đứt nét**, có ghi rõ cần ảnh gì. Cách thay:

1. Đặt file ảnh vào thư mục `public/images/` (tự tạo thư mục này).
2. Vào đúng component chứa ảnh đó (xem trong `src/components/`), tìm thẻ `<PlaceholderImg ... />`, đổi thành:
   ```html
   <img src="/images/ten-file.jpg" alt="Mô tả ảnh" class="[giữ nguyên phần class/aspect đang có]" />
   ```
3. Nên dùng ảnh định dạng WebP hoặc JPG nén dưới 300KB để trang tải nhanh (đã ghi trong kế hoạch SEO).

Danh sách đầy đủ ảnh cần chuẩn bị: xem file kế hoạch `KeHoach_LandingPage_2Vet.docx` mục 3.

## 5. Gắn Pixel / Analytics (khi có ID thật)

Mở file `index.html`, tìm khối comment `TODO – GẮN CÔNG CỤ ĐO LƯỜNG`, dán:
- Snippet chuẩn của Facebook Pixel (lấy trong Trình quản lý sự kiện Meta).
- Script Umami Analytics (sau khi tự host hoặc đăng ký Umami Cloud), dạng:
  ```html
  <script defer src="https://YOUR-UMAMI-HOST/script.js" data-website-id="YOUR-ID"></script>
  ```
- Thẻ xác minh Google Search Console khi đăng ký sở hữu website.

## 6. Nối form đặt lịch vào nơi nhận lead thật

Mở `src/components/BookingFormSection.vue`, tìm khối comment `TODO – NỐI VÀO NƠI NHẬN LEAD THẬT`. Hiện tại form chỉ log dữ liệu ra console (để test). Cách nối phổ biến nhất, dễ làm:
1. Tạo 1 Google Sheet trống.
2. Vào Google Sheet → Extensions → Apps Script, dán đoạn code nhận POST request và ghi vào sheet (có thể nhờ Claude viết đoạn Apps Script này khi cần).
3. Deploy Apps Script thành Web App, lấy URL.
4. Dán URL đó vào chỗ TODO trong `BookingFormSection.vue`.

## 7. Ưu đãi tự động hiển thị theo ngày (không cần sửa code mỗi đợt sale)

Mở `src/data/promos.js` — đây là nơi khai báo TẤT CẢ chương trình khuyến mãi trong tháng, mỗi chương trình có ngày bắt đầu/kết thúc riêng. Trang sẽ **tự động chọn đúng chương trình** để hiển thị dựa theo ngày hiện tại, không cần deploy lại đúng ngày chương trình bắt đầu:

- Nếu hôm nay rơi vào khoảng ngày của 1 chương trình → hiển thị chương trình đó, nhãn "Đang diễn ra".
- Nếu đang ở khoảng trống giữa 2 chương trình → tự hiển thị chương trình **gần nhất sắp tới**, nhãn "Sắp diễn ra".
- Nếu đã hết tất cả chương trình đã khai báo → hiển thị nội dung mặc định (`fallbackPromo` trong cùng file).

**Cách thêm chương trình mới cho tháng sau**: mở `src/data/promos.js`, copy 1 object trong mảng `promos`, đổi `id`, `start`, `end` (định dạng `YYYY-MM-DD`) và nội dung — xong, không cần sửa gì trong `PromoSection.vue`.

Sẵn có trong file: 4 chương trình đã khai báo theo đúng kế hoạch tháng 9 (Quốc khánh 01–03/09, Grooming 10–14/09, Trung Thu 20–27/09, Chốt sổ 28–30/09).

### Pop-up ưu đãi khi vào trang

Ngoài section "Ưu đãi" nằm trong trang, còn có **pop-up tự bật lên khoảng 1,2 giây sau khi khách vào trang** (component `src/components/PromoPopup.vue`), dùng chung dữ liệu từ `promos.js` nên không cần khai báo nội dung riêng — sửa 1 chỗ, cả section lẫn pop-up đều tự cập nhật theo.

Hành vi pop-up:
- Chỉ bật khi đang có chương trình **đang chạy** hoặc **sắp diễn ra**; nếu hiện tại không có chương trình nào (rơi vào `fallbackPromo`) thì pop-up sẽ không hiện, tránh làm phiền khách vô cớ.
- Hiện lên **mỗi lần khách vào hoặc tải lại trang** (không ghi nhớ đã đóng trước đó), sau khoảng 1,2 giây để không giật cục ngay khi vừa vào.
- **Tự động biến mất sau 8 giây** nếu khách không thao tác gì; khách cũng có thể bấm đóng tay bất cứ lúc nào (nút X hoặc "Để sau"). Đổi hằng số `AUTO_HIDE_MS` trong `PromoPopup.vue` nếu muốn thời gian hiển thị khác (đang để 8000ms, trong khoảng 5-10s).
- Nút CTA chính đưa khách thẳng tới form đặt lịch và tự đóng pop-up.

## 8. Hiệu ứng khi cuộn trang (scroll reveal)

Các khối nội dung mờ dần + trượt lên khi cuộn tới, dùng directive `v-reveal` (định nghĩa ở `src/directives/reveal.js`, đăng ký trong `main.js`). Cách dùng khi thêm section mới:

```html
<div v-reveal>Nội dung xuất hiện khi cuộn tới</div>
<div v-reveal="{ delay: 150 }">Xuất hiện trễ hơn 150ms để tạo hiệu ứng so le</div>
```

Hiệu ứng tự tắt (hiện ngay, không animate) nếu người dùng bật chế độ "giảm chuyển động" (reduce motion) trong hệ điều hành — đã xử lý sẵn, không cần làm gì thêm.

## 8. Những phần còn thiếu / cần điền tay

Toàn bộ text có dạng `[Trong ngoặc vuông]` là placeholder cần điền số liệu/thông tin thật:
- `[SĐT hotline]`, `[Số nhà, tên đường]`, `[tên-trang-facebook]`, `[oa-id]` Zalo
- Tên bác sĩ, bảng giá cụ thể, chính sách cấp cứu, hình thức thanh toán trong phần FAQ

## 9. Font chữ

Dùng Literata (variable font, có trục "optical size" giúp chữ to hiển thị có hồn hơn, chữ nhỏ vẫn rõ ràng) cho tiêu đề, kết hợp Inter cho phần nội dung. Kicker (nhãn nhỏ phía trên tiêu đề mỗi section) và số liệu thống kê dùng kiểu in nghiêng của Literata để tạo điểm nhấn khác biệt, tránh cảm giác đơn điệu.

## 11. Chatbot hỏi-đáp (đã nối AI thật qua Claude API)

Nút chat nổi (góc phải dưới) mở ra khung chat. Chat hoạt động theo 2 lớp:

1. **AI thật (Claude API)** — ưu tiên dùng nếu đã cấu hình, hiểu ngôn ngữ tự nhiên, trả lời linh hoạt hơn nhiều so với dò từ khoá.
2. **Dự phòng dò từ khoá** (`src/data/chatbotIntents.js`) — tự động dùng khi chưa deploy backend hoặc chưa cấu hình API key, để chat vẫn hoạt động được ngay cả khi mở file preview tĩnh.

### Cách bật AI thật (bắt buộc phải deploy lên Vercel, không chạy được khi chỉ mở file .html)

1. Tạo API key tại [console.anthropic.com](https://console.anthropic.com) (mục API Keys).
2. Đẩy code lên GitHub, import vào Vercel như hướng dẫn ở mục 4.
3. Vào **Project Settings → Environment Variables** trên Vercel, thêm biến `ANTHROPIC_API_KEY` = key vừa tạo.
4. Deploy lại (Vercel tự deploy lại khi đổi biến môi trường, hoặc bấm Redeploy).
5. Xong — chatbot trên domain thật sẽ tự động dùng AI thật, không cần sửa code gì thêm.

**Lưu ý khi test cục bộ**: `npm run dev` (Vite thường) KHÔNG chạy được thư mục `/api` (đây là serverless function riêng của Vercel). Muốn test AI thật trên máy, cài Vercel CLI (`npm i -g vercel`) rồi chạy `vercel dev` thay vì `npm run dev`.

**Nếu chọn deploy lên Hostinger (upload file tĩnh) thay vì Vercel**: phần AI thật sẽ KHÔNG hoạt động vì Hostinger dạng hosting tĩnh không chạy được code backend — chat sẽ tự động dùng bộ dò từ khoá dự phòng, vẫn trả lời được các câu hỏi thường gặp nhưng không linh hoạt bằng AI thật.

Prompt hệ thống (system prompt) định nghĩa cách bot trả lời nằm trong `api/chat.js` — có thể chỉnh sửa giọng văn, phạm vi trả lời, hoặc bổ sung thông tin tại đây.

### Chỉnh bộ dò từ khoá dự phòng

Mở `src/data/chatbotIntents.js`, copy 1 object trong mảng `intents`, đổi `keywords` (liệt kê nhiều biến thể người dùng có thể gõ) và `reply`.

## 12. Trang Admin Dashboard (theo dõi lượt truy cập)

Trang `/admin` (VD: `https://2vetankhanh.vn/admin`) đã code xong đầy đủ: màn hình nhập mật khẩu + dashboard hiển thị "Đang online", "Hôm nay", "7 ngày", "30 ngày". Không link công khai trang này ở đâu trên site, và đã chặn Google index qua `robots.txt`.

**Trang chỉ hoạt động sau khi deploy lên Vercel** (không chạy khi mở file .html tĩnh, vì cần 2 serverless function trong thư mục `/api`: `admin-login.js` kiểm tra mật khẩu, `analytics.js` lấy số liệu).

### Bước 1 — Đặt mật khẩu trang admin
Trên Vercel → Project Settings → Environment Variables, thêm:
- `ADMIN_PASSWORD` = mật khẩu tự chọn (chỉ Nam/chị biết)

### Bước 2 — Đăng ký Umami Analytics (miễn phí, không cần thẻ)
1. Vào [umami.is](https://umami.is) → đăng ký tài khoản (Umami Cloud, bản miễn phí đủ dùng cho quy mô 1 phòng khám).
2. Tạo 1 website mới trong Umami, đặt tên "2Vet An Khánh", khai domain thật.
3. Umami cho 1 đoạn script theo dõi (dạng `<script defer src="..." data-website-id="...">`) — copy `data-website-id`.
4. Vào phần Settings → API Keys trong Umami, tạo 1 API key.

### Bước 3 — Gắn vào project
1. Tạo file `.env` ở thư mục gốc project (copy từ `.env.example` nếu có, hoặc tạo mới), thêm dòng:
   ```
   VITE_UMAMI_WEBSITE_ID=<website id lấy ở bước 2>
   ```
2. Trên Vercel → Environment Variables, thêm thêm 2 biến:
   - `UMAMI_WEBSITE_ID` = website id (giống ở trên)
   - `UMAMI_API_KEY` = API key vừa tạo
   - (Tuỳ chọn) `UMAMI_API_URL` — chỉ cần nếu tự host Umami thay vì dùng Umami Cloud, mặc định để trống là được.
3. Deploy lại project trên Vercel.

### Bước 4 — Dùng
Vào `https://<domain-của-bạn>/admin`, nhập mật khẩu đã đặt ở Bước 1 → thấy ngay số liệu thật.

Nếu chưa làm Bước 2-3, trang `/admin` vẫn vào được (sau khi nhập đúng mật khẩu) nhưng sẽ hiển thị màn hướng dẫn cấu hình thay vì số liệu — không báo lỗi khó hiểu.

**Về mức độ bảo mật**: đây là lớp bảo vệ đơn giản bằng 1 mật khẩu dùng chung, không có tài khoản riêng từng người, không giới hạn số lần thử sai — phù hợp cho nhu cầu nội bộ nhỏ, không phải chuẩn bảo mật doanh nghiệp. Không chia sẻ đường link `/admin` hay mật khẩu ra ngoài.
