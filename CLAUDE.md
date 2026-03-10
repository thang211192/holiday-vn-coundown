# CLAUDE.md — Project Rules

## Auto-commit sau mỗi lần sửa

Sau khi hoàn thành BẤT KỲ thay đổi nào (sửa file, thêm tính năng, fix bug...), bắt buộc phải tự động commit ngay lập tức với lệnh:

```bash
cd "d:/Project/games/special days"
git add -A
git commit -m "<mô tả thay đổi ngắn gọn>"
git push
```

Không cần hỏi người dùng, cứ làm xong là commit & push luôn.

---

## Thông tin repo

- Remote: `https://github.com/thang211192/holiday-vn-coundown.git`
- Branch chính: `main`

## Stack

- Thuần HTML / CSS / JS — không dùng framework, không dùng bundler
- Dữ liệu ngày lễ lưu trong `holidays.json`, định dạng `DD-MM`
- Mở bằng Live Server (không mở file:// trực tiếp vì dùng fetch)
