# Product Specification: Craniora Academy
## Frontend

---

## 1. Product Overview

**Product Name:** Craniora Academy  
**Tagline:** Precision in Medical Education  
**Description:**

Craniora Academy adalah platform manajemen kelas berbasis web yang dirancang khusus untuk mahasiswa Fakultas Kedokteran Universitas Negeri Padang (FK UNP) Angkatan 2025. Platform ini mengintegrasikan jadwal kuliah, bank soal ujian, flashcards, berbagi materi (CraniShare), manajemen keuangan kas kelas, dan berbagai tools produktivitas dalam satu ekosistem terpadu. Dibangun dengan Next.js 16 dan Supabase, Craniora Academy menyediakan pengalaman mobile-first yang responsif dengan dukungan PWA untuk instalasi di perangkat Android.

---

## 2. Goals & Objectives

- Menyediakan platform terpusat untuk seluruh kebutuhan akademik mahasiswa FK UNP 2025.
- Memudahkan manajemen jadwal kuliah dengan kategorisasi (KP, KK, Tutorial, Praktikum, MKU, Pleno) dan materi dosen.
- Mendorong kolaborasi antar mahasiswa melalui fitur berbagi materi (CraniShare) dengan sistem leaderboard kontributor.
- Menyediakan alat latihan ujian (bank soal) dan metode belajar aktif (flashcards) yang dapat diakses kapan saja.
- Meningkatkan produktivitas belajar melalui tools seperti Pomodoro Timer dan Draw Straw.
- Menyediakan transparansi keuangan kelas melalui fitur Uang Kas.
- Mendukung akses multi-platform melalui PWA yang dapat diinstall di Android.

---

## 3. Target Users

- **Mahasiswa FK UNP Angkatan 2025** — Pengguna utama yang mengakses jadwal, materi, bank soal, dan flashcards.
- **Pengurus Kelas (Ketua, Bendahara, Sekretaris)** — Mengelola pengumuman, uang kas, dan konten kelas.
- **Dosen / Narasumber** — Secara tidak langsung terlibat melalui materi yang diunggah mahasiswa.

---

## 4. Core Features

### 4.1 Autentikasi & Session Management
- Registrasi dengan email, nama, NIM, nomor HP, dan foto profil.
- Login dengan email dan password via Supabase Auth.
- Session management dengan auto-refresh token, visibility change detection, dan expired session redirect.
- Halaman "Session telah habis" dengan banner peringatan.

### 4.2 Dashboard
- Greeting personalized dengan nama pengguna.
- Quick Stats: jadwal hari ini, jumlah tugas, kehadiran, kas.
- Rotating motivational quotes (25 quote, berganti setiap 15 detik dengan fade transition).
- Exam Countdown: widget countdown ujian yang dapat dikustomisasi (disimpan di localStorage).
- Jadwal Hari Ini: sinkronisasi real-time dengan data jadwal dari Supabase, status otomatis (Sedang Berlangsung / Mendatang / Selesai).
- Pengumuman terbaru (placeholder untuk pengembangan selanjutnya).

### 4.3 Jadwal Kuliah
- CRUD jadwal dengan field: mata kuliah, dosen, hari, jam mulai/selesai, ruangan, catatan, materi.
- **6 Kategori**: Kuliah Pengantar (KP), Keterampilan Klinis (KK), Tutorial, Praktikum, MKU, Pleno.
- **Pleno**: mendukung multiple dosen/narasumber (tambah/hapus dinamis).
- **Dual upload materi**: toggle antara Link URL dan Upload File (max 10MB).
- Day selector: filter jadwal per hari (Minggu-Sabtu).
- Timeline view dengan dot indicator (active/inactive), break indicator otomatis.
- Badge kategori berwarna per tipe jadwal.
- Link materi dosen yang dapat diklik langsung.

### 4.4 CraniShare (Berbagi Ilmu)
- Hero section dengan tombol Upload Catatan dan Leaderboard.
- 3 Category Cards: Bank Soal (link ke /tasks), Catatan Kuliah (upload modal), Flashcards (link ke /flashcards).
- **Materi Terbaru**: feed gabungan dari semua sumber (catatan, bank soal, flashcards) diurutkan berdasarkan waktu.
- Setiap item menampilkan: tipe (badge warna), kategori, kontributor, waktu relatif, detail.
- Upload catatan: file dropzone, judul, subjek, deskripsi, jumlah halaman, toggle publik.
- Hapus materi milik sendiri.

