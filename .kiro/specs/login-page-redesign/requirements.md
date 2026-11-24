# Requirements Document

## Introduction

Fitur ini mengubah tampilan halaman autentikasi (`AuthPage.jsx`) dari layout single-column terpusat menjadi layout dua kolom split-screen. Kolom kiri menampilkan panel branding dengan identitas visual PT. Rifansi Dwi Putra, sedangkan kolom kanan menampilkan form login/registrasi. Seluruh logika autentikasi (pengecekan admin, pengecekan vendor, props `onLoginSuccess` dan `vendors`) dipertahankan tanpa perubahan.

## Glossary

- **AuthPage**: Komponen React `src/components/AuthPage.jsx` yang menangani autentikasi pengguna.
- **BrandingPanel**: Kolom kiri split-screen berisi elemen visual dan branding PT. Rifansi Dwi Putra.
- **FormPanel**: Kolom kanan split-screen berisi form login dan registrasi vendor.
- **LoginForm**: Form pada tab "Masuk Akun" di dalam FormPanel.
- **RegisterForm**: Form pada tab "Registrasi Vendor Baru" di dalam FormPanel.
- **PasswordToggle**: Tombol ikon untuk menampilkan atau menyembunyikan karakter kata sandi.
- **DemoLoginBar**: Bagian klik-cepat akun uji coba yang ada di AuthPage saat ini.
- **SplitLayout**: Kontainer utama dua kolom (50/50) yang membungkus BrandingPanel dan FormPanel.
- **TestimoniCard**: Kartu di BrandingPanel berisi kutipan testimoni, nama, dan jabatan pengguna.
- **Google_OAuth_Button**: Tombol "Lanjutkan dengan Google" pada LoginForm (UI-only pada fase ini).

---

## Requirements

### Requirement 1: Layout Split-Screen Dua Kolom

**User Story:** Sebagai pengguna, saya ingin melihat halaman login yang memiliki dua kolom terpisah, sehingga tampilan lebih profesional dan sesuai brand PT. Rifansi Dwi Putra.

#### Acceptance Criteria

1. THE AuthPage SHALL merender SplitLayout dengan dua kolom bersebelahan (BrandingPanel di kiri, FormPanel di kanan) pada viewport lebar ≥ 1024px.
2. WHEN lebar viewport kurang dari 1024px, THE AuthPage SHALL menyembunyikan BrandingPanel dan menampilkan hanya FormPanel secara full-width.
3. THE SplitLayout SHALL membagi lebar layar sehingga masing-masing kolom menempati tepat 50% lebar SplitLayout pada viewport ≥ 1024px.
4. THE AuthPage SHALL mengisi seluruh tinggi viewport (100vh) ketika konten yang ditampilkan adalah form login atau registrasi dalam kondisi default (tidak ada modal terbuka, tidak ada konten ekspansi dinamis).
5. THE BrandingPanel SHALL menampilkan sekurang-kurangnya logo, tagline, headline, deskripsi, dan TestimoniCard agar identitas brand PT. Rifansi Dwi Putra dapat diverifikasi.

---

### Requirement 2: BrandingPanel — Konten Visual Kiri

**User Story:** Sebagai pengguna, saya ingin melihat panel kiri berisi identitas brand yang kuat, sehingga saya merasa yakin menggunakan sistem milik PT. Rifansi Dwi Putra.

#### Acceptance Criteria

1. THE BrandingPanel SHALL menampilkan background dengan warna `#0F1B2D` menggunakan class Tailwind `bg-[#0F1B2D]`.
2. THE BrandingPanel SHALL menampilkan logo PT. Rifansi Dwi Putra (`logo-rdp.png`) di sudut kiri atas panel dengan tinggi minimum 40px (`h-10`).
3. THE BrandingPanel SHALL menampilkan teks tagline "SATU RUANG. SEMUA KEMUNGKINAN." dalam format huruf kapital semua (uppercase) dengan ukuran font tidak lebih besar dari `text-xs` (12px).
4. THE BrandingPanel SHALL menampilkan headline utama "Kerja hebat dimulai dari ruang yang sederhana." dengan ukuran font minimum `text-2xl` (24px).
5. THE BrandingPanel SHALL menampilkan satu paragraf deskripsi singkat di bawah headline dengan panjang maksimum 200 karakter yang menjelaskan manfaat platform.
6. THE BrandingPanel SHALL menampilkan TestimoniCard di bagian bawah panel berisi: teks kutipan non-kosong, nama pengguna non-kosong, dan jabatan pengguna non-kosong.
7. THE BrandingPanel SHALL menampilkan elemen dekoratif dengan nilai opacity tidak lebih dari 20% (`opacity-20`) agar keterbacaan teks tidak terganggu.
8. THE BrandingPanel SHALL menampilkan seluruh elemen teks dengan warna minimum `#FFFFFF` atau `text-white/80` agar terbaca di atas background navy.

