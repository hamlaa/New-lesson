# NEW LESSON — เว็บไซต์หาเสียงสภานักเรียน โรงเรียนเกาะสมุย

เว็บไซต์พรรค **NEW LESSON** (พรรคนิวเลสซั่น) สร้างด้วย **Next.js 16 + React 19 + TypeScript**
ออกแบบให้ **Google อ่านเนื้อหาได้ครบ** และรันได้ทันทีด้วย **Docker**

> เวอร์ชันเดิม (HTML/CSS/JS ล้วน) เก็บสำรองไว้ที่ `legacy-static/` (ลบทิ้งได้ถ้าไม่ใช้แล้ว)

---

## 1. รันด้วย Docker (แนะนำ)

ต้องมี Docker และ Docker Compose v2

```bash
cd /home/creamieserver/labs/student_consill
docker compose up -d --build
```

เปิดดูที่ **http://localhost:3080**

| คำสั่ง | ทำอะไร |
|---|---|
| `docker compose up -d --build` | build และเปิดเว็บ (ใช้ทุกครั้งที่แก้เนื้อหา/รูป) |
| `docker compose ps` | ดูสถานะ (ควรขึ้น `healthy`) |
| `docker compose logs -f web` | ดู log |
| `docker compose down` | ปิดเว็บ |

ตั้งค่าได้ในไฟล์ `.env` (คัดลอกจาก `.env.example`):

```bash
cp .env.example .env
nano .env
```

| ตัวแปร | ความหมาย |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | **ที่อยู่เว็บจริง** เช่น `https://newlesson-kosamui.com` (สำคัญมากต่อ SEO) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | รหัสยืนยันจาก Google Search Console |
| `NEXT_PUBLIC_NOINDEX` | `true` = ห้าม Google เก็บ (ใช้กับเครื่องทดสอบ) |
| `APP_PORT` | พอร์ตบนเครื่อง (ค่าเริ่มต้น 3080 เพราะ 3000 มีโปรแกรมอื่นใช้อยู่) |
| `DOMAIN` | โดเมน สำหรับโหมด HTTPS อัตโนมัติ |

> ⚠️ ค่า `NEXT_PUBLIC_*` ถูกฝังตอน build → แก้แล้วต้องรัน `docker compose up -d --build` ใหม่

### เปิดใช้ HTTPS อัตโนมัติ (สำหรับขึ้นเว็บจริง)

มี Caddy (reverse proxy) ที่ขอใบรับรอง SSL ฟรีจาก Let's Encrypt ให้เอง:

1. ตั้ง DNS ของโดเมน (A record) ให้ชี้มาที่ IP ของเซิร์ฟเวอร์ และเปิดพอร์ต 80/443
2. ใน `.env` ตั้ง `DOMAIN=โดเมนของคุณ` และ `NEXT_PUBLIC_SITE_URL=https://โดเมนของคุณ`
3. รัน:
   ```bash
   docker compose --profile https up -d --build
   ```

---

## 2. รันแบบพัฒนา (ไม่ใช้ Docker)

ต้องมี Node.js 20.9 ขึ้นไป

```bash
npm install
npm run dev        # http://localhost:3000 — แก้ไฟล์แล้วเห็นผลทันที
npm run build      # build production
npm run start      # รัน production
```

---

## 3. แก้เนื้อหา → `src/data/party.ts`

**ข้อความทั้งหมดอยู่ในไฟล์เดียว:** ชื่อพรรค สโลแกน สมาชิก นโยบาย ลิงก์โซเชียล สีธีม และข้อความ SEO

- **เพิ่มสมาชิก:** คัดลอกบล็อก `{ ... }` ใน `members` วางต่อท้าย แล้วแก้ค่า
  ระบบจะสร้างส่วนเต็มจอบนหน้าแรก หน้าโปรไฟล์ `/members/<slug>` sitemap และรูปแชร์ให้อัตโนมัติ