### 4.5 Leaderboard Kontributor
- Podium Top 3 dengan crown/medal icon dan avatar initials.
- Full ranking list dengan breakdown per tipe (catatan/bank soal/flashcard).
- Badge "Kamu" untuk user yang sedang login.
- Star icon untuk top 3.

### 4.6 Bank Soal & Ujian Online
- Grid card per exam set: judul, kategori, difficulty badge (Easy/Medium/Hard), jumlah soal, durasi, progress bar.
- Search bar dan filter by category.
- **Halaman Ujian**: timer countdown, satu soal per halaman, pilihan ganda A-E, radio button.
- Navigasi soal: grid nomor soal (biru=terjawab, kuning=ragu, putih=belum).
- Tombol Ragu-ragu (bookmark) per soal.
- Auto-save jawaban setiap kali dipilih.
- Konfirmasi selesai dengan info soal belum terjawab.
- Scoring otomatis saat submit.
- **Upload Bank Soal**: form multi-soal dengan image upload per soal, difficulty selector, durasi.
- Hapus bank soal milik sendiri.

### 4.7 Flashcards
- Grid card per deck: judul, kategori, jumlah kartu, progress bar.
- **Study View**: kartu besar di tengah, klik untuk flip (depan/belakang), image support.
- Assessment: tombol "Belum Hafal" (merah) dan "Sudah Hafal" (biru).
- Progress tracking per user per kartu (disimpan ke database).
- **Create Flashcards**: input manual (front/back per kartu) + image upload per kartu.
- **Bulk Upload CSV**: upload file CSV/TXT dengan format `depan;belakang` per baris, auto-parse.
- Hapus deck milik sendiri.

### 4.8 Profil
- Header profil: banner biru, foto profil besar (rounded-3xl), nama, NIM.
- Ganti foto profil: klik icon kamera, upload, preview langsung.
- Form edit: Nama Lengkap (editable), NIM (readonly), Email (readonly), No. HP (editable).
- Simpan Perubahan: update ke Supabase Auth metadata.
- Tombol Logout (mobile only).

### 4.9 Uang Kas
- Balance Card: nominal iuran Rp 10.000/bulan, info bulan belum lunas.
- Status Pembayaran: 12 bulan lengkap (Januari-Desember), status per bulan (Lunas/Pending/Belum).
- Card styling: Lunas (hijau, check icon), Pending (kuning, clock icon), Belum (merah, garis kiri, tombol Bayar).
- Ringkasan Tabungan: total terbayar, tunggakan, persentase kepatuhan (auto-calculated).
- Card Bantuan: tombol Hubungi Bendahara.

### 4.10 Tools
- **Draw Straw (Spin Wheel)**: SVG wheel dengan segment per peserta, animasi spin 4 detik, winner announcement, riwayat spin, session management (simpan/muat/hapus sesi).
- **Pomodoro Timer**: SVG ring timer, 3 mode (Focus/Short Break/Long Break), customizable durasi & target harian, todo list, notification sound (work.mp3/break.mp3), browser notification, leaderboard study time, stats disimpan ke database.

### 4.11 Landing Page
- Header: logo + tombol Login & Daftar.
- Hero: "Master Your Medical Journey" dengan gradient text, badge FK UNP 2025, 2 CTA buttons.
- Fitur Utama (Bento Grid): Jadwal Kuliah, Bank Soal & Ujian, CraniShare, Flashcards.
- Pricing: "Gratis untuk Semua" dengan daftar fitur.
- Footer: branding, navigation links, social icons, copyright.

### 4.12 PWA Support
- Web App Manifest: app name, icon, theme color, standalone display mode.
- Service Worker: cache files, offline support, network-first strategy.
- Installable di Android via Chrome "Add to Home Screen".

---

## 5. Architecture Overview

