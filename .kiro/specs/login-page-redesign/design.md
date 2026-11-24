# Design Document — Login Page Redesign

## Overview

Dokumen ini menjelaskan desain teknis untuk mengubah `AuthPage.jsx` dari layout single-column terpusat menjadi **split-screen dua kolom (50/50)**. Kolom kiri (**BrandingPanel**) menampilkan identitas visual PT. Rifansi Dwi Putra di atas background navy `#0F1B2D`. Kolom kanan (**FormPanel**) menampilkan form autentikasi di atas background `#FAFAF9`.

Semua logika autentikasi yang ada (pengecekan admin, pengecekan vendor, case-insensitive email matching, props `onLoginSuccess` dan `vendors`) dipertahankan **tanpa perubahan** pada semantik maupun kontraknya. Yang berubah hanya struktur JSX, state tambahan, dan Tailwind classes.

**Stack:** React 19 + Vite, Tailwind CSS v4, Lucide React v1.74

---

## Architecture

Seluruh implementasi berada dalam **satu file**: `src/components/AuthPage.jsx`. Tidak ada file tambahan yang dibuat. Komponen-komponen internal (BrandingPanel, FormPanel, TestimoniCard, DemoLoginBar) diimplementasikan sebagai sub-komponen atau section JSX langsung di dalam file yang sama untuk menjaga kesederhanaan.

```
AuthPage (default export)
├── SplitLayout (div root: flex, min-h-screen)
│   ├── BrandingPanel (kolom kiri, hidden di mobile)
│   │   ├── Logo
│   │   ├── Tagline
│   │   ├── Headline
│   │   ├── Deskripsi
│   │   ├── TestimoniCard
│   │   └── DecorativeSVG (opacity-20)
│   └── FormPanel (kolom kanan, full-width di mobile)
│       ├── MobileLogo (hanya tampil di mobile, lg:hidden)
│       ├── CategoryLabel
│       ├── Title
│       ├── Subtitle
│       ├── TabBar (Masuk Akun | Registrasi Vendor Baru)
│       ├── ErrorBanner (conditional)
│       ├── LoginForm (conditional: authTab === 'login')
│       │   ├── EmailField (ikon Mail)
│       │   ├── PasswordField (ikon Lock + PasswordToggle Eye/EyeOff)
│       │   ├── RememberMe + ForgotPassword
│       │   ├── SubmitButton
│       │   ├── Divider "atau"
│       │   ├── GoogleOAuthButton
│       │   └── DemoLoginBar
│       └── RegisterForm (conditional: authTab === 'register')
│           ├── CompanyNameField
│           ├── EmailField (ikon Mail)
│           ├── PasswordField (ikon Lock + PasswordToggle)
│           └── SubmitButton
```

**Alasan satu file:** Requirement menyebutkan target file tunggal `AuthPage.jsx`. Sub-komponen kecil lebih mudah di-co-locate agar perubahan tidak menyebar ke banyak file.

---

## Components and Interfaces

### `AuthPage` (default export)

**Props (tidak berubah):**

| Prop | Type | Deskripsi |
|---|---|---|
| `vendors` | `Array` | Daftar vendor terdaftar. Boleh kosong atau `null`. |
| `onLoginSuccess` | `Function` | Callback dipanggil setelah autentikasi berhasil. |

**State:**

| State | Tipe | Initial | Deskripsi |
|---|---|---|---|
| `authTab` | `'login' \| 'register'` | `'login'` | Tab aktif. |
| `authError` | `string` | `''` | Pesan error autentikasi. |
| `authForm` | `object` | `{ email: '', password: '', namaPerusahaan: '' }` | Nilai field form. |
| `showPassword` | `boolean` | `false` | Toggle visibilitas password. |
| `googleNotice` | `boolean` | `false` | Tampilkan notifikasi "Fitur belum tersedia" untuk Google OAuth. |

State `showPassword` dan `googleNotice` adalah **tambahan baru** vs implementasi sekarang. Tidak ada state lama yang dihapus.

---

### `BrandingPanel`

Implementasi sebagai section JSX di dalam `AuthPage`. Tidak menerima props — konten branding adalah data statis yang didefinisikan langsung di dalam komponen.

