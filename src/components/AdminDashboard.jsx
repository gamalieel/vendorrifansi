import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Users,
  Search,
  Trash2,
  LogOut,
  Eye,
  RefreshCw,
  Bell,
  Plus,
  FolderOpen,
  BarChart2,
  Settings,
  HelpCircle,
  TrendingUp,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import logoRdp from '../assets/logo-rdp.png';
import ReviewModal from './ReviewModal';
import PriceComparison from './PriceComparison';

/* ---- helpers ---- */
const normalizeStatus = (vendor) =>
  vendor.status === 'Lolos' ? 'Setuju' : vendor.status === 'Ditolak' ? 'Pending' : vendor.status;

const getInitials = (name = '') =>
  name
    .replace(/^(PT|CV|UD)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

/* simple sparkline-style area chart using SVG */
function AreaChart({ data = [], color = '#1e3a5f' }) {
  const h = 120;
  const w = 460;
  const pad = 8;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y];
  });
  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `${pts[0][0]},${h} ` + pts.map(([x, y]) => `${x},${y}`).join(' ') + ` ${pts[pts.length - 1][0]},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaGrad)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      {/* last point dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill="white" stroke={color} strokeWidth="2.2" />
    </svg>
  );
}

/* Tooltip label for the last chart point */
function ChartTooltip({ value, label }) {
  return (
    <div className="absolute right-[6%] top-[18%] bg-[#0F1B2D] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-lg pointer-events-none">
      {value}% <span className="font-normal text-white/70">{label}</span>
      <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 bg-[#0F1B2D] rotate-45" />
    </div>
  );
}

/* Priority task item */
function PriorityTask({ title, project, time, done = false }) {
  return (
    <div className={`flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 ${done ? 'opacity-50' : ''}`}>
      <div className={`mt-0.5 w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center ${done ? 'bg-[#0F1B2D] border-[#0F1B2D]' : 'border-slate-300'}`}>
        {done && <CheckCircle className="w-3 h-3 text-white" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${done ? 'line-through text-slate-400' : 'text-slate-800'}`}>{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{project}</p>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-400">{time}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({
  currentUser,
  vendors,
  onMarkAsRead,
  onSubmitDecision,
  onUpdateCatalogPrice,
  onDeleteVendor,
  onRefreshData,
  onResetDemo,
  onLogout,
}) {
  const [activeMenu, setActiveMenu] = useState('ringkasan');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const totalVendor = vendors.length;
  const totalPending = vendors.filter((v) => normalizeStatus(v) === 'Pending').length;
  const totalSetuju = vendors.filter((v) => normalizeStatus(v) === 'Setuju').length;
  const newSubmissionsCount = vendors.filter((v) => v.isNew).length;

  const filteredVendors = vendors.filter((vendor) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      vendor.nama.toLowerCase().includes(q) ||
      vendor.kategori.toLowerCase().includes(q) ||
      vendor.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'Semua' || normalizeStatus(vendor) === filterStatus;
    return matchSearch && matchStatus;
  });

  const filterCounts = { Semua: totalVendor, Pending: totalPending, Setuju: totalSetuju };

  const handleOpenReview = (vendor) => {
    setSelectedVendor(vendor);
    if (vendor.isNew) onMarkAsRead(vendor.id);
  };

  const handleSaveDecision = (vendorId, decisionPayload) => {
    onSubmitDecision(vendorId, decisionPayload);
    setSelectedVendor(null);
  };

  const handleDelete = (vendor) => {
    if (window.confirm(`Hapus data vendor "${vendor.nama}"?`)) onDeleteVendor(vendor.id);
  };

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  const firstName = currentUser.email?.split('@')[0] || 'Admin';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  /* mock performance data for the chart */
  const perfData = [22, 28, 35, 30, 42, 48, 45, 55, 60, 58, 70, 75, 72, 80, 87];
  const productivity = Math.round((totalSetuju / Math.max(totalVendor, 1)) * 100);

  /* sidebar nav */
  const navMain = [
    { key: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
    { key: 'vendors', label: 'Proyek', icon: FolderOpen, badge: totalPending },
    { key: 'laporan', label: 'Laporan', icon: BarChart2 },
  ];

  const navSettings = [
    { key: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  /* stat cards */
  const stats = [
    {
      label: 'Proyek aktif',
      value: String(totalVendor).padStart(2, '0'),
      helper: `${totalSetuju} berjalan sesuai rencana`,
      badge: '+2 bulan ini',
      badgeColor: 'bg-teal-100 text-teal-700',
      icon: FolderOpen,
      iconColor: 'text-slate-400',
    },
    {
      label: 'Tugas berjalan',
      value: String(totalPending * 3 + totalSetuju).padStart(2, '0'),
      helper: `${totalSetuju * 2} dari ${totalPending * 3 + totalSetuju} tugas terselesaikan`,
      badge: `${Math.round((totalSetuju * 2) / Math.max(totalPending * 3 + totalSetuju, 1) * 100)}% selesai`,
      badgeColor: 'bg-orange-100 text-orange-700',
      icon: CheckCircle,
      iconColor: 'text-slate-400',
    },
    {
      label: 'Anggota tim',
      value: '16',
      helper: '12 sedang online sekarang',
      badge: 'Semua aktif',
      badgeColor: 'bg-slate-100 text-slate-600',
      icon: Users,
      iconColor: 'text-slate-400',
    },
    {
      label: 'Produktivitas',
      value: `${productivity}%`,
      helper: 'Dibandingkan bulan sebelumnya',
      badge: `↑ ${Math.max(productivity - 78, 0)}%`,
      badgeColor: 'bg-green-100 text-green-700',
      icon: TrendingUp,
      iconColor: 'text-slate-400',
    },
  ];

  /* priority tasks (derived from vendor data) */
  const priorityTasks = [
    ...vendors.filter((v) => normalizeStatus(v) === 'Pending').slice(0, 2).map((v) => ({
      title: `Review vendor ${v.nama}`,
      project: v.kategori,
      time: 'Hari ini, 14:00',
      done: false,
    })),
    ...vendors.filter((v) => normalizeStatus(v) === 'Setuju').slice(0, 1).map((v) => ({
      title: `Finalisasi kontrak ${v.nama}`,
      project: v.kategori,
      time: 'Besok, 09:00',
      done: false,
    })),
    { title: 'Kirim revisi proposal', project: 'Ekspansi bisnis', time: 'Selesai', done: true },
  ];

  const isVendorMenu = activeMenu === 'vendors';
  const isPriceMenu = activeMenu === 'laporan';

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

        {/* Nav main */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-2 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            Menu Utama
          </p>
          {navMain.map((item) => {
            const Icon = item.icon;
            const active = activeMenu === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer text-left ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/55 hover:text-white/90 hover:bg-white/8'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/15 text-white/80 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4">
            <p className="px-2 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              Pengaturan
            </p>
            {navSettings.map((item) => {
              const Icon = item.icon;
              const active = activeMenu === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer text-left ${
                    active ? 'bg-white/15 text-white' : 'text-white/55 hover:text-white/90 hover:bg-white/8'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Help card */}
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
          {/* Search */}
          <div className="flex-1 relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari proyek, tugas, atau anggota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Bell */}
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition cursor-pointer">
              <Bell className="w-4.5 h-4.5 text-slate-500" />
              {newSubmissionsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {/* CTA */}
            <button
              onClick={onRefreshData}
              className="flex items-center gap-2 bg-[#0F1B2D] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1a2d47] transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Proyek baru
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* ── RINGKASAN VIEW ── */}
          {activeMenu === 'ringkasan' && (
            <div className="p-6 max-w-[1400px] mx-auto">
              {/* Date + greeting */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-400 tracking-widest mb-1">{todayLabel}</p>
                <h1 className="text-3xl font-bold text-slate-900">Selamat pagi, {displayName}.</h1>
                <p className="text-sm text-slate-500 mt-1">Berikut perkembangan pekerjaan tim Anda hari ini.</p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((st) => {
                  const Icon = st.icon;
                  return (
                    <div key={st.label} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{st.label}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.badgeColor}`}>
                          {st.badge}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-4xl font-bold text-slate-900 tracking-tight">{st.value}</span>
                        <Icon className={`w-8 h-8 ${st.iconColor}`} />
                      </div>
                      <p className="text-xs text-slate-400">{st.helper}</p>
                    </div>
                  );
                })}
              </div>

              {/* Chart + Priority tasks row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Performance chart */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Performa tim</h3>
                      <p className="text-xs text-slate-400">Produktivitas dalam 7 bulan terakhir</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition">
                      7 bulan <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Y-axis labels */}
                  <div className="mt-4 relative">
                    <div className="flex flex-col justify-between absolute left-0 top-0 h-[120px] text-[10px] text-slate-400 -translate-x-5 pointer-events-none">
                      {['100%', '75%', '50%', '25%', '0%'].map((l) => (
                        <span key={l}>{l}</span>
                      ))}
                    </div>
                    <div className="ml-4 relative h-[120px]">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="absolute w-full border-t border-slate-100"
                          style={{ top: `${(i / 4) * 100}%` }}
                        />
                      ))}
                      <AreaChart data={perfData} color="#0F1B2D" />
                      <ChartTooltip value={87} label="November" />
                    </div>
                    {/* X-axis labels */}
                    <div className="ml-4 flex justify-between mt-2 text-[10px] text-slate-400">
                      {['Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov'].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Priority tasks */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Tugas prioritas</h3>
                      <p className="text-xs text-slate-400">Yang perlu diselesaikan segera</p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 cursor-pointer transition">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 divide-y divide-slate-100">
                    {priorityTasks.map((t, i) => (
                      <PriorityTask key={i} {...t} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── VENDORS / TUGAS VIEW ── */}
          {isVendorMenu && (
            <div className="p-6 max-w-[1400px] mx-auto space-y-4">
              {/* Notification banner */}
              {newSubmissionsCount > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 flex items-center gap-3 text-xs text-amber-900">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white tracking-wider uppercase">
                    {newSubmissionsCount} BARU
                  </span>
                  <span>Terdapat pengajuan data vendor baru yang menunggu verifikasi.</span>
                </div>
              )}

              {/* Stat mini cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Vendor', value: totalVendor, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
                  { label: 'Menunggu Evaluasi', value: totalPending, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
                  { label: 'Telah Disetujui', value: totalSetuju, icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                ].map((st) => {
                  const Icon = st.icon;
                  return (
                    <div key={st.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">{st.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{st.value}</p>
                      </div>
                      <div className={`p-2.5 rounded-lg ${st.bg}`}>
                        <Icon className={`w-5 h-5 ${st.color}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Filter bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama vendor, email, bidang usaha..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition"
                  />
                </div>
                <div className="inline-flex p-1 rounded-lg bg-slate-100 gap-1">
                  {['Semua', 'Pending', 'Setuju'].map((status) => {
                    const isSelected = filterStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 rounded-md text-xs transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900 font-medium'
                        }`}
                      >
                        {status}
                        <span className={`text-[10px] px-1.5 rounded-full font-semibold ${isSelected ? 'bg-slate-100 text-slate-700' : 'bg-slate-200 text-slate-600'}`}>
                          {filterCounts[status]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Daftar Pengajuan Rekanan</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Menampilkan {filteredVendors.length} dari {totalVendor} vendor
                    </p>
                  </div>
                  <button onClick={onResetDemo} className="text-xs font-medium text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> Reset Data
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-5">Perusahaan & Akun</th>
                        <th className="py-3 px-5">Bidang & Dokumen</th>
                        <th className="py-3 px-5">Catatan</th>
                        <th className="py-3 px-5 text-center">Status</th>
                        <th className="py-3 px-5 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredVendors.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-12 text-center">
                            <div className="mx-auto w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
                              <Inbox className="w-5 h-5 text-slate-400" />
                            </div>
                            <p className="text-xs font-semibold text-slate-700">Tidak ada data vendor</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Coba ubah filter atau kata kunci pencarian.</p>
                          </td>
                        </tr>
                      )}
                      {filteredVendors.map((vendor) => {
                        const isApproved = normalizeStatus(vendor) === 'Setuju';
                        return (
                          <tr key={vendor.id} className={`transition hover:bg-slate-50 ${vendor.isNew ? 'bg-amber-50/40' : ''}`}>
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 shrink-0 rounded-lg bg-[#0F1B2D]/8 text-[#0F1B2D] font-bold text-xs flex items-center justify-center">
                                  {getInitials(vendor.nama)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-slate-900 truncate">{vendor.nama}</p>
                                    {vendor.isNew && (
                                      <span className="px-1.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">BARU</span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 truncate">{vendor.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-5">
                              <p className="font-medium text-slate-800">{vendor.kategori}</p>
                              <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                                <ImageIcon className="w-3 h-3" />
                                {vendor.katalog?.length || 0} Foto
                              </span>
                            </td>
                            <td className="py-3.5 px-5 max-w-xs">
                              {vendor.catatanAdmin ? (
                                <p className="text-xs text-slate-600 line-clamp-2">{vendor.catatanAdmin}</p>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">Belum ada catatan</span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 text-center">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Setuju
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button onClick={() => handleOpenReview(vendor)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                                  <Eye className="w-3.5 h-3.5" />Periksa
                                </button>
                                <button onClick={() => handleDelete(vendor)} className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── LAPORAN / PRICE COMPARISON VIEW ── */}
          {isPriceMenu && (
            <div className="p-6 max-w-[1400px] mx-auto">
              <PriceComparison vendors={vendors} onUpdatePrice={onUpdateCatalogPrice} />
            </div>
          )}

          {/* ── PENGATURAN VIEW ── */}
          {activeMenu === 'pengaturan' && (
            <div className="p-6 max-w-[1400px] mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Pengaturan</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Akun Aktif</p>
                      <p className="text-xs text-slate-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Reset Data Simulasi</p>
                      <p className="text-xs text-slate-400">Kembalikan data ke kondisi awal demo</p>
                    </div>
                    <button onClick={onResetDemo} className="text-xs font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" /> Reset
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Keluar Sesi</p>
                      <p className="text-xs text-slate-400">Logout dari sistem</p>
                    </div>
                    <button onClick={onLogout} className="text-xs font-medium text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer transition flex items-center gap-1.5">
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {selectedVendor && (
        <ReviewModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onSubmitDecision={handleSaveDecision}
        />
      )}
    </div>
  );
}
