export const STORAGE_KEY = 'eprocurement_vendors_db_v2';
export const ADMIN_EMAIL = 'admin@procurement.id';

export const INITIAL_VENDORS = [
  {
    id: 1,
    email: 'budi@nusantarateknik.co.id',
    nama: 'PT Nusantara Teknik Mandiri',
    kategori: 'Alat Berat & Konstruksi',
    npwp: '01.234.567.8-211.000',
    nib: '9120304857123',
    alamat: 'Jl. Soekarno Hatta No. 88, Pekanbaru',
    pengalaman: '5 Tahun - Proyek Infrastruktur Jalan & Jembatan',
    dokumen: {
      fileNib: 'NIB_PT_Nusantara_Teknik.pdf',
      fileNpwp: 'NPWP_Perusahaan_2026.pdf',
      filePortofolio: 'Company_Profile_NTM.pdf',
    },
    katalog: [
      {
        id: 101,
        namaProduk: 'Sewa Excavator PC200 (Bulanan)',
        harga: 45000000,
        satuan: 'Unit / Bulan',
        stok: 4,
      },
      {
        id: 102,
        namaProduk: 'Jasa Pengaspalan Hotmix Jalan',
        harga: 185000,
        satuan: 'm²',
        stok: 5000,
      },
    ],
    rincianSkor: { legalitas: 38, portofolio: 30, kapasitas: 20 },
    skor: 88,
    catatanAdmin: 'Dokumen legalitas lengkap dan valid.',
    status: 'Lolos',
    isNew: false,
    submittedAt: '17 Nov 2026, 10:15',
  },
  {
    id: 2,
    email: 'vendor@mitrasolusi.id',
    nama: 'CV Mitra Solusi Digital',
    kategori: 'IT & Pengadaan Hardware',
    npwp: '02.876.543.1-216.000',
    nib: '8120009182734',
    alamat: 'Jl. Sudirman No. 12, Pekanbaru',
    pengalaman: '3 Tahun - Pengadaan Server & Jaringan Korporat',
    dokumen: {
      fileNib: 'NIB_Mitra_Solusi.pdf',
      fileNpwp: 'NPWP_Mitra_Solusi.jpg',
      filePortofolio: 'Portofolio_IT_2025.pdf',
    },
    katalog: [
      {
        id: 201,
        namaProduk: 'Server Rackmount 2U Dual Xeon',
        harga: 68000000,
        satuan: 'Unit',
        stok: 10,
      },
    ],
    rincianSkor: null,
    skor: null,
    catatanAdmin: '',
    status: 'Pending',
    isNew: false,
    submittedAt: '18 Nov 2026, 09:30',
  },
];

export function readVendorsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_VENDORS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_VENDORS;
  } catch {
    return INITIAL_VENDORS;
  }
}

export const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);