**Konten statis:**
```js
const TESTIMONI = {
  quote: "Platform ini mengubah cara kami mengelola pengadaan. Transparan, cepat, dan terpercaya.",
  name: "Budi Santoso",
  role: "Direktur PT Nusantara Teknik Mandiri",
};

const BRANDING = {
  tagline: "SATU RUANG. SEMUA KEMUNGKINAN.",
  headline: "Kerja hebat dimulai dari ruang yang sederhana.",
  description: "Platform e-procurement PT. Rifansi Dwi Putra — satu tempat untuk seluruh proses pengadaan vendor Anda.",
};
```

---

### `FormPanel`

Section JSX di dalam `AuthPage`. Merender konten berbeda berdasarkan `authTab`.

**Label & judul dinamis:**
```js
const PANEL_CONTENT = {
  login: {
    categoryLabel: "SELAMAT DATANG KEMBALI",
    title: "Masuk ke akunmu",
    subtitle: "Kelola pengadaan vendor Anda dengan mudah.",
  },
  register: {
    categoryLabel: "DAFTAR VENDOR BARU",
    title: "Buat akun vendormu",
    subtitle: "Daftarkan perusahaan Anda ke sistem e-procurement.",
  },
};
```

---

### `DemoLoginBar`

Section JSX di dalam FormPanel. Menggunakan data demo yang sama seperti implementasi sekarang:

```js
const DEMO_ACCOUNTS = [
  { label: 'Login Admin:', email: ADMIN_EMAIL, pass: 'admin' },
  { label: 'Vendor (Pending):', email: 'vendor@mitrasolusi.id', pass: '123' },
  { label: 'Vendor (Lolos):', email: 'budi@nusantarateknik.co.id', pass: '123' },
];
```

---

## Data Models

### `AuthForm`

```js
{
  email: string,          // Input email pengguna
  password: string,       // Input password (tidak divalidasi konten, hanya panjang ≥ 8)
  namaPerusahaan: string, // Hanya relevan saat authTab === 'register'
}
```

### `LoginSuccessPayload`

Kontrak `onLoginSuccess` tidak berubah:

```js
// Admin login
{ role: 'admin', email: string }

// Vendor login (existing)
{ role: 'vendor', email: string, initialCompanyName: string }

// Vendor register (new)
{ role: 'vendor', email: string, initialCompanyName: string }
```

### `TestimoniData`

```js
{
  quote: string,  // Kutipan testimoni (non-kosong)
  name: string,   // Nama pengguna (non-kosong)
  role: string,   // Jabatan pengguna (non-kosong)
}
```

---

## Layout — Tailwind Classes Utama

### SplitLayout (root container)

```jsx
<div className="flex min-h-screen">
```

### BrandingPanel

```jsx
<div className="hidden lg:flex lg:w-1/2 bg-[#0F1B2D] flex-col justify-between p-10 relative overflow-hidden">
```

- `hidden lg:flex` — sembunyi di mobile, tampil sebagai flex column di ≥1024px
- `lg:w-1/2` — tepat 50% lebar
- `relative overflow-hidden` — untuk posisi elemen dekoratif SVG

### FormPanel

```jsx
<div className="w-full lg:w-1/2 bg-[#FAFAF9] flex flex-col justify-center px-6 py-8 lg:px-16 lg:py-12">
```

- `w-full lg:w-1/2` — full-width di mobile, 50% di desktop
- `px-6 py-8` — padding minimum 24px horizontal dan 32px vertikal (Requirement 9.3)

### Tab aktif

```jsx
// Tab aktif
className="flex-1 pb-3 text-sm font-semibold border-b-2 border-[#0F1B2D] text-[#0F1B2D] transition cursor-pointer"

// Tab tidak aktif
className="flex-1 pb-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-600 transition cursor-pointer"
```

### Input field dengan ikon

```jsx
<div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
    <Mail className="w-4 h-4" />
  </span>
  <input
    type="email"
    placeholder="nama@email.com"
    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl
               focus:outline-none focus:border-[#0F1B2D] focus:ring-2 focus:ring-slate-200
               bg-white"
  />
</div>
```

### PasswordToggle

```jsx
<button
  type="button"
  onClick={() => setShowPassword(p => !p)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
>
  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
</button>
```

### Tombol submit (navy)

```jsx
<button
  type="submit"
  className="w-full bg-[#0F1B2D] text-white text-sm font-semibold py-2.5 rounded-xl
             hover:bg-[#1a2d47] active:bg-[#0a1420] transition cursor-pointer"
>
  {authTab === 'login' ? 'Masuk ke akun →' : 'Daftar & Isi Kualifikasi'}
</button>
```

