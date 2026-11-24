import { useState } from 'react';
import {
  X,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  ZoomIn,
  Building2,
  MapPin,
  Briefcase,
  Mail,
} from 'lucide-react';

export default function ReviewModal({ vendor, onClose, onSubmitDecision }) {
  const initialStatus =
    vendor.status === 'Setuju' || vendor.status === 'Lolos' ? 'Setuju' : 'Pending';

  const [status, setStatus] = useState(initialStatus);
  const [catatanAdmin, setCatatanAdmin] = useState(vendor.catatanAdmin || '');
  const [previewImage, setPreviewImage] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    onSubmitDecision(vendor.id, {
      status,
      catatanAdmin: catatanAdmin.trim(),
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
      >
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Evaluasi & Verifikasi Rekanan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tinjau data legalitas, foto katalog penawaran, dan tentukan status kualifikasi vendor.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Informasi Perusahaan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-200/80 text-slate-700 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{vendor.nama}</h4>
                  <p className="text-xs text-amber-700 font-medium">{vendor.kategori}</p>
                </div>
              </div>
              {vendor.submittedAt && (
                <span className="text-[11px] text-slate-400">Masuk: {vendor.submittedAt}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{vendor.alamat || '-'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-xs">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Ringkasan Pengalaman & Portofolio:
              </p>
              <p className="text-slate-600 leading-relaxed">{vendor.pengalaman || '-'}</p>
            </div>
          </div>

          {/* Foto Katalog Barang yang Diunggah */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Foto Katalog / Brosur Produk ({vendor.katalog?.length || 0})
              </label>
            </div>

            {!vendor.katalog || vendor.katalog.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                Vendor belum melampirkan foto katalog barang.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vendor.katalog.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-lg overflow-hidden bg-white group hover:border-slate-300 transition"
                  >
                    {item.fotoKatalog ? (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            src: item.fotoKatalog,
                            title: item.namaFoto || 'Foto Katalog',
                          })
                        }
                        className="relative w-full h-24 block overflow-hidden bg-slate-100 cursor-pointer"
                      >
                        <img
                          src={item.fotoKatalog}
                          alt={item.namaFoto}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-full h-24 bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-[11px] font-semibold text-slate-800 truncate">
                        {item.namaFoto || 'Foto Katalog.jpg'}
                      </p>
                      {item.uploadedAt && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.uploadedAt}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Keputusan Status Evaluasi */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Keputusan Kualifikasi Rekanan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('Pending')}
                className={`flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  status === 'Pending'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                Pending (Tinjau / Perlu Revisi)
              </button>

              <button
                type="button"
                onClick={() => setStatus('Setuju')}
                className={`flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  status === 'Setuju'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Setuju (Lolos Kualifikasi)
              </button>
            </div>
          </div>

          {/* Catatan Admin untuk Vendor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Catatan Evaluasi (Akan tampil pada portal vendor)
            </label>
            <textarea
              rows="3"
              placeholder="Berikan instruksi revisi dokumen atau konfirmasi persetujuan rekanan..."
              value={catatanAdmin}
              onChange={(e) => setCatatanAdmin(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs cursor-pointer"
            >
              Simpan Evaluasi
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox Preview Foto */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-2xl w-full p-4 space-y-2 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <p className="text-xs font-bold text-slate-800 truncate">{previewImage.title}</p>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={previewImage.src}
              alt={previewImage.title}
              className="w-full max-h-[70vh] object-contain rounded-lg bg-slate-50 border border-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}
