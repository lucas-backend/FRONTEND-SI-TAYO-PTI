# Guide AI Agent: Mockup Web Publik & Admin Pelacak Bus Unila

Dokumen ini adalah brief teknis lengkap untuk AI Agent. Tujuannya: membangun mockup frontend interaktif (web publik + web admin + simulator supir) yang terasa seperti produk yang sudah launching, siap dipresentasikan, dan siap disambungkan ke API sungguhan.

## 1. Ringkasan Misi

Bangun aplikasi **ReactJS** dengan peta **Leaflet + OpenStreetMap** untuk kampus Universitas Lampung (Bandar Lampung) yang berisi:

1. **Web Publik** (mahasiswa): peta hidup, bus bergerak, rute, halte, kapasitas, ETA ke halte, dan ETA ke posisi pengguna.
2. **Web Admin**: kelola bus, rute, halte, dan akun supir/admin (CRUD dengan data dummy).
3. **Simulator Supir** (`/driver`): replika aplikasi Android supir di dalam bingkai ponsel. Dipakai saat presentasi agar aksi supir (Start Tracking, toggle Penuh) benar-benar menggerakkan bus di web publik.

Semua data berasal dari satu lapisan API tiruan (mock) yang kontraknya sama dengan API asli, sehingga nanti cukup mengganti satu flag untuk terhubung ke backend.

**Prinsip utama:** terlihat dan terasa nyata. Bus bergerak mulus, semua elemen bisa diklik, tidak ada tombol mati, tidak ada teks lorem ipsum.

## 2. Konteks Produk (ringkas)

- Masalah: mahasiswa tidak tahu kapan Bus Tayo Unila datang, di mana posisinya, dan apakah masih ada kursi.
- Survei: 27 responden dari seluruh fakultas menilai sangat membantu. Fitur unggulan: **Peta Lokasi Presisi, Estimasi Sisa Waktu Kedatangan, Notifikasi Otomatis, Status Operasional**.
- Arsitektur target (hanya patokan, fokus sekarang frontend): App supir Android (Kotlin, offline queue) -> REST API + WebSocket -> PostgreSQL + Redis -> Web publik & Web admin. Latensi koordinat 3-5 detik, validasi geofencing area kampus.

### Asumsi karena brief awal ada bagian yang kurang

- Kebutuhan fungsional no. 2 terpotong (`Sistem web publik dapat dia...`). Asumsikan: *web publik dapat diakses tanpa login*.
- Poin observasi duplikat. Abaikan duplikasinya.
- Catat semua asumsi tambahan di `README.md` bagian **Asumsi**.

## 3. Tech Stack (wajib)

| Kebutuhan | Pilihan |
| --- | --- |
| Framework | React 18 + Vite + TypeScript |
| Routing | React Router v6 |
| Peta | `leaflet` + `react-leaflet` (tile OpenStreetMap) |
| Geometri | `@turf/turf` (jarak, along, nearestPointOnLine, lineSlice) |
| State | Zustand (store bus, rute, halte, sesi) |
| Data fetching | TanStack Query (membungkus mock API) |
| Styling | Tailwind CSS + CSS variables untuk design token |
| Ikon | `lucide-react` |
| Animasi | CSS transition + `requestAnimationFrame` untuk marker |
| Form | React Hook Form + Zod |
| Tabel admin | TanStack Table |
| Font | Inter (Google Fonts) dengan fallback system-ui |

Tanpa backend. Tidak boleh memakai `localStorage` untuk data inti kecuali sebagai persistensi demo (simpan sesi login mock dan hasil CRUD admin; sediakan tombol **Reset Data Demo**).

## 4. Struktur Proyek