### Divider "atau"

```jsx
<div className="relative flex items-center my-4">
  <div className="flex-1 border-t border-slate-200" />
  <span className="px-3 text-xs text-slate-400">atau</span>
  <div className="flex-1 border-t border-slate-200" />
</div>
```

### Google OAuth Button

```jsx
<button
  type="button"
  onClick={() => setGoogleNotice(true)}
  className="w-full flex items-center justify-center gap-2 border border-slate-200
             rounded-xl py-2.5 text-sm font-medium text-slate-700 bg-white
             hover:bg-slate-50 transition cursor-pointer"
>
  {/* Google SVG icon */}
  Lanjutkan dengan Google
</button>
{googleNotice && (
  <p className="text-xs text-center text-slate-500 mt-2">Fitur ini belum tersedia</p>
)}
```

### ErrorBanner

```jsx
{authError && (
  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
    <AlertCircle className="w-4 h-4 shrink-0" />
    <span>{authError}</span>
  </div>
)}
```

### MobileLogo (lg:hidden)

```jsx
<div className="flex items-center gap-2 mb-6 lg:hidden">
  <img src={logoRdp} alt="Logo Rifansi" className="h-8 w-auto" />
  <span className="text-base font-extrabold tracking-tight text-slate-900">Rifansi Dwi Putra</span>
</div>
```

---

## Struktur JSX Lengkap (Skeleton)

```jsx
export default function AuthPage({ vendors, onLoginSuccess }) {
  const [authTab, setAuthTab]       = useState('login');
  const [authError, setAuthError]   = useState('');
  const [authForm, setAuthForm]     = useState({ email: '', password: '', namaPerusahaan: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [googleNotice, setGoogleNotice] = useState(false);

  const handleTabChange = (tab) => {
    setAuthTab(tab);
    setAuthError('');
    setGoogleNotice(false);
  };

  const handleSubmit = (e) => { /* logika autentikasi persis sama */ };

  return (
    <div className="flex min-h-screen">
      {/* ── BrandingPanel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1B2D] flex-col justify-between p-10 relative overflow-hidden">
        {/* Logo pojok kiri atas */}
        {/* Konten tengah: tagline, headline, deskripsi */}
        {/* TestimoniCard */}
        {/* DecorativeSVG opacity-20 */}
      </div>

      {/* ── FormPanel ── */}
      <div className="w-full lg:w-1/2 bg-[#FAFAF9] flex flex-col justify-center px-6 py-8 lg:px-16 lg:py-12">
        {/* MobileLogo (lg:hidden) */}
        {/* CategoryLabel */}
        {/* Title */}
        {/* Subtitle */}
        {/* TabBar */}
        {/* ErrorBanner */}

        <form onSubmit={handleSubmit}>
          {authTab === 'register' && <CompanyNameField />}
          <EmailField />
          <PasswordField showPassword={showPassword} onToggle={...} />

          {authTab === 'login' && (
            <>
              <RememberMeRow />
              <SubmitButton />
              <Divider />
              <GoogleOAuthButton />
              {googleNotice && <GoogleNotice />}
              <DemoLoginBar />
            </>
          )}
          {authTab === 'register' && <SubmitButton />}
        </form>
      </div>
    </div>
  );
}
```

---

## Logika Autentikasi (Dipertahankan)

Fungsi `handleSubmit` **tidak diubah** secara semantik. Hanya tambahan reset `setGoogleNotice(false)` saat tab berpindah:

```js
const handleSubmit = (e) => {
  e.preventDefault();
  setAuthError('');
  const emailClean = authForm.email.trim().toLowerCase();
  if (!emailClean) return;

  // 1. Cek admin
  if (emailClean === ADMIN_EMAIL) {
    if (authTab === 'register') {
      setAuthError('Email ini khusus untuk akun Administrator.');
      return;
    }
    onLoginSuccess({ role: 'admin', email: emailClean });
    return;
  }

  // 2. Cari vendor
  const existingVendor = (vendors ?? []).find(
    (v) => v.email.toLowerCase() === emailClean
  );

  if (authTab === 'register') {
    if (existingVendor) {
      setAuthError('Email perusahaan sudah terdaftar. Silakan masuk melalui tab Masuk Akun.');
      return;
    }
    onLoginSuccess({ role: 'vendor', email: emailClean, initialCompanyName: authForm.namaPerusahaan.trim() });
  } else {
    if (!existingVendor) {
      setAuthError('Akun vendor belum terdaftar. Silakan daftar melalui tab Registrasi Vendor Baru.');
      return;
    }
    onLoginSuccess({ role: 'vendor', email: existingVendor.email, initialCompanyName: existingVendor.nama });
  }
};
```