---

### Requirement 3: FormPanel — Struktur dan Tipografi

**User Story:** Sebagai pengguna, saya ingin melihat panel kanan yang bersih dan terarah, sehingga saya dapat fokus mengisi form login tanpa gangguan visual.

#### Acceptance Criteria

1. THE FormPanel SHALL menampilkan background berwarna `#FAFAF9` menggunakan class Tailwind `bg-white` atau `bg-[#FAFAF9]`.
2. IF tab "Masuk Akun" aktif, THEN THE FormPanel SHALL menampilkan label kategori "SELAMAT DATANG KEMBALI" dalam format huruf kapital semua di atas judul utama.
3. IF tab "Masuk Akun" aktif, THEN THE FormPanel SHALL menampilkan judul "Masuk ke akunmu" dengan ukuran teks antara `text-2xl` dan `text-4xl`.
4. THE FormPanel SHALL menampilkan subjudul atau kalimat deskripsi singkat di bawah judul utama dengan panjang maksimum 100 karakter.
5. THE FormPanel SHALL menampilkan dua tab navigasi: "Masuk Akun" dan "Registrasi Vendor Baru", di mana tab aktif ditandai dengan border-bottom berwarna berbeda dan warna teks yang berbeda dari tab tidak aktif.
6. WHEN tab "Registrasi Vendor Baru" aktif, THE FormPanel SHALL menampilkan label kategori "DAFTAR VENDOR BARU" dan judul "Buat akun vendormu" sebagai pengganti label dan judul tab login.

---

### Requirement 4: LoginForm — Field Email dan Kata Sandi

**User Story:** Sebagai pengguna, saya ingin mengisi email dan kata sandi dengan bantuan ikon dan placeholder yang jelas, sehingga saya tidak salah mengisi form.

#### Acceptance Criteria

1. THE LoginForm SHALL menampilkan field "Alamat email" dengan ikon amplop (Lucide `Mail`) di sisi kiri input dan teks placeholder "nama@email.com".
2. THE LoginForm SHALL menampilkan field "Kata sandi" dengan ikon kunci (Lucide `Lock`) di sisi kiri input dan teks placeholder "Minimal 8 karakter".
3. THE LoginForm SHALL menampilkan PasswordToggle di sisi kanan field kata sandi: ikon `Eye` (Lucide) ketika kata sandi tersembunyi, dan ikon `EyeOff` (Lucide) ketika kata sandi ditampilkan.
4. WHEN pengguna mengklik PasswordToggle, THE LoginForm SHALL mengubah atribut `type` field kata sandi dari `password` menjadi `text`, atau sebaliknya.
5. THE LoginForm SHALL menampilkan tautan "Lupa kata sandi?" di sebelah kanan label "Kata sandi".
6. THE LoginForm SHALL menampilkan checkbox berlabel "Ingat saya" di bawah field kata sandi.
7. IF field email atau kata sandi kosong saat form disubmit, THEN THE LoginForm SHALL mencegah pengiriman dan mempertahankan fokus pada field yang kosong disertai indikasi validasi (misalnya border merah).
8. IF panjang kata sandi kurang dari 8 karakter saat form disubmit, THEN THE LoginForm SHALL mencegah pengiriman dan menampilkan indikasi validasi pada field kata sandi.
9. IF nilai field email tidak memenuhi format email valid (tidak mengandung `@` dan domain), THEN THE LoginForm SHALL mencegah pengiriman form.

---

### Requirement 5: LoginForm — Tombol Aksi dan Divider

**User Story:** Sebagai pengguna, saya ingin memiliki opsi masuk yang jelas dan tombol utama yang menonjol, sehingga saya tahu langkah selanjutnya.

#### Acceptance Criteria

1. THE LoginForm SHALL menampilkan tombol submit berteks "Masuk ke akun →" dengan lebar penuh (`w-full`), background warna navy gelap (`#0F1B2D` atau `bg-slate-900`), dan teks berwarna putih.
2. THE LoginForm SHALL menampilkan divider berlabel "atau" di antara tombol submit dan Google_OAuth_Button, berupa dua garis horizontal dengan teks di tengah.
3. THE LoginForm SHALL menampilkan Google_OAuth_Button berlabel "Lanjutkan dengan Google" dengan gaya outline (border terlihat, background transparan atau putih) dan ikon Google di sisi kiri.
4. WHEN pengguna mengklik Google_OAuth_Button, THE LoginForm SHALL menampilkan teks inline atau notifikasi "Fitur ini belum tersedia" tanpa berpindah halaman.
5. THE LoginForm SHALL menampilkan DemoLoginBar di bawah Google_OAuth_Button sebagai bagian "klik cepat akun uji coba".

---

### Requirement 6: RegisterForm — Field Tambahan

