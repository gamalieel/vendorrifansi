# Implementation Plan: Login Page Redesign

## Overview

Implementasi penuh redesign `src/components/AuthPage.jsx` dari layout single-column ke split-screen dua kolom. Semua perubahan terbatas pada satu file. Logika autentikasi (`handleSubmit`, props `vendors` dan `onLoginSuccess`) dipertahankan tanpa perubahan semantik.

## Tasks

- [x] 1. Persiapan: tambah state baru dan refactor handleTabChange
  - [x] 1.1 Tambah state `showPassword` (boolean, false) dan `googleNotice` (boolean, false)
    - Tambahkan dua `useState` baru di bawah state `authForm` yang sudah ada
    - Ekstrak handler tab ke fungsi `handleTabChange(tab)` yang memanggil `setAuthTab`, `setAuthError('')`, dan `setGoogleNotice(false)`
    - Perbaiki dua `onClick` TabBar agar memanggil `handleTabChange`
    - Guard `vendors ?? []` pada `handleSubmit` (mengganti `vendors.find` menjadi `(vendors ?? []).find`)
    - _Requirements: 1 (state baru), 7.4 (clear error on tab switch), 8.1 (vendors null guard)_
  - [ ]* 1.2 Tulis property test: tab switch menghapus error (Property 4)
    - **Property 4: Tab switch menghapus error**
    - Generate string `authError` sembarang (non-kosong); panggil `handleTabChange`; assert `authError === ''`
    - **Validates: Requirements 7.4**

- [ ] 2. Implementasi SplitLayout dan BrandingPanel
  - [x] 2.1 Ganti root container dengan SplitLayout (flex min-h-screen)
    - Ganti `<div className="min-h-screen bg-[#FAF8F2] ...">` menjadi `<div className="flex min-h-screen">`
    - Hapus wrapper `<div className="w-full max-w-md">` dan card putih yang membungkus semua konten sebelumnya
    - _Requirements: 1.1, 1.3, 1.4_
  - [x] 2.2 Tambah BrandingPanel sebagai kolom kiri
    - Buat section `<div className="hidden lg:flex lg:w-1/2 bg-[#0F1B2D] flex-col justify-between p-10 relative overflow-hidden">`
    - Bagian atas: logo `logo-rdp.png` (`h-10 w-auto`) + nama perusahaan (teks putih, `font-extrabold`)
    - Bagian tengah: tagline uppercase (`text-xs text-white/60 tracking-widest font-semibold mb-4`), headline (`text-3xl font-bold text-white leading-tight mb-3`), deskripsi (`text-sm text-white/70`)
    - Bagian bawah: TestimoniCard — `bg-white/10 rounded-2xl p-5 backdrop-blur-sm`, kutipan, nama, jabatan
    - Elemen dekoratif SVG lingkaran/elips dengan `className="absolute ... opacity-20 pointer-events-none"`
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
  - [ ]* 2.3 Tulis unit test: BrandingPanel merender elemen branding yang benar
    - Render `AuthPage` dengan viewport ≥ 1024px; assert kehadiran teks "SATU RUANG. SEMUA KEMUNGKINAN.", headline, deskripsi, dan TestimoniCard
    - Assert `hidden lg:flex` ada pada BrandingPanel container
    - _Requirements: 1.5, 2.3, 2.4, 2.5, 2.6_

- [ ] 3. Implementasi FormPanel — struktur, MobileLogo, label, tabs
  - [~] 3.1 Buat FormPanel sebagai kolom kanan
    - Buat section `<div className="w-full lg:w-1/2 bg-[#FAFAF9] flex flex-col justify-center px-6 py-8 lg:px-16 lg:py-12">`
    - Pindahkan seluruh konten form yang ada ke dalam FormPanel ini
    - _Requirements: 1.1, 1.3, 3.1, 9.1, 9.3_
  - [~] 3.2 Tambah MobileLogo (lg:hidden) di atas judul
    - `<div className="flex items-center gap-2 mb-6 lg:hidden">` berisi `logo-rdp.png` (`h-8 w-auto`) dan nama perusahaan
    - _Requirements: 9.1, 9.2_
  - [~] 3.3 Tambah CategoryLabel dan Title/Subtitle dinamis berdasarkan `authTab`
    - Definisikan konstanta `PANEL_CONTENT` dengan `login` dan `register` keys (categoryLabel, title, subtitle)
    - Render `<p>` categoryLabel uppercase (`text-xs font-semibold tracking-widest text-slate-400 mb-1`)
    - Render `<h1>` title (`text-3xl font-bold text-slate-900 mb-1`)
    - Render `<p>` subtitle (`text-sm text-slate-500 mb-6`)
    - _Requirements: 3.2, 3.3, 3.4, 3.6_
  - [~] 3.4 Refactor TabBar agar menggunakan class navy (ganti amber ke `#0F1B2D`)
    - Tab aktif: `border-b-2 border-[#0F1B2D] text-[#0F1B2D]`
    - Tab tidak aktif: `border-b-2 border-transparent text-slate-400 hover:text-slate-600`
    - _Requirements: 3.5_
  - [ ]* 3.5 Tulis unit test: FormPanel merender label kategori dan judul yang benar per tab
    - Tab login: assert teks "SELAMAT DATANG KEMBALI" dan "Masuk ke akunmu" ada di DOM
    - Tab register: assert teks "DAFTAR VENDOR BARU" dan "Buat akun vendormu" ada di DOM; assert field Nama Perusahaan muncul
    - Assert class `lg:hidden` ada pada MobileLogo
    - _Requirements: 3.2, 3.3, 3.6, 9.2_

