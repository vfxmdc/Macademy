import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M Décoration — إم ديكور | متجر الديكور والمنتجات المضيئة في الجزائر",
  description: "M Décoration متجر جزائري متخصص في الديكور، المنتجات المضيئة، ومنتجات LED مع توصيل عبر 58 ولاية جزائرية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#0D1117] text-[#E6EDF3]">{children}</body>
    </html>
  );
}