Craniora Academy menggunakan arsitektur **full-stack monolith** berbasis Next.js dengan Supabase sebagai Backend-as-a-Service:

- **Frontend**: Next.js 16 (App Router) dengan React 19, Tailwind CSS v4, Lucide React icons. Server Components untuk data fetching, Client Components untuk interaktivitas.
- **Backend API**: Next.js API Routes (`/api/*`) untuk semua operasi CRUD. Server-side Supabase client untuk authenticated requests.
- **Database**: Supabase (PostgreSQL) dengan Row Level Security (RLS) policies per tabel.
- **Storage**: Supabase Storage untuk file upload (avatars, materials, exam images, flashcard images).
- **Authentication**: Supabase Auth dengan email/password, cookie-based session, middleware untuk route protection.
- **Session Management**: Client-side session provider dengan visibility change detection, periodic check (30 menit), dan auto-refresh.
- **Styling**: Tailwind CSS v4 dengan custom design system (Material Design 3 color tokens), Plus Jakarta Sans + Inter fonts.
- **State Management**: React useState/useEffect untuk local state, Supabase real-time untuk server state.
- **Deployment**: VPS Linux dengan Node.js, PM2, Nginx reverse proxy, Let's Encrypt SSL.

### Tabel Database

| Tabel | Deskripsi |
|-------|-----------|
| `auth.users` | User accounts (Supabase Auth) |
| `schedules` | Jadwal kuliah dengan kategori dan materi |
| `shared_materials` | Catatan yang dibagikan (CraniShare) |
| `exam_sets` | Kumpulan soal ujian |
| `exam_questions` | Soal individual per exam set |
| `exam_attempts` | Percobaan ujian user |
| `flashcard_decks` | Deck flashcard |
| `flashcards` | Kartu individual per deck |
| `flashcard_progress` | Progress belajar per user per kartu |
| `pomodoro_sessions` | Sesi pomodoro yang diselesaikan |

### API Routes

| Route | Methods | Deskripsi |
|-------|---------|-----------|
| `/api/schedules` | GET, POST | CRUD jadwal |
| `/api/schedules/[id]` | PUT, DELETE | Update/hapus jadwal |
| `/api/materials` | GET, POST | CRUD shared materials |
| `/api/materials/[id]` | DELETE | Hapus material |
| `/api/exams` | GET | List exam sets |
| `/api/exams/[id]` | GET, PUT, DELETE | Exam detail, save answers, hapus |
| `/api/exams/create` | POST | Buat exam set + questions |
| `/api/flashcards` | GET | List flashcard decks |
| `/api/flashcards/[id]` | GET, PUT, DELETE | Deck detail, update progress, hapus |
| `/api/flashcards/create` | POST | Buat deck + cards |
| `/api/leaderboard` | GET | Leaderboard kontributor CraniShare |
| `/api/pomodoro` | GET, POST | Stats + save pomodoro session |
| `/api/update-profile` | POST | Update user profile |
| `/api/upload-avatar` | POST | Upload foto profil |
| `/api/upload-image` | POST | Upload gambar (soal/flashcard) |
| `/auth/callback` | GET | Supabase auth callback |
| `/auth/signout` | POST | Logout |

---

## 6. Requirements

### 6.1 Functional Requirements

- User dapat registrasi dengan email, nama lengkap, NIM, nomor HP, dan foto profil.
- User dapat login dengan email dan password.
- User dapat melihat dan mengelola jadwal kuliah per hari dengan 6 kategori.
- User dapat menambahkan materi dosen via link URL atau upload file.
- User dapat membuat dan mengerjakan bank soal ujian dengan timer.
- User dapat membuat flashcard deck secara manual atau bulk upload CSV.
- User dapat berbagi catatan kuliah melalui CraniShare.
- User dapat melihat leaderboard kontributor.
- User dapat menggunakan Pomodoro Timer dengan todo list dan custom target.
- User dapat menggunakan Draw Straw untuk keputusan acak.
- User dapat melihat status pembayaran uang kas.
- User dapat mengedit profil dan mengganti foto.
- Session expired otomatis redirect ke login dengan pesan peringatan.

### 6.2 Non-Functional Requirements

