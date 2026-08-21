import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Registration System",
  description: "ระบบลงทะเบียนนักเรียนผ่าน QR Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}