```
src/
  app/            router, providers, layout
  api/            client.ts (flag USE_MOCK), endpoints.ts, types.ts
  mock/           data/ (buses, routes, stops, users), simulator/ (engine, eta, gateway)
  realtime/       gateway.ts (interface WebSocket-like), mockGateway.ts, wsGateway.ts (stub)
  features/
    public/       MapView, BusMarker, StopMarker, RouteLayer, BottomSheet, tabs/
    admin/        dashboard, buses, routes, stops, users, live
    driver/       PhoneFrame, Login, Panel, Tracking
  components/ui/  Button, Chip, Badge, Card, Toggle, Sheet, Toast, Skeleton
  lib/            geo.ts, format.ts, time.ts
  styles/         tokens.css, leaflet-overrides.css
```

Tiga lapisan harus terpisah tegas: **UI -> hooks/store -> api/realtime**. Komponen UI tidak boleh membaca data mock langsung.

## 5. Design System (diambil dari gambar Android)

Gunakan gambar yang dilampirkan sebagai acuan visual utama. Warna di bawah adalah perkiraan; sesuaikan bila perlu agar mirip gambar.

### 5.1 Token Warna

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--primary` | `#1D4ED8` | Tombol utama, tab aktif, marker bus, rute Jalur 1, tombol Login/Start |
| `--primary-soft` | `#EEF0FF` | Latar input, kartu ETA, chip tidak aktif |
| `--bg` | `#F8F7FF` | Latar halaman (lavender sangat terang) |
| `--surface` | `#FFFFFF` | Bottom sheet, kartu |
| `--text` | `#12141F` | Judul, angka besar |
| `--text-muted` | `#5B6074` | Label kecil, subjudul |
| `--success` | `#00702A` | Status Tersedia, GPS Aktif, titik server aktif |
| `--danger` | `#8F0009` | Tombol Stop Tracking, status Penuh |
| `--route-2` | `#0F9D8A` (garis putus-putus) | Rute Jalur 2 (hijau-teal) |
| `--dark` | `#1A1D26` | Toast hitam "Tap bus untuk estimasi halte" |

Dukung **mode gelap** lewat `prefers-color-scheme` dan toggle manual di admin. Peta publik tetap terang di mode terang dan memakai filter redup di mode gelap.

### 5.2 Tipografi

- Inter. Judul besar (nomor plat, `Driver Login`, `3 Menit`): 700-800, tracking rapat (-0.02em), ukuran 36-56px.
- Label kecil huruf kapital (`ID PENGEMUDI`, `NOMOR ARMADA`, `STATUS KURSI PENUMPANG`): 11-12px, 600-700, tracking lebar (+0.06em), warna muted.
- Isi: 14-16px, 400-500.

### 5.3 Bentuk dan Spasi

- Radius: input/tombol 16-20px, kartu 24px, bottom sheet 28px bagian atas, chip/pill 999px.
- Padding halaman 16-24px. Tombol utama tinggi 56-64px, lebar penuh.
- Bayangan lembut, difusi besar, opasitas rendah. Hindari border tebal.
- Target sentuh minimal 44px.

### 5.4 Komponen Inti

- **Chip status**: titik berwarna + teks kapital kecil (`STATUS: STANDBY`, `PELACAK RUTE`, `Halte Rektorat`).
- **Badge kapasitas**: `Tersedia` (hijau solid, teks putih) atau `Penuh` (merah tua solid).
- **Segmented control**: `Jalur 1 | Jalur 2` (pil biru aktif di dalam wadah abu-lavender).
- **Marker bus**: pil biru berisi ikon bus + plat (`BE 2045 UZ`), ada segitiga/panah arah (Bus 01 biru, Bus 02 hijau-teal). Saat dipilih: membesar sedikit, ada ring denyut (pulse).
- **Marker halte**: lingkaran putih bergaris hitam + label teks kecil. Halte berikutnya disorot biru.
- **Bottom navigation** (4 tab): Peta Rute (ikon peta), Jadwal Halte (jam), Armada (bus), Civitas (profil).
- **Toast hitam** di atas bottom nav: ikon tap + `Tap bus untuk estimasi halte` + tulisan biru `LANGSUNG`.

