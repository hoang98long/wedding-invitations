import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";

const title = "Thiệp cưới Hoàng Long & Hà Thanh | 28, 29-11-2026";
const description = "Trân trọng kính mời bạn đến chung vui cùng Hoàng Long và Hà Thanh, ngày 28 & 29 tháng 11 năm 2026 tại Hải Phòng.";

export const metadata: Metadata = {
  title,
  description,
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
  openGraph: {
    title,
    description,
    type: "website",
    locale: "vi_VN",
    ...(process.env.NEXT_PUBLIC_SITE_URL ? { images: [{ url: "/media/images/LMC_0129.webp", width: 1332, height: 2000, alt: "Thiệp cưới Hoàng Long và Hà Thanh" }] } : {})
  },
  formatDetection: { telephone: false, email: false, address: false, date: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
