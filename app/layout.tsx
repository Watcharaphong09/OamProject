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
    <html lang="th" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="antialiased bg-[#060d1a] text-slate-200">{children}</body>
    </html>
  );
}