**Perubahan kecil vs sekarang:**
- `vendors ?? []` — guard untuk `vendors = null` (Requirement 8.1).
- `setGoogleNotice(false)` dipanggil di `handleTabChange`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

### Property 1: Password toggle adalah round-trip

*For any* initial `showPassword` state (true atau false), mengklik PasswordToggle dua kali harus mengembalikan state ke nilai semula; mengklik sekali harus membalik nilainya.

**Validates: Requirements 4.3, 4.4**

---

### Property 2: Field kosong mencegah submission

*For any* form state di mana field email atau field kata sandi adalah string kosong atau hanya whitespace, memanggil `handleSubmit` tidak boleh memanggil `onLoginSuccess`.

**Validates: Requirements 4.7**

---

### Property 3: Password pendek mencegah submission

*For any* password string dengan panjang kurang dari 8 karakter, memanggil `handleSubmit` tidak boleh memanggil `onLoginSuccess`.

**Validates: Requirements 4.8**

---

### Property 4: Tab switch menghapus error

*For any* `authError` string yang non-kosong, mengganti `authTab` ke nilai lain harus menghasilkan `authError` menjadi string kosong.

**Validates: Requirements 7.4**

---

### Property 5: Email terdaftar pada RegisterForm menghasilkan error duplikat

*For any* array `vendors` yang berisi minimal satu entri, dan *for any* email yang sudah ada di dalam array tersebut, memanggil `handleSubmit` pada tab `register` harus menghasilkan `authError` yang berisi pesan duplikasi — dan **tidak** memanggil `onLoginSuccess`.

**Validates: Requirements 6.4**

---

### Property 6: Email tidak terdaftar pada LoginForm menghasilkan error vendor

*For any* array `vendors` dan *for any* email yang tidak terdapat dalam array tersebut (dan bukan ADMIN_EMAIL), memanggil `handleSubmit` pada tab `login` harus menghasilkan `authError` yang berisi pesan vendor belum terdaftar — dan **tidak** memanggil `onLoginSuccess`.

**Validates: Requirements 7.1**

---

### Property 7: Login admin berhasil dengan email case-insensitive

*For any* variasi kapitalisasi ADMIN_EMAIL (misalnya `"Admin@Procurement.ID"`, `"ADMIN@PROCUREMENT.ID"`), memanggil `handleSubmit` pada tab `login` harus memanggil `onLoginSuccess` dengan `{ role: 'admin', email: <lowercase> }`.

**Validates: Requirements 8.2, 8.5**

---

### Property 8: Login vendor berhasil dengan email case-insensitive dan company name tepat

*For any* vendor dalam array `vendors` dan *for any* variasi kapitalisasi email vendor tersebut, memanggil `handleSubmit` pada tab `login` harus memanggil `onLoginSuccess` dengan `{ role: 'vendor', email: vendor.email, initialCompanyName: vendor.nama }`.

**Validates: Requirements 8.3, 8.5**

---

### Property 9: Registrasi vendor baru meneruskan company name yang diinput

*For any* email baru (tidak ada di `vendors` dan bukan ADMIN_EMAIL) dan *for any* string `namaPerusahaan`, memanggil `handleSubmit` pada tab `register` harus memanggil `onLoginSuccess` dengan `{ role: 'vendor', initialCompanyName: namaPerusahaan.trim() }`.

**Validates: Requirements 8.4**

---

### Property 10: vendors null atau kosong tidak menyebabkan render error

*For any* nilai `vendors` berupa `null`, `undefined`, atau array kosong `[]`, komponen `AuthPage` harus merender tanpa melempar exception.

**Validates: Requirements 8.1**

---

### Property 11: Google notice muncul setelah klik Google button

*For any* initial state `googleNotice`, mengklik Google_OAuth_Button harus menghasilkan `googleNotice === true` dan teks notifikasi "Fitur ini belum tersedia" tampil di DOM.

**Validates: Requirements 5.4**

---

## Error Handling

