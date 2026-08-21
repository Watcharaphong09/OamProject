# OAM Activity Registration System (ระบบลงทะเบียนกิจกรรม)

ระบบลงทะเบียนกิจกรรมออนไลน์ที่ถูกพัฒนาขึ้นเพื่อช่วยให้การจัดงานและการจัดการผู้เข้าร่วมกิจกรรมเป็นเรื่องง่าย รวดเร็ว และเป็นระบบมากยิ่งขึ้น มาพร้อมกับการสร้าง QR Code อัตโนมัติสำหรับผู้ที่ลงทะเบียนสำเร็จ และหน้า Admin Dashboard สำหรับจัดการข้อมูล

## 🌟 ฟีเจอร์หลัก (Features)

- **User Registration Flow**: ผู้ใช้สามารถเลือกกิจกรรมที่เปิดรับและกรอกแบบฟอร์มลงทะเบียนได้อย่างรวดเร็ว
- **QR Code Generation**: สร้าง QR Code อัตโนมัติเมื่อลงทะเบียนสำเร็จ เพื่อใช้เป็น E-Ticket สำหรับการ Check-in
- **Admin Dashboard**: หน้าจัดการระบบสำหรับแอดมิน เพื่อดูสถิติ (ผ่าน Recharts) จัดการกิจกรรม และดูรายชื่อผู้ลงทะเบียน
- **Responsive Design**: รองรับการใช้งานทั้งบนโทรศัพท์มือถือ แท็บเล็ต และคอมพิวเตอร์ ด้วย UI ที่ทันสมัยแบบ Glassmorphism

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: SQLite (Local) / Neon Database (Production)
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **QR Code**: qrcode.react

## 🚀 การติดตั้งและใช้งาน (Getting Started)

1. **Clone project และติดตั้ง Dependencies**
   ```bash
   npm install
   # หรือ
   yarn install
   # หรือ
   pnpm install
   ```

2. **ตั้งค่า Environment Variables**
   สร้างไฟล์ `.env.local` ที่ root directory และเพิ่มค่าต่างๆ ตามที่จำเป็น (อ้างอิงจาก Database ที่ใช้งาน)

3. **รันคำสั่ง Migration สำหรับ Database (ถ้ามี)**
   ```bash
   npx drizzle-kit push
   ```

4. **เริ่มการทำงานของ Development Server**
   ```bash
   npm run dev
   # หรือ
   yarn dev
   ```

5. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 💡 โครงสร้างโปรเจกต์ (Project Structure)

- `app/page.tsx`: หน้าแรกสำหรับเลือกกิจกรรม
- `app/register/page.tsx`: หน้าฟอร์มลงทะเบียนและแสดงผล QR Code
- `app/admin/*`: ส่วนจัดการหลังบ้านสำหรับผู้ดูแลระบบ
- `components/*`: UI Components ที่ถูกแยกไว้เพื่อนำมาใช้ซ้ำ (เช่น RegistrationForm, SuccessCard)
- `lib/*`: ไฟล์สำหรับการเชื่อมต่อ Database และ Utility functions
