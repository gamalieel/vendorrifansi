import { useState } from 'react';
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ADMIN_EMAIL } from '../data/mockVendors';
import logoRdp from '../assets/logo-rdp.png';

const INPUT_ICON =
  'w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F1B2D] focus:ring-2 focus:ring-slate-200 bg-white';

const INPUT_ICON_RIGHT =
  'w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F1B2D] focus:ring-2 focus:ring-slate-200 bg-white';

const PANEL_CONTENT = {
  login: {
    categoryLabel: 'SELAMAT DATANG KEMBALI',
    title: 'Masuk ke akunmu',
    subtitle: 'Masukkan detail akun untuk melanjutkan ke ruang kerjamu.',
  },
  register: {
    categoryLabel: 'DAFTAR VENDOR BARU',
    title: 'Buat akun vendormu',
    subtitle: 'Daftarkan perusahaan Anda ke sistem e-procurement kami.',
  },
};

const TESTIMONI = {
  quote: 'PT. Rifansi Dwi Putra membuat setiap proses terasa lebih fokus, rapi, dan dapat diandalkan.',
  name: 'Amara Maheswari',
  role: 'Creative Director, Studio Arta',
  initials: 'AM',
};

export default function AuthPage({ vendors, onLoginSuccess }) {
  const [authTab, setAuthTab] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    namaPerusahaan: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [googleNotice, setGoogleNotice] = useState(false);

  const handleTabChange = (tab) => {
    setAuthTab(tab);
    setAuthError('');
    setGoogleNotice(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const emailClean = authForm.email.trim().toLowerCase();
    if (!emailClean) return;

    // 1. Cek Login Admin
    if (emailClean === ADMIN_EMAIL) {
      if (authTab === 'register') {
        setAuthError('Email ini khusus untuk akun Administrator.');
        return;
      }
      onLoginSuccess({ role: 'admin', email: emailClean });
      return;
    }

    // 2. Cari apakah akun vendor sudah terdaftar
    const existingVendor = (vendors ?? []).find((v) => v.email.toLowerCase() === emailClean);

    if (authTab === 'register') {
      if (existingVendor) {
        setAuthError('Email perusahaan sudah terdaftar. Silakan masuk melalui tab Masuk Akun.');
        return;
      }
      onLoginSuccess({
        role: 'vendor',
        email: emailClean,
        initialCompanyName: authForm.namaPerusahaan.trim(),
      });
    } else {
      if (!existingVendor) {
        setAuthError(
          'Akun vendor belum terdaftar. Silakan daftar melalui tab Registrasi Vendor Baru.'
        );
        return;
      }
      onLoginSuccess({
        role: 'vendor',
        email: existingVendor.email,
        initialCompanyName: existingVendor.nama,
      });
    }
  };

  const { categoryLabel, title, subtitle } = PANEL_CONTENT[authTab];

  return (
    <div className="flex min-h-screen">
      {/* ── BrandingPanel (kiri, hidden di mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1B2D] flex-col justify-between p-10 relative overflow-hidden">
        {/* Elemen dekoratif */}
        <svg
          className="absolute -top-20 -right-20 w-96 h-96 opacity-20 pointer-events-none"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="120" stroke="white" strokeWidth="1" />
          <circle cx="200" cy="200" r="60" stroke="white" strokeWidth="0.75" />
        </svg>
        <svg
          className="absolute bottom-32 -left-16 w-64 h-64 opacity-20 pointer-events-none"
          viewBox="0 0 300 300"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="150" cy="150" r="130" stroke="white" strokeWidth="1" />
          <circle cx="150" cy="150" r="80" stroke="white" strokeWidth="0.75" />
        </svg>

        {/* Logo pojok kiri atas */}
        <div className="flex items-center gap-3 relative z-10">
          <img src={logoRdp} alt="Logo Rifansi" className="h-10 w-auto" />
          <span className="text-base font-extrabold tracking-tight text-white">
            PT. Rifansi Dwi Putra
          </span>
        </div>

        {/* Konten tengah */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <p className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-4">
            Satu Ruang. Semua Kemungkinan.
          </p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Kerja hebat dimulai<br />dari ruang yang<br />sederhana.
          </h2>
          <p className="text-sm text-white/70 leading-relaxed max-w-xs">
            Susun ide, selaraskan tim, dan wujudkan pekerjaan terbaikmu dengan lebih tenang.
          </p>
        </div>

        {/* TestimoniCard */}
        <div className="relative z-10 bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <p className="text-sm text-white/90 leading-relaxed mb-4">
            &ldquo;{TESTIMONI.quote}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {TESTIMONI.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{TESTIMONI.name}</p>
              <p className="text-xs text-white/60">{TESTIMONI.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FormPanel (kanan) ── */}
      <div className="w-full lg:w-1/2 bg-[#FAFAF9] flex flex-col justify-center px-6 py-8 lg:px-16 lg:py-12 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo mobile (hanya tampil di mobile, lg:hidden) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src={logoRdp} alt="Logo Rifansi" className="h-8 w-auto" />
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Rifansi Dwi Putra
            </span>
          </div>

          {/* Category label + judul + subjudul */}
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">
            {categoryLabel}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{title}</h1>
          <p className="text-sm text-slate-500 mb-6">{subtitle}</p>

          {/* TabBar */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                authTab === 'login'
                  ? 'border-[#0F1B2D] text-[#0F1B2D]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                authTab === 'register'
                  ? 'border-[#0F1B2D] text-[#0F1B2D]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Registrasi Vendor Baru
            </button>
          </div>

          {/* Error banner */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Field Nama Perusahaan (register saja) */}
            {authTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Perusahaan
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="PT Contoh Sejahtera"
                  value={authForm.namaPerusahaan}
                  onChange={(e) => setAuthForm({ ...authForm, namaPerusahaan: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F1B2D] focus:ring-2 focus:ring-slate-200 bg-white"
                />
              </div>
            )}

            {/* Field Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className={INPUT_ICON}
                />
              </div>
            </div>

            {/* Field Kata Sandi */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Kata sandi</label>
                {authTab === 'login' && (
                  <button
                    type="button"
                    className="text-xs text-[#0F1B2D] hover:underline cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Minimal 8 karakter"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className={INPUT_ICON_RIGHT}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Ingat saya (login saja) */}
            {authTab === 'login' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="w-4 h-4 rounded border-slate-300 accent-[#0F1B2D] cursor-pointer"
                />
                <label htmlFor="remember-me" className="text-xs text-slate-600 cursor-pointer select-none">
                  Ingat saya
                </label>
              </div>
            )}

            {/* Tombol submit */}
            <button
              type="submit"
              className="w-full bg-[#0F1B2D] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#1a2d47] active:bg-[#0a1420] transition cursor-pointer mt-1"
            >
              {authTab === 'login' ? 'Masuk ke akun \u2192' : 'Daftar & Isi Kualifikasi'}
            </button>

            {/* Divider dan Google button (login saja) */}
            {authTab === 'login' && (
              <>
                <div className="relative flex items-center my-1">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="px-3 text-xs text-slate-400">atau</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={() => setGoogleNotice(true)}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer"
                >
                  {/* Google icon SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Lanjutkan dengan Google
                </button>

                {googleNotice && (
                  <p className="text-xs text-center text-slate-500 -mt-1">
                    Fitur ini belum tersedia
                  </p>
                )}
              </>
            )}
          </form>

          {/* DemoLoginBar */}
          <div className="mt-6 pt-4 border-t border-slate-200 space-y-1.5 text-[11px] text-slate-500 text-left">
            <p className="font-semibold text-slate-700">Klik cepat akun uji coba:</p>
            {[
              { label: 'Login Admin:', email: ADMIN_EMAIL, pass: 'admin' },
              { label: 'Vendor (Pending):', email: 'vendor@mitrasolusi.id', pass: '123' },
              { label: 'Vendor (Lolos):', email: 'budi@nusantarateknik.co.id', pass: '123' },
            ].map((acc) => (
              <div
                key={acc.email}
                className="flex justify-between items-center gap-3 bg-slate-50 px-2.5 py-1.5 rounded-lg"
              >
                <span>{acc.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    handleTabChange('login');
                    setAuthForm({ ...authForm, email: acc.email, password: acc.pass });
                  }}
                  className="font-mono text-[#0F1B2D] hover:underline cursor-pointer truncate"
                >
                  {acc.email}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