| Skenario | Pesan Error | Lokasi |
|---|---|---|
| Vendor tidak terdaftar (login) | `"Akun vendor belum terdaftar. Silakan daftar melalui tab Registrasi Vendor Baru."` | `authError` state, ErrorBanner |
| Email admin digunakan di tab register | `"Email ini khusus untuk akun Administrator."` | `authError` state, ErrorBanner |
| Email sudah terdaftar (register) | `"Email perusahaan sudah terdaftar. Silakan masuk melalui tab Masuk Akun."` | `authError` state, ErrorBanner |
| Google OAuth diklik | `"Fitur ini belum tersedia"` | `googleNotice` state, inline text |
| Field kosong | Dicegah oleh HTML `required` attribute | Native browser validation |
| Email format tidak valid | Dicegah oleh `type="email"` | Native browser validation |
| Password < 8 karakter | Dicegah oleh `minLength={8}` attribute | Native browser validation |

**ErrorBanner styling:** `bg-rose-50 border-rose-200 text-rose-700` (Requirement 7.3).

**Error dibersihkan** saat: tab berganti (`handleTabChange`), form disubmit ulang (di awal `handleSubmit` via `setAuthError('')`).

---

## Testing Strategy

### Pendekatan Dual Testing

Kombinasi **property-based tests** (untuk logika autentikasi yang bersifat universal) dan **example-based tests** (untuk rendering dan interaksi UI spesifik).

### Property-Based Testing

**Library:** [fast-check](https://fast-check.dev/) — kompatibel dengan Vite + Vitest.

**Konfigurasi:** Minimum 100 iterasi per property test (`numRuns: 100`).

Setiap property test direferensikan dengan tag komentar:
```js
// Feature: login-page-redesign, Property N: <property_text>
```

**Property tests yang diimplementasikan** (sesuai Correctness Properties di atas):

1. **P1 — Password toggle round-trip**: Generate `boolean` sembarang sebagai initial state; assert toggle dua kali = nilai awal.
2. **P2 — Field kosong mencegah submission**: Generate kombinasi (empty email, non-empty password) dan (non-empty email, empty password); assert `onLoginSuccess` tidak dipanggil.
3. **P3 — Password pendek mencegah submission**: Generate string dengan panjang 1–7; assert `onLoginSuccess` tidak dipanggil.
4. **P4 — Tab switch menghapus error**: Generate string sembarang sebagai `authError`; switch tab; assert `authError === ''`.
5. **P5 — Duplicate email pada register**: Generate vendor array; ambil salah satu email; assert error message benar dan `onLoginSuccess` tidak dipanggil.
6. **P6 — Email tidak terdaftar pada login**: Generate email yang tidak ada di vendor array; assert error message benar.
7. **P7 — Admin login case-insensitive**: Generate uppercase/mixed-case varian ADMIN_EMAIL; assert `onLoginSuccess` dipanggil dengan `role: 'admin'`.
8. **P8 — Vendor login case-insensitive + company name**: Generate varian kapitalisasi email vendor; assert `onLoginSuccess` dipanggil dengan data vendor yang benar.
9. **P9 — Register meneruskan company name**: Generate email baru dan company name sembarang; assert `onLoginSuccess` dipanggil dengan nama yang di-trim.
10. **P10 — vendors null/empty tidak error**: Render dengan `null` / `[]`; assert tidak throw.
11. **P11 — Google notice muncul**: Assert `googleNotice` menjadi `true` setelah klik.

### Example-Based Unit Tests

Untuk skenario spesifik yang tidak cocok untuk PBT:

- Render BrandingPanel: verifikasi kehadiran logo, tagline, headline, deskripsi, TestimoniCard.
- Render FormPanel dengan tab login aktif: verifikasi label "SELAMAT DATANG KEMBALI", judul "Masuk ke akunmu".
- Render FormPanel dengan tab register aktif: verifikasi label "DAFTAR VENDOR BARU", field Nama Perusahaan muncul.
- Error banner styling: verifikasi class `bg-rose-50`, `text-rose-700`.
- Responsive classes: verifikasi `hidden lg:flex` pada BrandingPanel, `lg:hidden` pada MobileLogo.
- DemoLoginBar: klik akun demo → field email/password terisi.

### Integration Tests

- Render `AuthPage` di mobile viewport (320px): verifikasi tidak ada horizontal scroll, semua field terjangkau. *(Manual atau visual regression)*
