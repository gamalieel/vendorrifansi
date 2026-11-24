import { useState, useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { INITIAL_VENDORS } from './data/mockVendors';
import AuthPage from './components/AuthPage';
import VendorPortal from './components/VendorPortal';
import AdminDashboard from './components/AdminDashboard';

// --- DATABASE INDEXEDDB PERSISTEN ---
const DB_NAME = 'eprocurement_db_v2';
const STORE_NAME = 'vendors_store';
const DATA_KEY = 'vendors_list';
const SYNC_SIGNAL_KEY = 'eprocurement_last_updated';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadVendorsFromDB(fallbackData) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(DATA_KEY);
      req.onsuccess = () => {
        if (Array.isArray(req.result)) {
          resolve(req.result);
        } else {
          saveVendorsToDB(fallbackData);
          resolve(fallbackData);
        }
      };
      req.onerror = () => resolve(fallbackData);
    });
  } catch {
    return fallbackData;
  }
}

async function saveVendorsToDB(data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, DATA_KEY);
      req.onsuccess = () => {
        localStorage.setItem(SYNC_SIGNAL_KEY, String(Date.now()));
        resolve(true);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Gagal menyimpan ke IndexedDB:', err);
  }
}

export default function App() {
  const [vendors, setVendors] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const currentUserRef = useRef(null);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // --- RIWAYAT BROWSER: tombol Kembali dari dashboard -> halaman login ---
  useEffect(() => {
    window.history.replaceState({ page: 'login' }, '', '#/login');

    const handlePopState = (e) => {
      if (e.state?.page === 'app') {
        // Tombol Maju ke halaman dashboard saat sesi sudah tidak ada: tetap di login
        if (!currentUserRef.current) {
          window.history.replaceState({ page: 'login' }, '', '#/login');
        }
        return;
      }
      setCurrentUser(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    loadVendorsFromDB(INITIAL_VENDORS).then((savedData) => {
      setVendors(savedData);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    const handleCrossTabSync = async (e) => {
      if (e.key === SYNC_SIGNAL_KEY) {
        const latest = await loadVendorsFromDB(INITIAL_VENDORS);
        setVendors(latest);
      }
    };
    window.addEventListener('storage', handleCrossTabSync);
    return () => window.removeEventListener('storage', handleCrossTabSync);
  }, []);

  const updateVendorsDB = (updater) => {
    setVendors((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveVendorsToDB(next);
      return next;
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const getNowFormatted = () =>
    new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // --- AUTH HANDLERS ---
  const handleLoginSuccess = async (userSession) => {
    const latest = await loadVendorsFromDB(INITIAL_VENDORS);
    setVendors(latest);
    window.history.pushState({ page: 'app' }, '', `#/${userSession.role}`);
    setCurrentUser(userSession);
  };

  const handleLogout = () => {
    if (window.history.state?.page === 'app') {
      // Mundur satu langkah supaya riwayat bersih; popstate yang mengosongkan sesi
      window.history.back();
    } else {
      setCurrentUser(null);
    }
  };

  // --- VENDOR HANDLERS ---
  const currentVendorData =
    currentUser?.role === 'vendor'
      ? vendors.find((v) => v.email.toLowerCase() === currentUser.email.toLowerCase())
      : null;

  const handleVendorSubmitKualifikasi = (formData) => {
    updateVendorsDB((prevVendors) => {
      const existingIndex = prevVendors.findIndex(
        (v) => v.email.toLowerCase() === currentUser.email.toLowerCase()
      );

      const payload = {
        id: existingIndex !== -1 ? prevVendors[existingIndex].id : Date.now(),
        email: currentUser.email,
        nama: formData.nama.trim(),
        kategori: formData.kategori.trim(),
        alamat: formData.alamat.trim(),
        pengalaman: formData.pengalaman.trim(),
        katalog: existingIndex !== -1 ? prevVendors[existingIndex].katalog || [] : [],
        rincianSkor:
          existingIndex !== -1 ? prevVendors[existingIndex].rincianSkor || null : null,
        skor: existingIndex !== -1 ? prevVendors[existingIndex].skor ?? null : null,
        catatanAdmin:
          existingIndex !== -1 ? prevVendors[existingIndex].catatanAdmin || '' : '',
        status: existingIndex !== -1 ? prevVendors[existingIndex].status : 'Pending',
        isNew: true,
        submittedAt: getNowFormatted(),
      };

      const others = prevVendors.filter(
        (v) => v.email.toLowerCase() !== currentUser.email.toLowerCase()
      );
      return [payload, ...others];
    });

    showToast('Data kualifikasi berhasil dikirim! Silakan unggah foto katalog.');
  };

  const handleAddKatalogItem = (katalogForm) => {
    if (!currentVendorData) return;

    const newItem = {
      id: Date.now(),
      fotoKatalog: katalogForm.fotoKatalog || '',
      namaFoto: katalogForm.namaFoto || 'Foto_Katalog.jpg',
      nilaiPenawaran: 0,
      uploadedAt: getNowFormatted(),
    };

    updateVendorsDB((prev) =>
      prev.map((v) =>
        v.id === currentVendorData.id
          ? { ...v, katalog: [newItem, ...(v.katalog || [])], isNew: true }
          : v
      )
    );
    showToast('Foto katalog berhasil tersimpan & terkirim ke Admin.');
  };

  const handleDeleteKatalogItem = (itemId) => {
    if (!currentVendorData) return;
    updateVendorsDB((prev) =>
      prev.map((v) =>
        v.id === currentVendorData.id
          ? { ...v, katalog: (v.katalog || []).filter((item) => item.id !== itemId) }
          : v
      )
    );
    showToast('Foto katalog berhasil dihapus.');
  };

  // --- ADMIN HANDLERS ---
  const handleMarkAsRead = (vendorId) => {
    updateVendorsDB((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, isNew: false } : v))
    );
  };

  const handleAdminDecision = (vendorId, decisionPayload) => {
    updateVendorsDB((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, ...decisionPayload, isNew: false } : v
      )
    );
    showToast(`Status evaluasi berhasil disimpan (${decisionPayload.status}).`);
  };

  // Simpan permanen angka harga penawaran yang dicatat Admin ke IndexedDB
  const handleUpdateCatalogPrice = (vendorId, itemId, newPrice) => {
    const numericPrice = newPrice === '' ? 0 : Math.max(0, Number(newPrice));
    updateVendorsDB((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              katalog: (v.katalog || []).map((item) =>
                item.id === itemId ? { ...item, nilaiPenawaran: numericPrice } : item
              ),
            }
          : v
      )
    );
  };

  const handleDeleteVendor = (vendorId) => {
    updateVendorsDB((prev) => prev.filter((v) => v.id !== vendorId));
    showToast('Data vendor berhasil dihapus.');
  };

  const handleRefreshData = async () => {
    const latest = await loadVendorsFromDB(INITIAL_VENDORS);
    setVendors(latest);
    showToast('Daftar pengajuan vendor diperbarui.');
  };

  const handleResetDemo = () => {
    updateVendorsDB(INITIAL_VENDORS);
    showToast('Data simulasi dikembalikan ke pengaturan awal.');
  };

  if (!isLoaded) return null;

  return (
    <>
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {!currentUser && (
        <AuthPage vendors={vendors} onLoginSuccess={handleLoginSuccess} />
      )}

      {currentUser?.role === 'vendor' && (
        <VendorPortal
          key={currentUser.email}
          currentUser={currentUser}
          vendorData={currentVendorData}
          onSubmitKualifikasi={handleVendorSubmitKualifikasi}
          onAddKatalog={handleAddKatalogItem}
          onDeleteKatalog={handleDeleteKatalogItem}
          onLogout={handleLogout}
        />
      )}

      {currentUser?.role === 'admin' && (
        <AdminDashboard
          key={currentUser.email}
          currentUser={currentUser}
          vendors={vendors}
          onMarkAsRead={handleMarkAsRead}
          onSubmitDecision={handleAdminDecision}
          onUpdateCatalogPrice={handleUpdateCatalogPrice}
          onDeleteVendor={handleDeleteVendor}
          onRefreshData={handleRefreshData}
          onResetDemo={handleResetDemo}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}