- **Performance**: Halaman harus load dalam < 3 detik pada koneksi 3G.
- **Responsiveness**: UI harus berfungsi optimal di mobile (360px) hingga desktop (1440px).
- **Accessibility**: Semua interactive elements harus keyboard-accessible.
- **Security**: RLS policies di semua tabel, service role key hanya di server-side, session token di HTTP-only cookies.
- **Offline Support**: Halaman yang pernah dibuka dapat diakses offline via Service Worker cache.
- **Browser Support**: Chrome 90+, Safari 14+, Firefox 90+, Edge 90+.
- **PWA**: Installable di Android via Chrome, standalone display mode.

---

## 7. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Webpack) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Fonts | Plus Jakarta Sans, Inter (Google Fonts) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage |
| ORM | Supabase Client (JS SDK) |
| Deployment | VPS Linux, PM2, Nginx, Let's Encrypt |
| PWA | Custom Service Worker + Web App Manifest |
| Mobile | PWA (installable) + Capacitor (optional APK) |

---

## 8. Page Map

```
/ .......................... Root (redirect to /landing or /dashboard)
/landing ................... Landing page (public)
/login ..................... Login page
/register .................. Register page
/register-success .......... Registration success page
/dashboard ................. Main dashboard
/dashboard/schedule ........ Jadwal kuliah
/dashboard/notes ........... CraniShare (berbagi ilmu)
/dashboard/notes/upload .... Upload catatan
/dashboard/notes/leaderboard Leaderboard kontributor
/dashboard/tasks ........... Bank soal
/dashboard/tasks/create .... Upload bank soal
/dashboard/tasks/[id]/exam . Ujian online
/dashboard/flashcards ...... Daftar flashcard decks
/dashboard/flashcards/create Buat flashcard deck
/dashboard/flashcards/[id] . Study flashcard
/dashboard/profile ......... Profil pengguna
/dashboard/treasury ........ Uang kas
/dashboard/tools ........... Tools hub
/dashboard/tools/draw-straw  Draw Straw (spin wheel)
/dashboard/tools/pomodoro .. Pomodoro Timer
```

---

## 9. Design System

### Color Palette (Material Design 3)

| Token | Value | Usage |
|-------|-------|-------|
| `primary-container` | `#001b46` | Primary buttons, headers, sidebar active |
| `primary-400` | `#264280` | Secondary actions, links |
| `primary-50` | `#e6eaf0` | Borders, light backgrounds |
| `on-primary` | `#ffffff` | Text on primary |
| `surface` | `#faf8fd` | Page background |
| `surface-card` | `#ffffff` | Card backgrounds |
| `on-surface` | `#1b1b1f` | Primary text |
| `secondary` | `#615e57` | Secondary text |
| `error` | `#dc2626` | Error states |
| `success` | `#16a34a` | Success states |
| `warning` | `#d97706` | Warning states |
| `info` | `#2563eb` | Info states |

### Typography

| Style | Font | Size | Weight |
|-------|------|------|--------|
| H1 | Plus Jakarta Sans | 36px | 700 |
| H2 | Plus Jakarta Sans | 30px | 600 |
| H3 | Plus Jakarta Sans | 24px | 600 |
| Card Title | Plus Jakarta Sans | 20px | 600 |
| Body Base | Inter | 16px | 400 |
| Body SM | Inter | 14px | 400 |
| Label XS | Inter | 12px | 500 |

### Spacing

| Token | Value |
|-------|-------|
| `stack-sm` | 0.5rem |
| `stack-md` | 1rem |
| `stack-lg` | 2rem |
| `gutter` | 1.5rem |
| `card-padding` | 1.5rem |

### Navigation

| Screen | Navigation |
|--------|-----------|
| Desktop (≥1024px) | Collapsible sidebar (260px / 72px) |
| Mobile (<1024px) | Top header + Bottom nav bar |
| FAB | Quick action menu (3 options) |

---

## 10. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | April 2026 | Initial release: Auth, Dashboard, Schedule, CraniShare, Bank Soal, Flashcards, Profile, Treasury, Tools, Landing Page, PWA |

---

*Document generated for Craniora Academy — FK UNP 2025*