## 6. Model Data dan Kontrak API

Definisikan di `api/types.ts`. Semua endpoint mock harus mengembalikan bentuk yang sama dengan kontrak ini.

```ts
interface Stop { id: string; name: string; lat: number; lng: number; routeIds: string[] }
interface Route {
  id: string; code: 'J1' | 'J2'; name: string; color: string; dashed: boolean;
  intervalMin: number; path: [number, number][]; stopIds: string[]; active: boolean
}
interface Bus {
  id: string; plate: string; label: string; routeId: string; driverId: string;
  capacity: number; seatsTaken: number; capacityStatus: 'AVAILABLE' | 'FULL';
  status: 'ACTIVE' | 'STANDBY' | 'OFFLINE'
}
interface BusPosition {
  busId: string; lat: number; lng: number; heading: number; speedKmh: number;
  nextStopId: string; ts: number; etaToStops: Record<string, number>
}
interface User { id: string; name: string; username: string; role: 'ADMIN' | 'DRIVER'; active: boolean }
```

### Endpoint REST (mock)

| Method | Path | Fungsi |
| --- | --- | --- |
| POST | `/auth/login` | Login admin/supir, balas JWT palsu + role |
| GET | `/routes`, `/stops`, `/buses` | Data statis |
| POST/PUT/DELETE | `/routes`, `/stops`, `/buses`, `/users` | CRUD admin |
| GET | `/buses/:id/eta?stopId=` | ETA bus ke halte |
| POST | `/tracking/start`, `/tracking/stop` | Dipakai simulator supir |
| POST | `/tracking/location` | Kirim lat, lng, timestamp |
| PATCH | `/buses/:id/capacity` | Toggle Tersedia/Penuh |

### Event Realtime (gateway)

`bus:position`, `bus:capacity`, `bus:started`, `bus:stopped` (hapus marker). Buat interface `Gateway { subscribe(channel, cb); unsubscribe() }` dengan dua implementasi: `mockGateway` (aktif) dan `wsGateway` (stub terkomentari yang menunjuk ke `VITE_WS_URL`).

## 7. Peta Unila dan Rute

- Pusat peta kira-kira di kampus Unila, Gedong Meneng, Rajabasa, Bandar Lampung (sekitar -5.363, 105.244). **Agent wajib memverifikasi koordinat halte di OpenStreetMap** lalu menyesuaikan; angka awal hanyalah perkiraan. Simpan di `mock/data/stops.ts` dengan komentar `TODO: verifikasi lapangan`.
- Batasi peta dengan `maxBounds` di sekitar kampus, zoom 15-19, default 16.
- Tile OSM standar (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) dengan atribusi wajib `© OpenStreetMap contributors`. Terapkan CSS filter ringan (saturasi turun, kecerahan naik) agar tampilan bersih seperti gambar 5.
- **Mode Skematik** (opsional, toggle kecil di pojok kiri bawah peta, ikon kompas dan huruf `U` seperti gambar 5): menampilkan latar sederhana dengan blok bangunan berlabel (FISIP, Perpus Pusat, Rektorat, FK Unila, FT Unila, Embung U Ika, Bundaran Unila) dan jalan abu-abu.

### Data Rute dari Gambar

| Item | Detail |
| --- | --- |
| Jalur 1 `Jalur Lingkar Outer` | Nama di UI: **Jalur Lingkar Luar**. Garis biru solid, persegi panjang mengelilingi kampus. Halte: GSG, FMIPA, FK, Bundaran (dan Pertanian, Rektorat, FMIPA - GSG sesuai daftar sheet). Interval 8 menit. |
| Jalur 2 | **Jalur Lingkar Dalam**. Garis hijau-teal putus-putus di bagian dalam. Halte: Perpus, Rektorat. |
| Bus 01 | `BE 2045 UZ`, Jalur 1, kapasitas 28, terisi 14 (sisa 14), status Tersedia |
| Bus 02 | `BE 2110 UZ`, Jalur 2, kapasitas 28, terisi 20, status Tersedia |
| Supir | Bpk. Bambang S., ID `DRV-19842`, PIN 6 digit (demo: `123456`) |