**User Story:** Sebagai vendor baru, saya ingin mengisi form registrasi yang meminta data perusahaan saya, sehingga pendaftaran berjalan dengan benar.

#### Acceptance Criteria

1. WHEN tab "Registrasi Vendor Baru" aktif, THE RegisterForm SHALL menampilkan field "Nama Perusahaan" di atas field email, dengan panjang input maksimum 100 karakter.
2. THE RegisterForm SHALL menampilkan field "Alamat email" dengan ikon `Mail` di sisi kiri dan placeholder "nama@email.com", serta field "Kata sandi" dengan ikon `Lock` di sisi kiri, placeholder "Minimal 8 karakter", dan PasswordToggle di sisi kanan.
3. THE RegisterForm SHALL menampilkan tombol submit berlabel "Daftar & Isi Kualifikasi" dengan lebar penuh (`w-full`), background navy gelap (`#0F1B2D` atau setara), dan teks berwarna putih.
4. IF email yang dimasukkan pada RegisterForm sudah terdaftar sebagai vendor, THEN THE RegisterForm SHALL menampilkan pesan error "Email perusahaan sudah terdaftar. Silakan masuk melalui tab Masuk Akun."

---

### Requirement 7: Penanganan Error Autentikasi

**User Story:** Sebagai pengguna, saya ingin mendapatkan pesan error yang jelas ketika login gagal, sehingga saya tahu apa yang harus diperbaiki.

#### Acceptance Criteria

1. IF autentikasi gagal karena akun vendor belum terdaftar, THEN THE AuthPage SHALL menampilkan pesan error "Akun vendor belum terdaftar. Silakan daftar melalui tab Registrasi Vendor Baru."
2. IF email yang dimasukkan pada tab login adalah email administrator dan tab aktif adalah "Registrasi Vendor Baru", THEN THE AuthPage SHALL menampilkan pesan error "Email ini khusus untuk akun Administrator."
3. THE AuthPage SHALL menampilkan pesan error di dalam FormPanel di atas field-field form, dengan background `rose-50` (#FFF1F2 atau setara) dan teks berwarna `rose-700` (#BE123C atau setara).
4. WHEN pengguna berpindah tab antara "Masuk Akun" dan "Registrasi Vendor Baru", THE AuthPage SHALL menghapus pesan error yang sebelumnya ditampilkan sehingga area error kosong.

---

### Requirement 8: Preservasi Logika Autentikasi

**User Story:** Sebagai developer, saya ingin memastikan perubahan tampilan tidak merusak alur autentikasi yang sudah berjalan, sehingga pengguna tetap bisa masuk ke sistem.

#### Acceptance Criteria

1. THE AuthPage SHALL menerima props `vendors` (array, dapat kosong) dan `onLoginSuccess` (fungsi) dengan kontrak yang identik dengan implementasi saat ini; jika `vendors` adalah array kosong atau null, THE AuthPage SHALL tetap merender tanpa error.
2. WHEN login berhasil sebagai admin, THE AuthPage SHALL memanggil `onLoginSuccess` dengan objek `{ role: 'admin', email: <email> }`.
3. WHEN login berhasil sebagai vendor yang sudah terdaftar, THE AuthPage SHALL memanggil `onLoginSuccess` dengan objek `{ role: 'vendor', email: <email>, initialCompanyName: <nama> }`.
4. WHEN registrasi berhasil sebagai vendor baru, THE AuthPage SHALL memanggil `onLoginSuccess` dengan objek `{ role: 'vendor', email: <email>, initialCompanyName: <namaPerusahaan> }`.
5. WHEN mencocokkan email input dengan data vendor atau email admin, THE AuthPage SHALL membandingkan keduanya setelah dikonversi ke huruf kecil sehingga "Admin@example.com" dan "admin@example.com" diperlakukan identik.

---

### Requirement 9: Responsivitas Mobile

**User Story:** Sebagai pengguna mobile, saya ingin halaman login yang nyaman digunakan di layar kecil, sehingga saya bisa masuk ke sistem dari perangkat apapun.

#### Acceptance Criteria

1. WHEN lebar viewport kurang dari 1024px, THE AuthPage SHALL merender hanya FormPanel secara full-width dengan background `#FAFAF9`.
2. WHEN lebar viewport kurang dari 1024px, THE AuthPage SHALL menampilkan logo PT. Rifansi Dwi Putra di dalam FormPanel (di atas judul) sebagai pengganti BrandingPanel yang tersembunyi.
3. THE FormPanel SHALL memiliki padding internal minimum 24px horizontal dan 32px vertikal (setara `px-6 py-8`) agar konten tidak mepet ke tepi layar pada viewport sempit.
4. THE LoginForm dan RegisterForm SHALL tetap dapat digunakan sepenuhnya pada viewport dengan lebar minimum 320px: semua field terlihat penuh, dapat diketik, dan tombol submit dapat dijangkau tanpa scroll horizontal.
