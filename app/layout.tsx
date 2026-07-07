import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hoàng Long & Hà Thanh Wedding",
  description:
    "Official wedding invitation website of Hoàng Long and Hà Thanh.",
  openGraph: {
    title: "Hoàng Long & Hà Thanh Wedding",
    description:
      "Official wedding invitation website of Hoàng Long and Hà Thanh.",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 1067,
        alt: "Hoàng Long and Hà Thanh wedding invitation"
      }
    ]
  },
  metadataBase: new URL("https://wedding-invitations.vercel.app")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