Buat `path` rute mengikuti jalan sebenarnya (minimal 60-150 titik per rute, rute tertutup/loop). Jalur 1 sebaiknya diperoleh dari tracing jalan di OSM, bukan garis lurus.

## 8. Mesin Simulasi (jantung "peta hidup")

Buat `mock/simulator/engine.ts` yang berjalan sendiri sejak aplikasi dibuka.

1. **Posisi di sepanjang polyline:** simpan `distanceAlongRoute` per bus; hitung koordinat dengan `turf.along`. Rute loop: modulo panjang total.
2. **Kecepatan realistis:** acak halus antara 18-32 km/jam, melambat mendekati halte, berhenti (dwell) 15-30 detik di halte, lalu jalan lagi. Heading dihitung dari `turf.bearing` titik sekarang ke titik depan.
3. **Tick data tiap 3 detik** (meniru latensi 3-5 detik). Tambahkan jitter acak 0-1.5 detik pada pengiriman agar terasa nyata.
4. **Interpolasi mulus:** di sisi UI, marker bergerak dari posisi lama ke baru dengan `requestAnimationFrame` selama \~3 detik (bukan melompat). Rotasi ikon panah mengikuti heading.
5. **ETA:** `ETA = jarakSisaDiSepanjangRute / kecepatanRataRata + dwellDiHalteTengah`. Hitung ke semua halte di rute, dan selalu pakai arah loop (bus yang baru lewat halte punya ETA satu putaran penuh). Tampilkan `Lewat`, `Berikutnya`, atau `+N mnt`.
6. **Kapasitas dinamis:** `seatsTaken` berubah acak kecil saat berhenti di halte (naik/turun). Bila toggle `Penuh` aktif dari supir, `capacityStatus` jadi FULL dan sisa kursi 0.
7. **Skenario kejadian otomatis** (aktifkan lewat panel Demo, lihat bagian 12): bus menjadi offline 20 detik (blank spot), lalu mengirim batch; bus keluar area kampus (lokasi diabaikan); bus berhenti beroperasi (marker hilang dengan animasi fade).

Semua ini dibungkus `mockGateway` yang memancarkan event persis seperti WebSocket asli.

## 9. Web Publik

Route: `/` (Peta Rute), `/jadwal`, `/armada`, `/civitas`. Tanpa login.

### 9.1 Layout Responsif

- **Mobile (< 768px):** meniru gambar 4 dan 5 persis. Header, peta penuh, bottom sheet geser, bottom nav 4 tab.
- **Desktop (>= 1024px):** panel kiri lebar 400px berisi isi bottom sheet (header, selector jalur, kartu bus, daftar halte), peta mengisi sisanya, navigasi pindah ke sidebar/topbar. Tablet: peta + sheet mengambang di kiri.

### 9.2 Tab Peta Rute (gambar 5, tampilan utama)

- Header: titik hijau + judul `BUS UNILA` + chip `PELACAK RUTE`, tombol profil bulat biru di kanan (menuju `/login` admin).
- Baris atas: chip putih `2 Bus Beroperasi` (jumlah dinamis dari data live) + segmented `Jalur 1 | Jalur 2`.
- Kartu info jalur: ikon cabang + `Jalur Lingkar Luar (Aktif)` + teks kanan `INTERVAL 8 MNT`. Berubah saat ganti jalur.
- Peta: rute aktif tebal (solid/putus-putus sesuai jalur), rute lain redup. Marker halte berlabel, marker bus berlabel `BUS 01 • BE 2045 UZ`.
- Toast gelap di bawah: `Tap bus untuk estimasi halte` + `LANGSUNG`. Hilang otomatis setelah pengguna pertama kali menekan bus.

