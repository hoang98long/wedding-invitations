# Một nền hoa màu be xuyên suốt trang cưới

Ảnh đang dùng: [beige-floral-continuous.webp](../public/media/backgrounds/beige-floral-continuous.webp).

Ảnh được tạo bằng công cụ imagegen tích hợp (chế độ generate, ảnh người dùng gửi làm tham chiếu màu sắc và phong cách), sau đó tối ưu WebP để dùng trong dự án. Một ảnh vuông duy nhất với nền giấy be ấm, hoa hồng ngà, mẫu đơn hồng phấn và lá xanh nhẹ; vùng giữa thoáng để đọc nội dung.

Nền được đặt một lần tại **app/page.tsx**, qua lớp **.page-backdrop** trong **app/globals.css**. Lớp nền cố định theo khung nhìn khi cuộn; các section và chân trang trong suốt nên không xuất hiện ranh giới giữa các ảnh nền riêng. Thẻ thông tin, biểu mẫu và QR dùng màu ngà gần như đục để dễ đọc. Trên điện thoại và máy tính, ảnh dùng cover và giữ đúng tỉ lệ; giao diện không cần JavaScript theo dõi thao tác cuộn.

Các ảnh nền cũ vẫn được lưu trong public/media/backgrounds/ nhưng không được giao diện tải hoặc sử dụng.

## Prompt đã dùng

Use case: stylized-concept. Asset type: one continuous romantic wedding-website wallpaper, a high-resolution SQUARE illustration suitable for both desktop and mobile cover cropping. Input image 1 is a STYLE AND COLOR reference only: match its warm pale beige handmade-paper background, creamy ivory roses, pale blush peonies, restrained dusty sage eucalyptus leaves, tiny champagne-gold sprigs and translucent champagne silk. Create an elegant airy watercolor composition inspired by the attached reference: a fuller bouquet sweeping inward from the lower left and a smaller bouquet from the upper right. Keep delicate flowers and leafy stems visible in the side-middle regions too, so portrait cropping still shows floral detail. Overall warm beige/ivory dominates, the green leaves are subtle accents only. Leave the central 55–60 percent spacious, pale warm beige with fine natural paper grain and very low contrast for dark web text. Flowers have delicate layered petals, natural botanical shapes, softly diffused light, refined romantic wedding stationery. This is one uninterrupted wallpaper used behind every section, not a UI mockup. No text, letters, logos, people, border lines, frames, rectangles, section divisions, harsh shadows or watermark. Do not use a sage-green background.
