# 🇻🇳 Vietnam Holiday Countdown

Trang đếm ngược đến các ngày lễ của Việt Nam. Giao diện dark mode, responsive, hiệu ứng mượt mà — hoàn toàn bằng HTML/CSS/JS thuần, không dùng framework.

## Cấu trúc file

```
├── index.html       # Cấu trúc HTML trang
├── style.css        # Toàn bộ giao diện & animation
├── app.js           # Logic đếm ngược & render
└── holidays.json    # Danh sách ngày lễ (dễ chỉnh sửa)
```

---

## Logic hoạt động (app.js)

### 1. Khởi động (`init`)
- Tạo các particle nền bay lên
- Fetch `holidays.json`
- Tìm ngày lễ gần nhất → hiển thị lên Hero section
- Render toàn bộ grid cards
- Chạy `setInterval` mỗi 1 giây để cập nhật đồng hồ

### 2. Xác định ngày lễ gần nhất (`findHeroHoliday`)
- Duyệt qua tất cả ngày lễ
- Tính milliseconds còn lại đến lần xuất hiện tiếp theo
- Ngày lễ nào có giá trị nhỏ nhất (gần nhất) → hiển thị ở Hero
- Nếu hôm nay đúng là ngày lễ → ưu tiên hiển thị luôn

### 3. Tính thời gian còn lại (`getNextOccurrence`)
- Parse `DD-MM` từ JSON
- Tạo Date với năm hiện tại
- Nếu ngày đó đã qua trong năm nay → cộng thêm 1 năm
- Trả về Date của lần xuất hiện kế tiếp

### 4. Phân loại trạng thái ngày lễ
| Hàm | Mô tả |
|-----|-------|
| `isToday(ddmm)` | Kiểm tra có phải hôm nay không |
| `isPast(ddmm)` | Đã qua trong năm nay chưa |
| `getNextOccurrence(ddmm)` | Lần tới xảy ra khi nào |

### 5. Hiển thị Hero countdown (`updateHeroCountdown`)
- Tính `days / hours / mins / secs` từ ms còn lại
- Dùng `flipIfChanged` để animate số khi thay đổi (hiệu ứng flip)
- Cập nhật mỗi giây

### 6. Render Grid cards (`renderGrid`)
- Sắp xếp cards theo thứ tự: hôm nay → gần nhất → xa nhất → đã qua
- Mỗi card hiển thị mini countdown (ngày/giờ/phút/giây)
- Progress bar thể hiện % thời gian trong năm đã trôi qua đến ngày lễ
- Badge trạng thái: `Hôm nay!` / `Sắp tới` / `Đã qua`

### 7. Hiệu ứng Particles (`createParticles`)
- Tạo 40 hình tròn nhỏ ngẫu nhiên về màu, kích thước, tốc độ
- Dùng CSS animation `float-up` bay từ dưới lên trên vô hạn
- Mỗi particle có `animation-delay` khác nhau để không đồng bộ

---

## Định dạng holidays.json

```json
{
  "name": "Tên ngày lễ",
  "date": "DD-MM",
  "description": "Mô tả ngắn về ngày lễ",
  "icon": "🎉",
  "color": "#FF6B6B"
}
```

- `date`: định dạng `DD-MM` (ngày-tháng), không cần năm
- `color`: mã hex, dùng làm màu accent riêng cho từng ngày lễ

---

## Thêm/sửa ngày lễ

Chỉ cần chỉnh `holidays.json`, không cần sửa code. Ví dụ thêm ngày mới:

```json
{
  "name": "Ngày của Mẹ",
  "date": "12-05",
  "description": "Ngày tôn vinh những người mẹ trên toàn thế giới.",
  "icon": "👩‍👧",
  "color": "#FF69B4"
}
```

---

## Responsive

| Màn hình | Layout |
|----------|--------|
| Desktop (> 900px) | Grid 3-4 cột |
| Tablet (640–900px) | Grid 2 cột |
| Mobile (< 640px) | 1 cột, countdown boxes thu nhỏ |