### 9.3 Bottom Sheet Detail Bus (gambar 4)

Muncul saat marker bus ditekan. Tiga posisi snap: **peek** (hanya handle + judul), **setengah**, **penuh**. Drag handle di atas, bisa digeser dan ditutup dengan tap peta.

Isi kartu:

- Label kecil `BUS 01 • JALUR LINGKAR LUAR`, plat besar `BE 2045 UZ`, badge `Tersedia`/`Penuh` di kanan.
- Baris ikon kursi: `Sisa 14 Kursi dari 28 Kapasitas` (dengan bar progres tipis, hijau/oranye/merah menurut keterisian).
- **Kartu ETA** (latar lavender): `TIBA DI HALTE REKTORAT DALAM` + angka besar `3 Menit` + `Jarak 450 meter • Kecepatan 24 km/jam`. Angka berhitung mundur hidup dan sinkron dengan simulasi. Jika < 1 menit tampilkan `Segera tiba`; saat bus di halte tampilkan `Sedang berhenti`.
- **Daftar halte vertikal**: titik abu `Lewat`, titik biru berlingkar `BERIKUTNYA` (teks tebal), titik muda `+6 mnt`. Tap halte untuk menjadikannya target ETA (peta terbang ke halte itu).
- Tombol biru lebar `Lihat Seluruh Rute Halte ->` membuka daftar penuh dengan timeline halte.

### 9.4 Fitur Posisi Pengguna dan ETA Personal

Ini poin penting dari tugas: *perkiraan bus sampai di halte tertentu di posisi user tertentu*.

- Tombol "Lokasi Saya" di peta (ikon target). Minta `navigator.geolocation`. Bila ditolak atau di luar area kampus, tawarkan **Posisi Simulasi**: pengguna bisa menyeret pin biru atau memilih preset (`Dekat FMIPA`, `Dekat Perpus`, `Dekat FK`).
- Hitung halte terdekat dengan `turf.nearestPoint`. Tampilkan chip melayang: `Halte terdekat: FMIPA • 120 m (2 mnt jalan kaki)`.
- Tampilkan kartu **Bus tercepat untuk Anda**: bus mana yang tiba di halte itu paling cepat, ETA bus, waktu jalan kaki, dan saran `Berangkat sekarang` atau `Tunggu 2 menit`.
- Garis putus abu dari pengguna ke halte tujuan.

### 9.5 Tab Lain

- **Jadwal Halte:** dropdown/chip halte, daftar kedatangan bus berikutnya (urut ETA) dengan countdown hidup, plus jadwal operasional (mis. 06.30-17.00) dan status `Operasional`/`Di Luar Jam`.
- **Armada:** kartu semua bus (plat, jalur, status kapasitas, status Aktif/Standby/Offline, kecepatan). Tap kartu: kembali ke peta dan fokus ke bus itu.
- **Civitas:** info bantuan: cara membaca aplikasi, FAQ, kontak UPT TIK Unila, formulir saran (mock kirim + toast sukses), pengaturan notifikasi.

### 9.6 Notifikasi Otomatis (mock)

Tombol lonceng pada halte: `Ingatkan saya saat bus 5 menit lagi`. Saat kondisi terpenuhi, munculkan toast/banner dalam aplikasi (dan `Notification` API bila diizinkan). Simpan daftar pengingat di state.

### 9.7 Status Kosong dan Galat

Skeleton loading saat awal. Bila tidak ada bus aktif: ilustrasi sederhana + `Belum ada bus beroperasi`. Banner kuning `Koneksi terputus, mencoba menyambung kembali` bila gateway putus (marker jadi abu dan ada label `terakhir diperbarui 12 dtk lalu`).

## 10. Simulator Supir (`/driver`)