- [ ] 4. Implementasi LoginForm — field dengan ikon Lucide dan PasswordToggle
  - [~] 4.1 Refactor field Email menggunakan ikon `Mail` (Lucide)
    - Import `Mail, Lock, Eye, EyeOff` dari `lucide-react`
    - Wrap input email dalam `<div className="relative">` dengan `<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail className="w-4 h-4" /></span>`
    - Tambahkan `pl-10` pada className input; ubah placeholder ke `"nama@email.com"`
    - Ubah label menjadi "Alamat email"; ganti focus ring dari amber ke slate/navy (`focus:border-[#0F1B2D] focus:ring-2 focus:ring-slate-200`)
    - Input styles baru: `w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F1B2D] focus:ring-2 focus:ring-slate-200 bg-white`
    - _Requirements: 4.1, 4.9_
  - [~] 4.2 Refactor field Kata Sandi menggunakan ikon `Lock` dan PasswordToggle
    - Wrap input password dalam `<div className="relative">` dengan ikon `Lock` di kiri (sama seperti Mail)
    - Tambah `<button type="button">` PasswordToggle di kanan: `className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"`
    - Toggle merender `<EyeOff>` saat `showPassword === true`, `<Eye>` saat false
    - `onClick={() => setShowPassword(p => !p)}`
    - Ubah `type` input ke `{showPassword ? 'text' : 'password'}`; tambah `minLength={8}`; placeholder `"Minimal 8 karakter"`
    - Ubah label menjadi "Kata sandi"
    - _Requirements: 4.2, 4.3, 4.4, 4.7, 4.8_
  - [~] 4.3 Tambah baris label "Kata sandi" + link "Lupa kata sandi?" dan checkbox "Ingat saya" (login tab saja)
    - Baris label+link: `<div className="flex justify-between items-center mb-1">` berisi label kiri dan `<a>` atau `<button>` kanan berteks "Lupa kata sandi?" (`text-xs text-[#0F1B2D] hover:underline`)
    - Checkbox: `<div className="flex items-center gap-2 mt-1">` berisi `<input type="checkbox">` dan label `"Ingat saya"`
    - _Requirements: 4.5, 4.6_
  - [ ]* 4.4 Tulis property test: PasswordToggle adalah round-trip (Property 1)
    - **Property 1: Password toggle adalah round-trip**
    - Generate `boolean` sembarang sebagai initial `showPassword`; klik PasswordToggle dua kali; assert state kembali ke nilai awal
    - **Validates: Requirements 4.3, 4.4**
  - [ ]* 4.5 Tulis property test: field kosong mencegah submission (Property 2)
    - **Property 2: Field kosong mencegah submission**
    - Generate kombinasi (email kosong, password non-kosong ≥8) dan (email non-kosong, password kosong); assert `onLoginSuccess` tidak dipanggil
    - **Validates: Requirements 4.7**
  - [ ]* 4.6 Tulis property test: password pendek mencegah submission (Property 3)
    - **Property 3: Password pendek mencegah submission**
    - Generate string password panjang 1–7 karakter; assert `onLoginSuccess` tidak dipanggil
    - **Validates: Requirements 4.8**

- [ ] 5. Implementasi tombol submit navy, divider, Google OAuth button
  - [~] 5.1 Ganti styling tombol submit dari gold gradient ke navy
    - Login: `"Masuk ke akun →"` dengan `className="w-full bg-[#0F1B2D] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1a2d47] active:bg-[#0a1420] transition cursor-pointer"`
    - Register: `"Daftar & Isi Kualifikasi"` dengan class yang sama
    - Tombol submit hanya tampil di dalam `form`, gunakan kondisional yang sudah ada
    - _Requirements: 5.1, 6.3_
  - [~] 5.2 Tambah divider "atau" dan Google_OAuth_Button (hanya pada tab login)
    - Divider: `<div className="relative flex items-center my-4">` dengan dua `<div className="flex-1 border-t border-slate-200" />` dan `<span className="px-3 text-xs text-slate-400">atau</span>`
    - Google button: `<button type="button" onClick={() => setGoogleNotice(true)} className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer">`
    - Ikon Google: inline SVG `viewBox="0 0 24 24"` dengan path merah/biru/kuning/hijau standar Google
    - `{googleNotice && <p className="text-xs text-center text-slate-500 mt-2">Fitur ini belum tersedia</p>}`
    - _Requirements: 5.2, 5.3, 5.4_
  - [ ]* 5.3 Tulis property test: Google notice muncul setelah klik (Property 11)
    - **Property 11: Google notice muncul setelah klik Google button**
    - Klik `Google_OAuth_Button`; assert `googleNotice === true` dan teks "Fitur ini belum tersedia" ada di DOM
    - **Validates: Requirements 5.4**

