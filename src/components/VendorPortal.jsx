import { useState } from 'react';
import {
  CheckCircle,
  FileText,
  Trash2,
  LogOut,
  Send,
  RotateCcw,
  Package,
  Lock,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  Bell,
  Plus,
  Building2,
  MapPin,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import logoRdp from '../assets/logo-rdp.png';

/* ── shared styles ── */
const INPUT =
  'w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F1B2D] focus:ring-2 focus:ring-slate-200 transition';
const LABEL = 'block text-xs font-semibold text-slate-600 mb-1.5';
const NAV_BTN_BASE =
  'w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer text-left';

function AdminNote({ text }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-left">
      <div className="p-2 bg-amber-100 rounded-lg shrink-0">
        <MessageSquare className="w-4 h-4 text-amber-700" />
      </div>
      <div>
        <p className="text-xs font-bold text-amber-900">Catatan dari Admin</p>
        <p className="text-xs text-amber-800 leading-relaxed mt-0.5">{text}</p>
      </div>
    </div>
  );
}

export default function VendorPortal({
  currentUser,
  vendorData,
  onSubmitKualifikasi,
  onAddKatalog,
  onDeleteKatalog,
  onLogout,
}) {
  const [vendorMenu, setVendorMenu] = useState('kualifikasi');
  const [isRevising, setIsRevising] = useState(false);

  const [kualifikasiForm, setKualifikasiForm] = useState({
    nama: currentUser.initialCompanyName || '',
    kategori: '',
    alamat: '',
    pengalaman: '',
  });

  const [katalogForm, setKatalogForm] = useState({ fotoKatalog: '', namaFoto: '' });

  const hasSubmitted = Boolean(vendorData);
  const hasAdminNote = Boolean(vendorData?.catatanAdmin?.trim());

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setKatalogForm({ fotoKatalog: reader.result, namaFoto: file.name });
    reader.readAsDataURL(file);
  };

  const handleKualifikasiSubmit = (e) => {
    e.preventDefault();
    onSubmitKualifikasi(kualifikasiForm);
    setIsRevising(false);
    setVendorMenu('katalog');
  };

  const handleStartRevision = (data) => {
    setKualifikasiForm({
      nama: data.nama,
      kategori: data.kategori,
      alamat: data.alamat,
      pengalaman: data.pengalaman,
    });
    setIsRevising(true);
    setVendorMenu('kualifikasi');
  };

  const handleKatalogSubmit = (e) => {
    e.preventDefault();
    if (!katalogForm.fotoKatalog) return;
    onAddKatalog(katalogForm);
    setKatalogForm({ fotoKatalog: '', namaFoto: '' });
  };

  const displayName =
    (currentUser.initialCompanyName || currentUser.email?.split('@')[0] || 'Vendor')
      .charAt(0)
      .toUpperCase() +
    (currentUser.initialCompanyName || currentUser.email?.split('@')[0] || 'Vendor').slice(1);

  const statusColor =
    vendorData?.status === 'Lolos'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : vendorData?.status === 'Ditolak'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  const navItems = [
    {
      key: 'kualifikasi',
      label: 'Data Kualifikasi',
      icon: FileText,
      badge: null,
    },
    {
      key: 'katalog',
      label: 'Update Katalog',
      icon: Package,
      badge: hasSubmitted ? vendorData?.katalog?.length || 0 : null,
      locked: !hasSubmitted,
    },
  ];

  return (
    <div className="h-screen bg-slate-50 text-slate-800 flex overflow-hidden">
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className="w-56 bg-[#0F1B2D] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <img src={logoRdp} alt="Logo" className="h-5 w-auto object-contain" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white leading-tight">PT. Rifansi</p>
            <p className="text-[10px] text-white/50 font-medium">DWI PUTRA</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-2 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            Portal Vendor
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = vendorMenu === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { if (!item.locked) setVendorMenu(item.key); }}
                disabled={item.locked}
                title={item.locked ? 'Selesaikan data kualifikasi terlebih dahulu' : ''}
                className={`${NAV_BTN_BASE} ${
                  item.locked
                    ? 'text-white/25 cursor-not-allowed'
                    : active
                    ? 'bg-white/15 text-white'
                    : 'text-white/55 hover:text-white/90 hover:bg-white/8'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {item.locked
                    ? <Lock className="w-4 h-4 shrink-0" />
                    : <Icon className="w-4 h-4 shrink-0" />}
                  {item.label}
                </span>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/15 text-white/80 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Status card jika sudah submit */}
          {hasSubmitted && (
            <div className="mt-4 mx-1 bg-white/8 rounded-xl p-3 text-left">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                Status Pengajuan
              </p>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {vendorData?.status || 'Pending'}
              </span>
              {vendorData?.skor !== null && vendorData?.skor !== undefined && (
                <p className="text-xs text-white/50 mt-2">
                  Skor: <span className="text-white font-semibold">{vendorData.skor}</span>/100
                </p>
              )}
            </div>
          )}
        </nav>

        {/* Help */}
        <div className="mx-3 mb-3 bg-white/8 rounded-xl p-4 text-left">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mb-2">
            <HelpCircle className="w-4 h-4 text-white/70" />
          </div>
          <p className="text-sm font-semibold text-white">Butuh bantuan?</p>
          <p className="text-xs text-white/50 mt-0.5">Tim kami siap membantu Anda.</p>
          <button className="mt-3 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1 cursor-pointer transition">
            Pusat Bantuan <span>→</span>
          </button>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-rose-400 hover:bg-white/5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Portal Rekanan / Vendor</p>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition cursor-pointer">
              <Bell className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-xs font-semibold text-rose-600 border border-rose-200 px-3 py-2 rounded-xl hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">

            {/* ── TAB KUALIFIKASI ── */}
            {vendorMenu === 'kualifikasi' && (
              <>
                {!hasSubmitted || isRevising ? (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Header card */}
                    <div className="px-8 pt-7 pb-6 border-b border-slate-100">
                      <span className="text-xs font-bold text-[#0F1B2D]/60 uppercase tracking-widest">
                        {isRevising ? 'Perbaikan Data' : 'Tahap Wajib'}
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">
                        Formulir Prakualifikasi Vendor
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Setelah data dikirim, Anda dapat langsung mengunggah foto katalog produk/jasa Anda.
                      </p>
                    </div>

                    <form onSubmit={handleKualifikasiSubmit} className="px-8 py-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL}>
                            <Building2 className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                            Nama Badan Usaha
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="PT / CV..."
                            value={kualifikasiForm.nama}
                            onChange={(e) => setKualifikasiForm({ ...kualifikasiForm, nama: e.target.value })}
                            className={INPUT}
                          />
                        </div>
                        <div>
                          <label className={LABEL}>
                            <Briefcase className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                            Bidang Usaha Utama
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: IT & Pengadaan Hardware"
                            value={kualifikasiForm.kategori}
                            onChange={(e) => setKualifikasiForm({ ...kualifikasiForm, kategori: e.target.value })}
                            className={INPUT}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={LABEL}>
                          <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                          Alamat Lengkap Kantor
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Alamat domisili perusahaan..."
                          value={kualifikasiForm.alamat}
                          onChange={(e) => setKualifikasiForm({ ...kualifikasiForm, alamat: e.target.value })}
                          className={INPUT}
                        />
                      </div>

                      <div>
                        <label className={LABEL}>Ringkasan Pengalaman & Portofolio Proyek</label>
                        <textarea
                          rows="4"
                          required
                          placeholder="Jelaskan pengalaman proyek relevan dalam 3 tahun terakhir..."
                          value={kualifikasiForm.pengalaman}
                          onChange={(e) => setKualifikasiForm({ ...kualifikasiForm, pengalaman: e.target.value })}
                          className={INPUT}
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        {isRevising && (
                          <button
                            type="button"
                            onClick={() => setIsRevising(false)}
                            className="text-sm text-slate-500 hover:text-slate-800 cursor-pointer transition"
                          >
                            Batal Perbarui
                          </button>
                        )}
                        <button
                          type="submit"
                          className="ml-auto flex items-center gap-2 bg-[#0F1B2D] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a2d47] transition cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          {isRevising ? 'Kirim Ulang & Lanjut ke Katalog' : 'Simpan Kualifikasi & Lanjut ke Katalog'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Profil sudah tersubmit */
                  <div className="space-y-4">
                    {hasAdminNote && <AdminNote text={vendorData.catatanAdmin} />}

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="px-8 pt-7 pb-5 border-b border-slate-100 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Profil Perusahaan Terdaftar</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <h2 className="text-xl font-bold text-slate-900">{vendorData.nama}</h2>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" /> Berhasil dikirim
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{vendorData.kategori}</p>
                        </div>
                        <button
                          onClick={() => handleStartRevision(vendorData)}
                          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Perbarui
                        </button>
                      </div>

                      <div className="px-8 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-slate-400 mb-1">Alamat Kantor</p>
                          <p className="text-sm font-medium text-slate-800">{vendorData.alamat}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-slate-400 mb-1">Pengalaman & Portofolio</p>
                          <p className="text-sm font-medium text-slate-800">{vendorData.pengalaman}</p>
                        </div>
                      </div>

                      <div className="px-8 pb-6">
                        <button
                          onClick={() => setVendorMenu('katalog')}
                          className="flex items-center gap-2 bg-[#0F1B2D] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a2d47] transition cursor-pointer"
                        >
                          <Package className="w-4 h-4" /> Lanjut ke Update Katalog
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── TAB KATALOG ── */}
            {vendorMenu === 'katalog' && vendorData && (
              <div className="space-y-4">
                {hasAdminNote && <AdminNote text={vendorData.catatanAdmin} />}

                {/* Upload form */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="px-8 pt-7 pb-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Unggah Foto Katalog Barang</h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Pilih foto katalog barang atau brosur produk dalam format JPG atau PNG.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#0F1B2D] bg-slate-100 px-3 py-1 rounded-full">
                      {vendorData.nama}
                    </span>
                  </div>

                  <form onSubmit={handleKatalogSubmit} className="px-8 py-6 space-y-5">
                    <label className="block border-2 border-dashed border-slate-200 hover:border-[#0F1B2D]/40 hover:bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[200px]">
                      {katalogForm.fotoKatalog ? (
                        <div className="w-full max-w-sm space-y-2">
                          <img
                            src={katalogForm.fotoKatalog}
                            alt="Preview"
                            className="w-full h-44 object-contain rounded-xl border border-slate-200 bg-slate-50"
                          />
                          <p className="text-xs font-semibold text-slate-700 truncate">{katalogForm.namaFoto}</p>
                          <span className="text-[11px] text-slate-400">Klik untuk mengganti foto</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-sm font-semibold text-slate-700">Klik untuk Memilih Foto Katalog</p>
                          <p className="text-xs text-slate-400 mt-1">Mendukung JPG, JPEG, PNG</p>
                        </>
                      )}
                      <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFotoChange} className="hidden" />
                    </label>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={!katalogForm.fotoKatalog}
                        className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition ${
                          katalogForm.fotoKatalog
                            ? 'bg-[#0F1B2D] text-white hover:bg-[#1a2d47] cursor-pointer'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" /> Kirim Foto Katalog
                      </button>
                    </div>
                  </form>
                </div>

                {/* Daftar foto terkirim */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Foto Katalog Terkirim
                      <span className="ml-2 text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {vendorData.katalog?.length || 0}
                      </span>
                    </h3>
                  </div>

                  {!vendorData.katalog?.length ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">Belum ada foto katalog</p>
                      <p className="text-xs text-slate-400 mt-0.5">Foto yang Anda unggah akan tampil di sini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5">
                      {vendorData.katalog.map((item) => (
                        <div
                          key={item.id}
                          className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {item.fotoKatalog ? (
                              <img
                                src={item.fotoKatalog}
                                alt={item.namaFoto}
                                className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                <ImageIcon className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                            <div className="min-w-0 text-left">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {item.namaFoto || 'Foto Katalog'}
                              </p>
                              {item.uploadedAt && (
                                <p className="text-[11px] text-slate-400 mt-0.5">Diunggah: {item.uploadedAt}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteKatalog(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