Tampil dalam bingkai ponsel 390x\~800 di tengah halaman, mengikuti 3 gambar supir. Di sebelahnya (desktop) tampilkan panel penjelasan singkat dan tautan `Buka Peta Publik di tab baru`.

### 10.1 Layar Login (gambar 1)

Ikon bus di kotak biru bulat, judul `Driver Login`, subjudul `Sistem Pelacak Bus Unila • Gerbang & Jalur Lingkar`. Field `ID PENGEMUDI` (placeholder `DRV-19842`) dan `PIN AKSES` (6 titik, tautan `LIHAT` untuk membuka). Tombol biru `Login`. Chip bawah `Server UPT TIK Aktif` (titik hijau) dan teks `Bantuan Teknis UPT TIK Unila • v2.4`. Validasi: ID dan PIN salah memunculkan pesan galat merah; sukses menyimpan JWT palsu dengan role `DRIVER`.

### 10.2 Panel Standby (gambar 2)

Topbar `Panel Pengemudi` + tombol kembali + avatar. `PENGEMUDI AKTIF Bpk. Bambang S.` + `Logout`. Chip `STATUS: STANDBY`. Kartu: `NOMOR ARMADA BE 2045 UZ`, nama jalur, pilihan `STATUS KURSI PENUMPANG` (`Tersedia` hijau / `Penuh`). Tombol besar `START TRACKING`. Catatan `Pastikan GPS aktif sebelum memulai perjalanan rute.`

### 10.3 Panel Tracking Aktif (gambar 3)

`GPS AKTIF` hijau, `Transmisi Sinyal Setiap 3 Detik • Akurasi 2m`. Kartu: plat, chip jalur (`Jalur Lingkar Luar (GSG - FMIPA - Rektorat)`), `Kecepatan: 28 km/jam`, `Menuju Halte Perpustakaan`. Toggle kapasitas tetap bisa diubah. Tombol merah tua `STOP TRACKING`.

### 10.4 Perilaku

- `START TRACKING`: memanggil `/tracking/start`; bus naik status ACTIVE, marker muncul di web publik pada tick berikutnya. Posisi digerakkan mesin simulasi (bukan GPS asli).
- Toggle `Penuh`: langsung terlihat di web publik (badge dan sisa kursi) dalam <= 3 detik.
- `STOP TRACKING`: konfirmasi dialog, lalu marker bus hilang di web publik.
- Tombol rahasia di panel demo: **Simulasikan Sinyal Putus**. Banner oranye `Sinyal putus: lokasi masuk antrean lokal (7)`. Saat tersambung kembali: `Mengirim 7 lokasi tertunda...` lalu sukses. Ini memenuhi syarat penanganan toleransi sinyal.
- **Sinkronisasi antar tab** memakai `BroadcastChannel` agar simulator di satu tab dan peta publik di tab lain tetap sinkron saat presentasi.

## 11. Web Admin

Route `/admin/*`, dilindungi route guard role `ADMIN`. Login di `/admin/login` (demo: `admin` / `admin123`, tampilkan di catatan kecil bila `DEMO_MODE`). Gaya visual sama dengan publik: token warna, radius besar, Inter. Layout desktop: sidebar kiri (Dashboard, Monitor Langsung, Armada, Rute & Halte, Akun) + topbar (pencarian, notifikasi, avatar, toggle tema). Tetap responsif untuk tablet.

### 11.1 Dashboard

Kartu statistik: bus aktif / total, rata-rata kecepatan, jumlah penumpang saat ini, uptime 24 jam (angka dummy 99,2%), latensi rata-rata data (mis. 3,1 dtk, bergerak sedikit). Grafik (Recharts): penumpang per jam dan jumlah perjalanan per hari. Daftar `Aktivitas Terbaru` (bus mulai tracking, kapasitas penuh, sinyal putus). Semuanya bereaksi pada event simulasi.

