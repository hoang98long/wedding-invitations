# Một nền sage xuyên suốt trang cưới

Ảnh đang dùng: [sage-continuous.webp](../public/media/backgrounds/sage-continuous.webp).

Ảnh được tạo bằng công cụ imagegen tích hợp, sau đó chuyển sang WebP để dùng trong dự án. Đây là một ảnh vuông duy nhất với nền giấy sage và hoa lá nhẹ hai bên, vùng giữa thoáng cho chữ và ảnh cưới.

Nền được đặt một lần tại **app/page.tsx**, qua lớp **.page-backdrop** trong **app/globals.css**. Lớp nền cố định theo khung nhìn khi cuộn; các section và chân trang trong suốt nên không xuất hiện ranh giới giữa các ảnh nền riêng. Thẻ thông tin, biểu mẫu và QR dùng màu ngà gần như đục để dễ đọc. Trên điện thoại và máy tính, ảnh dùng cover và giữ đúng tỉ lệ; giao diện không cần JavaScript theo dõi thao tác cuộn.

Các ảnh nền cũ vẫn được lưu trong public/media/backgrounds/ nhưng không được giao diện tải hoặc sử dụng.

## Prompt đã dùng

Use case: stylized-concept. Asset type: a SINGLE continuous sage-green botanical wallpaper used as one fixed background behind an entire romantic Vietnamese wedding invitation website, never as separate section banners. Create ONE SQUARE high-resolution artwork. Soft authentic sage green (#dfe8d7) is the dominant color everywhere, with an even, softly mottled watercolor handmade-paper surface. Airy asymmetrical eucalyptus, slender olive stems and a few delicate ivory jasmine blossoms / ivory garden roses drift naturally along both side areas, with some restrained foliage extending towards the outer thirds so gentle botanical details remain visible when the square is cropped to portrait or landscape. Place botanical details around the middle portions of the sides as well as near corners so cropping will not erase all of them. Keep the middle 50–60% spacious, pale sage, low contrast, visually calm enough behind dark headings and invitation cards. Fine-art romantic watercolor, premium artisan wedding stationery, softly diffused daylight, subdued dusty greens and ivory only. Unified continuous color, not an ivory canvas, no abrupt color bands, no rectangles, no framing lines, no panels or grids, no text, no letters, no logos, no people, no watermark. The single wallpaper must feel elegant and visually connected during scrolling.