- **`slug`** = ที่อยู่หน้าโปรไฟล์ ใช้ a-z, 0-9 และ `-` เท่านั้น เช่น `thanakorn-wongsawat`
- **คำเอียงสวย ๆ ในหัวข้อ:** ครอบด้วย `*ดอกจัน*` เช่น `"A NEW LESSON *BEGINS.*"`
- **ลิงก์โซเชียล:** เปลี่ยน `"#"` เป็นลิงก์จริง ระบบจะส่งให้ Google เป็น `sameAs` ด้วย
  ช่วยให้ Google รู้ว่าเพจ IG/Facebook กับเว็บนี้เป็นพรรคเดียวกัน
- **ข้อความใน Google:** แก้ที่ `seo.title`, `seo.description`, `seo.keywords`
- **คำปฏิญญาสภา (ตัวหนังสือใหญ่เลื่อนเข้า):** แก้ที่ `pledge.lines` — ใส่ `*ดอกจัน*` ให้คำเป็นตัวเอียงสีฟ้า
- **นับถอยหลังวันเลือกตั้ง:** ใช้วันที่จาก `electionDateISO` (เวลา 08:00 น.) · ข้อความแก้ที่ `closing.countdownLabel` / `countdownDone`

แก้เสร็จ → `docker compose up -d --build`

## 4. เปลี่ยนรูป → `public/images/`

| ไฟล์ | ใช้ที่ | ขนาดแนะนำ |
|---|---|---|
| `member-01.jpg` … | รูปสมาชิก | 1000 × 1250 px (แนวตั้ง 4:5) |
| `hero-background.jpg` | ท้องฟ้าหน้าแรก | 2400 × 1500 px |
| `hero-island.png` | เกาะ/ทะเล (PNG โปร่งใส) | 2400 × 900 px |
| `cloud-01.png`, `cloud-02.png` | เมฆลอย (PNG โปร่งใส) | 1200 × 480 px |
| `new-lesson-logo.png` | โลโก้พรรค | 512 × 512 px |

ง่ายสุด: **ตั้งชื่อไฟล์ใหม่ให้เหมือนเดิมแล้ววางทับ** ไม่ต้องแก้โค้ด
Next.js จะย่อรูปและแปลงเป็น AVIF/WebP ให้อัตโนมัติ (รูป 52 KB → ~7 KB บนมือถือ)
ถ้ารูปหาย จะแสดงกรอบ "Photo coming soon" พร้อมอักษรย่อชื่อแทน

ไอคอนแท็บเบราว์เซอร์: `src/app/icon.png` · ไอคอน iPhone: `src/app/apple-icon.png`

---

## 5. สิ่งที่ทำไว้เพื่อ SEO

| ฟีเจอร์ | ไฟล์ | ประโยชน์ |
|---|---|---|
| **Server-side render ทุกหน้า** (Static) | ทั้งโปรเจกต์ | Google เห็นชื่อสมาชิก นโยบาย ทุกตัวอักษรใน HTML โดยไม่ต้องรัน JavaScript |
| `robots.txt` | `src/app/robots.ts` | อนุญาตให้ Google เก็บทุกหน้า + บอกที่อยู่ sitemap |
| `sitemap.xml` + image sitemap | `src/app/sitemap.ts` | รายการทุกหน้าและทุกรูป อัปเดตทุกครั้งที่ build |
| หน้าโปรไฟล์ผู้สมัครแยกรายคน | `src/app/members/[slug]/` | ค้นชื่อผู้สมัคร (ไทย/อังกฤษ) แล้วเจอหน้าของคนนั้นโดยตรง |
| Title / description ภาษาไทย+อังกฤษ | `src/data/party.ts` → `seo` | ตรงกับคำที่คนไทยค้นหา เช่น "สภานักเรียน โรงเรียนเกาะสมุย" |
| Canonical URL | ทุกหน้า | กันเนื้อหาซ้ำ |
| Structured data (JSON-LD) | `src/lib/jsonld.ts` | บอก Google ว่าเป็น Organization / HighSchool / Person / Event / Breadcrumb |
| รูปแชร์ Open Graph อัตโนมัติ | `opengraph-image.tsx` | แชร์ลิงก์ใน LINE / Facebook แล้วมีรูปสวย (แยกรายผู้สมัคร) |
| Web manifest + icons | `src/app/manifest.ts` | "เพิ่มลงหน้าจอหลัก" บนมือถือ |
| Core Web Vitals | — | ฟอนต์ self-host + preload, รูป AVIF/WebP, lazy-load, ไม่มี library หนัก |
| Google Search Console | `.env` | ยืนยันเจ้าของเว็บผ่าน meta tag |
| หน้า 404 แบบ `noindex` | `src/app/not-found.tsx` | ไม่ให้หน้าเสียถูกเก็บ |