### 11.2 Monitor Langsung

Peta layar penuh dengan semua bus, filter jalur, panel kanan berisi daftar bus (status, kecepatan, sinyal terakhir, kapasitas). Klik bus: detail + riwayat jejak 5 menit terakhir (polyline tipis di belakang bus). Indikator geofence: area kampus digambar sebagai poligon transparan.

### 11.3 Kelola Armada (Bus)

Tabel: plat, label, jalur, supir, kapasitas, status, aksi. Fitur: cari, filter, urutkan, tambah/ubah (drawer samping dengan form), hapus (dialog konfirmasi), aktif/nonaktif. Validasi Zod: format plat (`BE 1234 XX`), kapasitas 1-60, jalur wajib, supir wajib. Perubahan langsung memengaruhi peta publik di tab lain.

### 11.4 Kelola Rute dan Halte

- Daftar rute (kartu dengan warna, panjang km, jumlah halte, interval, toggle aktif).
- **Editor rute interaktif** di peta: klik untuk menambah titik, seret titik untuk memindah, hapus titik dengan klik kanan, tombol `Undo/Redo`, `Tutup loop`, `Pasang ke jalan` (snap sederhana ke titik terdekat dari path OSM contoh), panjang rute dihitung otomatis. Pilih warna dan gaya garis (solid/putus-putus).
- **Editor halte:** tambah halte dengan klik peta, seret untuk memindah, ubah nama, tetapkan urutan pada rute (drag and drop daftar). Setelah disimpan, ETA di web publik dihitung ulang dengan data baru.
- Tombol `Simpan` menampilkan toast dan memperbarui store (dan mock API).

### 11.5 Kelola Akun

Tabel akun supir/admin: nama, username/ID, role, status, login terakhir. Aksi: tambah, ubah, reset PIN (tampilkan PIN acak sekali), nonaktifkan. Role-based UI: admin biasa vs super admin boleh dibedakan (opsional).

## 12. Panel Demo untuk Presentasi

Tombol mengambang kecil (pojok kanan bawah, bisa disembunyikan dengan `Shift+D`) yang hanya muncul bila `VITE_DEMO_MODE=true`:

- Kecepatan simulasi 1x / 2x / 5x
- Pause / Resume semua bus
- Tambah bus baru ke Jalur 1 atau 2
- Paksa bus Penuh / Tersedia
- Putus sinyal bus 20 detik
- Bus keluar area kampus
- Hentikan bus (hapus marker)
- Pindahkan posisi pengguna ke preset
- Reset Data Demo

Buat juga halaman `/` dengan **tur singkat 5 langkah** (opsional, bisa dilewati) yang menjelaskan fitur utama bagi audiens presentasi.

## 13. Aturan Kualitas

- **Performa:** marker bus tidak boleh memicu render ulang seluruh peta. Pisahkan layer rute (statis) dari layer bus (dinamis). Pakai `memo` dan update marker lewat ref. Target 60 fps di ponsel menengah.
- **Aksesibilitas:** kontras AA, label `aria` pada tombol ikon, fokus terlihat, bottom sheet dapat dioperasikan dengan keyboard, jangan hanya mengandalkan warna (badge pakai teks + ikon).
- **Bahasa:** seluruh UI dalam Bahasa Indonesia. Format waktu `3 Menit`, jarak `450 meter`, kecepatan `24 km/jam`.
- **Kode:** TypeScript strict, tanpa `any`, komponen kecil, nama jelas. Semua nilai ajaib (interval tick, kecepatan, dwell) di `config.ts`.
- **Siap API:** ganti `VITE_USE_MOCK=false` dan `VITE_API_URL`/`VITE_WS_URL` harus cukup untuk berpindah ke backend. Dokumentasikan di README.
- **Tidak ada** data palsu yang tampak palsu (`Test 1`, `Lorem`), tombol mati, atau galat konsol.
- Penanganan galat: setiap query punya state loading, kosong, dan galat.