- [ ] 6. Pastikan ErrorBanner, DemoLoginBar, dan RegisterForm tetap berfungsi
  - [~] 6.1 Pastikan ErrorBanner menggunakan ikon `AlertCircle` dan styling rose (tidak ada perubahan, verifikasi saja)
    - Konfirmasi `bg-rose-50 border border-rose-200 text-xs text-rose-700` masih dipakai
    - _Requirements: 7.3_
  - [~] 6.2 Pindah DemoLoginBar ke bawah Google_OAuth_Button dalam LoginForm
    - DemoLoginBar menggunakan data demo yang sama: Admin, Vendor Pending, Vendor Lolos
    - `onClick` DemoLoginBar memanggil `handleTabChange('login')` lalu set form email+password
    - _Requirements: 5.5_
  - [~] 6.3 Pastikan RegisterForm menampilkan field Nama Perusahaan dengan `maxLength={100}`
    - Tambahkan `maxLength={100}` pada input namaPerusahaan
    - _Requirements: 6.1, 6.2_

- [~] 7. Checkpoint — pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan ke user jika ada pertanyaan.

- [ ] 8. Implementasi logika autentikasi (property tests)
  - [ ]* 8.1 Tulis property test: email terdaftar di RegisterForm menghasilkan error duplikat (Property 5)
    - **Property 5: Email terdaftar pada RegisterForm menghasilkan error duplikat**
    - Generate vendor array non-kosong; ambil satu email; submit pada tab register; assert `authError` berisi pesan duplikasi dan `onLoginSuccess` tidak dipanggil
    - **Validates: Requirements 6.4**
  - [ ]* 8.2 Tulis property test: email tidak terdaftar pada LoginForm menghasilkan error vendor (Property 6)
    - **Property 6: Email tidak terdaftar pada LoginForm menghasilkan error vendor**
    - Generate email yang tidak ada di vendor array (dan bukan ADMIN_EMAIL); submit pada tab login; assert `authError` berisi pesan vendor belum terdaftar
    - **Validates: Requirements 7.1**
  - [ ]* 8.3 Tulis property test: login admin berhasil dengan email case-insensitive (Property 7)
    - **Property 7: Login admin berhasil dengan email case-insensitive**
    - Generate variasi kapitalisasi ADMIN_EMAIL; submit pada tab login; assert `onLoginSuccess` dipanggil dengan `{ role: 'admin', email: <lowercase> }`
    - **Validates: Requirements 8.2, 8.5**
  - [ ]* 8.4 Tulis property test: login vendor berhasil dengan email case-insensitive dan company name tepat (Property 8)
    - **Property 8: Login vendor berhasil dengan email case-insensitive dan company name tepat**
    - Generate variasi kapitalisasi email vendor; submit pada tab login; assert `onLoginSuccess` dipanggil dengan `{ role: 'vendor', email: vendor.email, initialCompanyName: vendor.nama }`
    - **Validates: Requirements 8.3, 8.5**
  - [ ]* 8.5 Tulis property test: registrasi vendor baru meneruskan company name yang diinput (Property 9)
    - **Property 9: Registrasi vendor baru meneruskan company name yang diinput**
    - Generate email baru dan string `namaPerusahaan` sembarang; submit pada tab register; assert `onLoginSuccess` dipanggil dengan `{ role: 'vendor', initialCompanyName: namaPerusahaan.trim() }`
    - **Validates: Requirements 8.4**
  - [ ]* 8.6 Tulis property test: vendors null atau kosong tidak menyebabkan render error (Property 10)
    - **Property 10: vendors null atau kosong tidak menyebabkan render error**
    - Render `AuthPage` dengan `vendors={null}`, `vendors={undefined}`, dan `vendors={[]}`; assert tidak throw
    - **Validates: Requirements 8.1**

- [~] 9. Final checkpoint — pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan ke user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Semua perubahan hanya pada satu file: `src/components/AuthPage.jsx`
- Logika `handleSubmit` dipertahankan; satu-satunya perubahan semantik adalah guard `vendors ?? []`
- Property tests menggunakan [fast-check](https://fast-check.dev/) dengan minimum 100 iterasi (`numRuns: 100`)
- Setiap property test diberi komentar `// Feature: login-page-redesign, Property N: <teks>`
- Google_OAuth_Button adalah UI-only pada fase ini (tidak ada integrasi OAuth nyata)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2"] },
    { "id": 3, "tasks": ["2.3", "3.1"] },
    { "id": 4, "tasks": ["3.2", "3.3", "3.4"] },
    { "id": 5, "tasks": ["3.5", "4.1"] },
    { "id": 6, "tasks": ["4.2", "4.3"] },
    { "id": 7, "tasks": ["4.4", "4.5", "4.6", "5.1"] },
    { "id": 8, "tasks": ["5.2", "6.1", "6.2", "6.3"] },
    { "id": 9, "tasks": ["5.3"] },
    { "id": 10, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6"] }
  ]
}
```