ทดสอบ: `http://localhost:3080/robots.txt`, `/sitemap.xml`, `/opengraph-image`

---

## 6. ขั้นตอนให้ติด Google ✅

โค้ดทำส่วนเทคนิคไว้ครบแล้ว แต่ **Google จะเจอเว็บได้ก็ต่อเมื่อเว็บออนไลน์จริงและมีคนบอก Google**:

1. **มีโดเมนและ HTTPS**: ขึ้นเซิร์ฟเวอร์จริงตามข้อ 1 (โหมด `--profile https`)
   หรือใช้บริการฟรีอย่าง Vercel
2. **ตั้ง `NEXT_PUBLIC_SITE_URL`** เป็นโดเมนจริงแล้ว build ใหม่
   ถ้าค่านี้ยังเป็น `localhost` อยู่ sitemap กับ canonical จะผิด
3. **Google Search Console** (https://search.google.com/search-console)
   - เพิ่มพร็อพเพอร์ตี → เลือก "URL prefix" → ใส่ `https://โดเมนของคุณ`
   - เลือกยืนยันแบบ **HTML tag** → คัดลอกค่าใน `content="..."` ไปใส่
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → build ใหม่ → กด Verify
   - เมนู **Sitemaps** → ส่ง `sitemap.xml`
   - เมนู **URL Inspection** → ใส่ URL หน้าแรก → **Request indexing**
4. **ทำให้มีลิงก์เข้ามาที่เว็บ** (สำคัญมาก):
   - ใส่ลิงก์เว็บใน bio IG / TikTok / เพจ Facebook ของพรรค
   - ขอให้เพจโรงเรียนหรือสภานักเรียนแชร์ลิงก์
   - แชร์ในกลุ่ม LINE / OpenChat ของโรงเรียน
5. **ใส่ลิงก์โซเชียลจริง** ใน `socials` ของ `src/data/party.ts`

ปกติ Google เริ่มเก็บหน้าภายในไม่กี่วันถึง 2 สัปดาห์
คำค้นที่มีโอกาสติดอันดับต้นสูงคือชื่อเฉพาะ เช่น "NEW LESSON โรงเรียนเกาะสมุย",
"พรรคนิวเลสซั่น" หรือชื่อผู้สมัคร คำกว้าง ๆ อย่าง "สภานักเรียน" มีคู่แข่งทั้งประเทศ
(ไม่มีเว็บไหนรับประกันอันดับ Google ได้)

---

## 7. โครงสร้างโปรเจกต์

```
student_consill/
├── Dockerfile              ← multi-stage build (Next.js standalone, ผู้ใช้ non-root, healthcheck)
├── docker-compose.yml      ← web (+ caddy HTTPS แบบเลือกเปิด)
├── Caddyfile               ← ตั้งค่า HTTPS อัตโนมัติ
├── .env.example            ← ตัวอย่างค่าตั้ง
├── next.config.ts          ← standalone output, รูป AVIF/WebP, security headers
├── public/images/          ← รูปทั้งหมด
├── src/
│   ├── data/party.ts       ← ★ เนื้อหาทั้งหมด (แก้ที่นี่) ★
│   ├── app/
│   │   ├── layout.tsx      ← metadata หลัก, ฟอนต์, ธีมสี
│   │   ├── page.tsx        ← หน้าแรก
│   │   ├── members/[slug]/ ← หน้าโปรไฟล์ผู้สมัคร + รูปแชร์
│   │   ├── robots.ts · sitemap.ts · manifest.ts · opengraph-image.tsx · not-found.tsx
│   ├── components/         ← Hero, Intro, MemberSection, PolicyGrid, MotionEngine (parallax) ...
│   ├── lib/                ← site URL, JSON-LD, metadata, OG helpers
│   ├── styles/             ← style.css, responsive.css, pages.css
│   └── fonts/              ← ฟอนต์ self-host
└── legacy-static/          ← เวอร์ชัน HTML เดิม (สำรอง)
```

**เปลี่ยนสี:** `theme` ใน `src/data/party.ts`
**เปลี่ยนเลย์เอาต์สมาชิก:** ใส่ `layout: "a" | "b" | "c" | "d"`
**ผู้ใช้ที่ตั้งค่า "ลดการเคลื่อนไหว"** ในเครื่อง จะไม่เห็น animation ใด ๆ (accessibility)

---

## 8. แก้ปัญหา

| อาการ | วิธีแก้ |
|---|---|
| `port is already allocated` | เปลี่ยน `APP_PORT` ใน `.env` เป็นพอร์ตว่าง |
| แก้เนื้อหาแล้วเว็บไม่เปลี่ยน | ต้องรัน `docker compose up -d --build` (มี `--build`) |
| sitemap ยังเป็น localhost | ตั้ง `NEXT_PUBLIC_SITE_URL` แล้ว build ใหม่ |
| Build error หลังแก้ `party.ts` | มักลืม `,` หรือ `"` — ข้อความ error จะบอกบรรทัด |

## แอนิเมชัน (GSAP + Lenis)

| ส่วน | เอฟเฟกต์ |
|---|---|
| เปิดเว็บ | หน้าโหลด: โลโก้หมุนเข้า ตัวนับ 000→100 แล้วม่านเปิดสองชั้น (ครั้งต่อไปใน session จะสั้นลง) |
| ทั้งเว็บ | เลื่อนนุ่มแบบมีแรงเฉื่อย (Lenis) · เคอร์เซอร์วงกลม · ปุ่มดูดตามเมาส์ · การ์ดเอียง 3D · หัวข้อพลิกขึ้นทีละคำ · ข้อความเล็กแบบถอดรหัส |
| Hero | ตัวอักษร NEW LESSON พลิกขึ้น · เลื่อนแล้ว "บินทะลุฟ้า" (ตรึงจอ, ซูม, เมฆแยก, เบลอ, แฟลชขาว) |
| บทนำ | เสาหลัก 3 ใบพลิก 3D · แถบสโลแกนเร็ว/กลับทิศตามความเร็วการเลื่อน |
| คำปฏิญญา | ตรึงจอ ตัวหนังสือยักษ์เลื่อนเข้าซ้าย-ขวาและเติมสี |
| ทีม | แถบการ์ดผู้สมัครเลื่อนแนวนอน (ตรึงจอ) · รูปขยับ parallax · การ์ดเอียงตามความเร็ว |
| สมาชิก | ชื่อพลิกทีละตัวอักษร · ตัวเลขใหญ่ซูม · (จอคอม) ส่วนถัดไปเลื่อนทับเหมือนกองการ์ด |
| นโยบาย | การ์ดพลิกขึ้น 3D ทีละชุด |
| ปิดท้าย | หัวข้อซูมออก · เมฆแยก · พระอาทิตย์/รัศมีขึ้น · นับถอยหลัง · กดปุ่มโหวตมีพลุกระดาษ |
| เปลี่ยนหน้า | ม่านสองชั้นพร้อมโลโก้ ระหว่างหน้าแรก ⇄ หน้าโปรไฟล์ |

ถ้าเครื่องตั้งค่า "ลดการเคลื่อนไหว" (prefers-reduced-motion) ทุกอย่างจะปิดและแสดงเป็นหน้านิ่ง
เนื้อหาทั้งหมดยังอยู่ใน HTML ตั้งแต่แรก (Google อ่านได้ครบ) — แอนิเมชันเป็นแค่ชั้นบน
โค้ดอยู่ที่ `src/components/motion/` (ตัวหลัก: `Cinematics.tsx`) และสไตล์ที่ `src/styles/motion.css`