## 14. Skenario Demo yang Harus Berjalan Mulus

1. Buka web publik. Dua bus langsung bergerak di rute masing-masing, halte terlihat.
2. Tap Bus 01. Bottom sheet naik, ETA `3 Menit` berhitung mundur, daftar halte memperlihatkan Lewat / Berikutnya / +mnt.
3. Ganti ke `Jalur 2`. Rute, interval, dan kartu info berubah. Tap Bus 02.
4. Tekan `Lokasi Saya`/pilih posisi simulasi. Muncul halte terdekat dan bus tercepat untuk pengguna.
5. Buka `/driver` di tab lain, login `DRV-19842`, `START TRACKING`, toggle `Penuh`. Badge di web publik berubah dalam hitungan detik.
6. Simulasikan sinyal putus. Peta publik menandai bus `terakhir diperbarui`, lalu pulih saat batch terkirim.
7. Masuk `/admin`, ubah rute atau tambah halte. Peta publik ikut berubah dan ETA dihitung ulang.
8. `STOP TRACKING`. Marker bus menghilang.

## 15. Kriteria Penerimaan (Checklist)

- [ ] Peta Leaflet + OSM dengan batas kampus Unila, rute dan halte tergambar rapi
- [ ] Minimal 2 bus bergerak halus sepanjang rute, berhenti di halte, bearing benar
- [ ] Marker bus bisa ditekan dan membuka bottom sheet berdata hidup
- [ ] ETA ke halte dan ETA personal ke posisi pengguna akurat secara konsisten
- [ ] Status kapasitas realtime dari simulator supir ke web publik
- [ ] Tampilan mobile identik dengan gambar acuan; desktop responsif dan rapi
- [ ] Login role-based (guard route admin dan supir) dengan JWT palsu
- [ ] Admin dapat CRUD bus, rute (editor peta), halte, akun, dan efeknya terlihat di publik
- [ ] Simulasi sinyal putus dengan antrean offline
- [ ] Panel Demo berfungsi, tombol Reset Data Demo berfungsi
- [ ] Lapisan API/gateway terpisah dan terdokumentasi, flag mock dapat dimatikan
- [ ] Tidak ada galat TypeScript/lint/konsol, `npm run build` sukses
- [ ] `README.md`: cara menjalankan, kredensial demo, struktur, kontrak API, daftar asumsi

## 16. Urutan Kerja yang Disarankan untuk Agent

1. Scaffold proyek, token desain, komponen UI dasar.
2. Tipe data, data dummy (halte, rute, bus), verifikasi koordinat di OSM.
3. Mesin simulasi + mockGateway + uji di konsol.
4. Peta publik: rute, halte, marker bus bergerak mulus.
5. Bottom sheet, ETA, tab Jadwal / Armada / Civitas.
6. Posisi pengguna dan ETA personal, notifikasi mock.
7. Simulator supir dan sinkronisasi antar tab.
8. Web admin (dashboard, monitor, CRUD, editor rute).
9. Panel demo, tur, state kosong/galat, polesan responsif dan mode gelap.
10. QA terhadap checklist, README.

Jika ada keputusan yang ambigu, pilih opsi yang paling mendekati gambar acuan dan catat di README, jangan berhenti untuk bertanya.

## 17. Prompt Singkat untuk Ditempel ke Agent

> Baca dokumen ini sepenuhnya, lalu bangun mockup React + Vite + TypeScript + Leaflet untuk Sistem Pelacak Bus Unila (web publik, web admin, simulator supir) sesuai spesifikasi, desain token, kontrak API, mesin simulasi, skenario demo, dan checklist penerimaan. Jadikan gambar UI Android terlampir sebagai acuan visual. Kerjakan sesuai urutan di bagian 16, verifikasi dengan `npm run build`, dan laporkan asumsi yang diambil.
