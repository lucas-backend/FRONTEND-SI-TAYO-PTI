# Si-Tayo — Mockup Pelacak Bus Unila

Mockup frontend interaktif Sistem Pelacak Bus Universitas Lampung (web publik,
web admin, simulator supir). Spesifikasi lengkap: `docs/BRIEF.md`. Acuan visual:
`docs/design/`.

Status saat ini: **Tahap 1–7, 8A, dan 8B** dari urutan BRIEF bagian 16 sudah selesai.

| Tahap | Isi | Status |
| --- | --- | --- |
| 1 | Scaffold, token desain, komponen UI dasar | Selesai |
| 2 | Tipe data, data dummy (halte/rute/bus/user), verifikasi koordinat OSM | Selesai |
| 3 | Mesin simulasi + `mockGateway` + uji di konsol | Selesai |
| 4 | Peta publik (Leaflet+OSM, rute/halte/bus bergerak, header/segmented/nav, mobile+desktop) | Selesai |
| 5 | Bottom sheet detail bus (ETA countdown, daftar halte), tab Jadwal/Armada/Civitas, state loading/kosong/galat | Selesai |
| 6 | Posisi pengguna + ETA personal (Lokasi Saya, Posisi Simulasi, bus tercepat, notifikasi mock) | Selesai |
| 7 | Simulator supir (`/driver`), sinyal putus, mode demo satu tab (`/demo`) | Selesai |
| 8A | Fondasi admin: auth + guard, layout, dashboard, monitor, CRUD armada & akun, persistensi demo | Selesai |
| 8B | Editor rute & halte interaktif | Selesai |
| 9 | Panel demo, tur, polesan responsif & mode gelap | Belum |
| 10 | QA terhadap checklist, README | Belum |

## Menjalankan

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint
```

Halaman publik:
- `/` — **Peta Rute**: peta OSM live, rute + halte, marker bus bergerak, segmented
  Jalur 1/2, toast ajakan, bottom sheet detail bus, tombol skematik.
- `/jadwal` — Jadwal Halte: pilih halte, daftar kedatangan + countdown, jam operasional.
- `/armada` — Armada: kartu semua bus; tap membuka peta terfokus pada bus itu.
- `/civitas` — Civitas: panduan, FAQ, kontak UPT TIK, form saran, pengaturan notifikasi.
- `/driver` — **Simulator Supir**: bingkai ponsel (Login → Panel Standby → Panel Tracking).
- `/demo` — **Mode Demo**: simulator supir di kiri + peta publik di kanan dalam satu tab.
- `/dev` — Lab Pengembangan (token, komponen, monitor simulasi + Reset Data Demo).
- `/admin/login` — Login admin (demo: `admin` / `admin123`).
- `/admin/dashboard`, `/admin/monitor`, `/admin/armada`, `/admin/rute`, `/admin/akun`
  — Web Admin (dilindungi guard role ADMIN). `/admin/rute/:id` membuka editor peta.

## Teknologi

React 19 + Vite + TypeScript (strict, tanpa `any`, alias `@/`), React Router v7,
Zustand, TanStack Query/Table, Leaflet + react-leaflet, `@turf/turf`, Tailwind CSS v4
dengan CSS variables, `lucide-react`, React Hook Form + Zod, Recharts, font Inter.

> Catatan: scaffold bawaan repo memakai React 19 (BRIEF menyebut React 18). Versi
> ini dipertahankan karena kompatibel dengan seluruh stack dan tidak diubah tanpa alasan.

## Struktur

```
src/
  app/        router, providers, bootstrap, halaman dev/placeholder
  api/        types.ts, endpoints.ts, client.ts (flag mock)
  mock/
    data/     stops.ts, routes.ts, buses.ts, users.ts
    simulator/ engine.ts, eta.ts, instance.ts, runner.ts
  realtime/   gateway.ts (interface), mockGateway.ts, wsGateway.ts (stub)
  store/      useSimStore.ts, useUserStore.ts (lokasi+pengingat), useDriverStore.ts
  hooks/      useSimulation.ts, useCountdown.ts, useReminderWatcher.ts
  features/public/
    PublicLayout.tsx, nav.ts
    map/      MapView, RouteLayer, StopLayer, BusLayer, BusMarker, UserLocationLayer,
              SchematicLayer, icons
    components/  PublicHeader, BottomNav, RouteControls, MapHintToast, SchematicToggle,
                 ConnectionBanner, BusDetailContent, StopStatusList, BusCard, StateViews,
                 UserLocationControl, NearestStopChip, FastestBusCard, ReminderBell
    pages/    PublicMapPage, SchedulePage, FleetPage, CivitasPage
    hooks/    useRouteProjection.ts, usePersonalEta.ts
    lib/      stopStatus.ts, userPresets.ts
  features/driver/
    DriverPage.tsx, DemoPage.tsx, DriverSimulator.tsx, PhoneFrame.tsx, DriverTopbar.tsx,
    LoginPanel.tsx, StandbyPanel.tsx, TrackingPanel.tsx, CapacitySelector.tsx,
    ConfirmDialog.tsx, SignalBanner.tsx, driverRoute.ts
  components/ui/  Button, Card, Chip, Badge, Toggle, SegmentedControl, Skeleton, Sheet, Toast
  lib/        geo.ts, format.ts, time.ts, cn.ts
  styles/     tokens.css, leaflet-overrides.css
  config.ts   konstanta simulasi + pengaturan peta + ETA personal + simulator supir
e2e/          screenshots.spec.ts, scenarios.spec.ts (Playwright)
```

Tiga lapisan dipisah tegas: **UI → store/hooks → api/realtime**. Komponen tidak
mengimpor `src/mock` secara langsung; data masuk lewat store yang berlangganan
`api` dan `gateway`.

## Peta Publik (Tahap 4–5)

- `features/public/map/MapView.tsx` — `MapContainer` Leaflet dengan `maxBounds`
  kampus, zoom 15–19 (default 16), tile OSM + atribusi, dan filter tile ringan.
- Layer dipisah: `RouteLayer` (statis, `React.memo`), `StopLayer`, dan `BusLayer`
  (dinamis). `MapView` diberi `isolation: isolate` agar z-index internal Leaflet
  tidak menutupi bottom sheet/toast.
- `BusMarker` dimanipulasi lewat ref Leaflet + `requestAnimationFrame`: posisi
  diinterpolasi ~3 detik (`SIM.MARKER_ANIMATION_MS`), panah diputar mengikuti heading,
  label `Bus 01 • BE 2045 UZ`. Tidak memicu render ulang seluruh peta.
- Bottom sheet (`components/ui/Sheet.tsx`) tiga posisi dengan `BusDetailContent`:
  plat, badge kapasitas, bar kursi, kartu ETA berhitung mundur hidup, daftar halte
  (Lewat/Berikutnya/+N mnt), dan tampilan "Seluruh Rute Halte". Tap halte memindahkan
  peta (`flyTo`) dan menjadikannya target ETA.
- Desktop (≥768px): panel kiri 400px (header, selector jalur, kartu bus) + peta.
  Mobile: peta penuh, kontrol di atas, sheet + bottom nav 4 tab.
- Opsional: tombol kompas "U" mengaktifkan **mode skematik** (tile disembunyikan,
  blok bangunan berlabel via `SchematicLayer`).

## Posisi Pengguna & ETA Personal (Tahap 6)

- Tombol **Lokasi Saya** di peta meminta `navigator.geolocation`. Bila ditolak,
  tidak didukung, atau posisi di luar area kampus (jarak ke halte terdekat >
  `PERSONAL.MAX_USER_DISTANCE_KM`), pengguna ditawari **Posisi Simulasi**: pin
  biru yang dapat diseret plus preset `Dekat FMIPA`, `Dekat Perpus`, `Dekat FK`
  (`features/public/lib/userPresets.ts`).
- `usePersonalEta` menghitung halte terdekat dengan `turf.nearestPoint`
  (`lib/geo.ts:nearestStop`) dan menampilkan chip melayang
  `Halte terdekat: MIPA • 58 meter (<1 mnt jalan kaki)` (kecepatan jalan
  5 km/jam, `PERSONAL.WALK_SPEED_KMH`).
- Kartu **Bus tercepat untuk Anda** menampilkan bus dengan ETA terkecil ke halte
  itu, waktu jalan kaki, dan saran `Berangkat sekarang` atau `Tunggu N menit`
  (selisih ETA bus dengan waktu jalan kaki).
- Garis putus abu dari posisi pengguna ke halte tujuan (`UserLocationLayer`).
- **Notifikasi mock** (BRIEF 9.6): tombol lonceng per halte/kartu
  (`ReminderBell`) menyimpan pengingat di `useUserStore`. `useReminderWatcher`
  memantau ETA dan saat mencapai ambang 5 menit memunculkan toast + `Notification`
  API bila diizinkan.

## Simulator Supir & Mode Demo (Tahap 7)

- `/driver` menampilkan bingkai ponsel ~390x800 dengan tiga layar mengikuti
  gambar acuan: **Login** (`driver-1`), **Panel Standby** (`driver-2`), dan
  **Panel Tracking Aktif** (`driver-3`).
- Login mock `DRV-19842` / PIN `123456` (`api.login`, JWT palsu role DRIVER,
  disimpan di `localStorage` sebagai persistensi demo). PIN salah menampilkan
  galat merah; tautan `LIHAT` menyembunyikan/menampilkan PIN.
- **START TRACKING** memanggil `/tracking/start` (bus naik `ACTIVE`, marker
  muncul di peta publik). Toggle **Tersedia/Penuh** memengaruhi badge & sisa
  kursi di peta publik dalam ≤ 3 detik. **STOP TRACKING** memakai dialog
  konfirmasi, lalu marker bus hilang dengan animasi fade.
- **Simulasikan Sinyal Putus**: banner oranye `Sinyal putus: lokasi masuk
  antrean lokal (N)`, lalu `Mengirim N lokasi tertunda...` saat pulih. Di peta
  publik marker bus menjadi abu dengan label `terakhir diperbarui N dtk lalu`
  (channel `bus:signal`).
- **`/demo`** (jalur utama presentasi) menampilkan ponsel supir di kiri dan peta
  publik di kanan dalam satu tab, sehingga mesin simulasi berjalan di tab yang
  sama. Route ini memaksa tab menjadi *leader* (`startSimulation(true)`).
- **Sinkronisasi antar tab** tetap memakai `BroadcastChannel` (`mockGateway`)
  sebagai cadangan, termasuk perintah kontrol `bus:control` yang diterapkan pada
  tab penggerak.

## Web Admin (Tahap 8A)

- Route `/admin/*` dilindungi `RequireAdmin` (guard role `ADMIN`). Sesi admin
  disimpan terpisah di `localStorage` (`bus-unila:admin-session`), berbeda dari
  sesi supir (`bus-unila:driver-session`). Akun supir tidak bisa masuk `/admin`
  dan sebaliknya. Login demo `admin` / `admin123` (catatan kecil tampil bila
  `VITE_DEMO_MODE=true`).
- Layout: sidebar kiri (Dashboard, Monitor Langsung, Armada, Rute & Halte, Akun)
  + topbar (pencarian, notifikasi, avatar, toggle tema terang/gelap). Di bawah
  breakpoint `lg` sidebar menjadi drawer (tablet 768px). Gaya visual mengikuti
  token warna publik.
- **Dashboard** (`/admin/dashboard`): kartu statistik (bus aktif/total,
  rata-rata kecepatan, penumpang saat ini, uptime dummy 99,2%, latensi data
  rata-rata dari selisih `Date.now() - event.ts`), grafik Recharts deterministik
  (penumpang per jam, perjalanan per hari), dan **Aktivitas Terbaru** yang
  diisi dari event nyata (`bus:started`, kapasitas penuh, `bus:signal` putus,
  `bus:stopped`).
- **Monitor Langsung** (`/admin/monitor`): peta semua bus, filter jalur,
  poligon geofence kampus (convex hull geometri rute, transparan), panel kanan
  daftar bus (status, kecepatan, sinyal terakhir, kapasitas). Klik bus:
  detail + jejak 5 menit terakhir (polyline tipis).
- **Kelola Armada** (`/admin/armada`): TanStack Table v9 (cari, filter jalur,
  urutkan, paginasi), drawer tambah/ubah (React Hook Form + Zod: plat `BE 1234 XX`,
  kapasitas 1-60, jalur & supir wajib), hapus dengan dialog konfirmasi, toggle
  aktif/nonaktif. Semua lewat `api/client` (mock), bukan mengubah data seed.
- **Kelola Akun** (`/admin/akun`): tabel akun supir/admin, tambah/ubah, reset PIN
  (PIN acak ditampilkan sekali), nonaktifkan. Supir nonaktif gagal login di
  `/driver`.
- **Persistensi demo**: hasil CRUD disimpan pada satu key `localStorage`
  ber-versi (`bus-unila:demo-data:v1`) melalui `src/mock/db.ts`. Tombol **Reset
  Data Demo** (sidebar admin & `/dev`) menghapus key tersebut dan mengembalikan
  armada ke seed. Perubahan armada disiarkan lewat channel realtime
  `fleet:changed` sehingga peta publik di tab lain (`BroadcastChannel`) atau di
  `/demo` ikut berubah: bus baru muncul, bus nonaktif hilang, kapasitas berubah.
- **Rute & Halte** (`/admin/rute-halte`) masih placeholder "Segera hadir"
  (editor dikerjakan pada tahap 8B).
- Setiap tabel punya state loading (skeleton), kosong, dan galat.

## Verifikasi (Playwright)

Screenshot & skenario demo diuji dengan Playwright (Chromium) pada viewport
persis **390x844**, **1280x800**, dan **768x1024**:

```bash
npx playwright test
```

Hasil tersimpan di `docs/screenshots/` (mis. `driver-1-login-390x844.png`,
`demo-5-penuh-1280x800.png`, `admin-dashboard-1280x800.png`,
`admin-monitor-768x1024.png`). Skenario BRIEF bagian 14 butir 4–6 (ETA personal,
START TRACKING + Penuh, sinyal putus & pemulihan) otomatis diverifikasi oleh
`e2e/scenarios.spec.ts`. Alur admin (login -> tambah bus muncul di `/demo` ->
nonaktifkan -> bus hilang) dan screenshot seluruh halaman admin pada 1280x800
dan 768x1024 diverifikasi oleh `e2e/admin.spec.ts`.

## Kredensial Demo

| Peran | Username / ID | PIN |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Super Admin | `superadmin` | `super123` |
| Supir | `DRV-19842` | `123456` |

## Kontrak API (mock)

Tipe ada di `src/api/types.ts`; path ada di `src/api/endpoints.ts`. Klien mock di
`src/api/client.ts` mengembalikan bentuk yang sama dengan API asli sehingga cukup
mengganti `VITE_USE_MOCK=false` untuk beralih backend.

- `POST /auth/login` → JWT palsu + role
- `GET /routes`, `/stops`, `/buses`, `/users`
- `GET /buses/:id/eta?stopId=`
- `POST /tracking/start`, `/tracking/stop`, `/tracking/location`
- `PATCH /buses/:id/capacity`

Realtime (`src/realtime/gateway.ts`): event `bus:position`, `bus:capacity`,
`bus:started`, `bus:stopped`, `bus:signal` (status GPS putus/pulih),
`bus:control` (perintah supir antar tab), `gateway:status`. Implementasi aktif
`mockGateway` (in-memory + `BroadcastChannel`); `wsGateway` masih stub menuju
`VITE_WS_URL`.

## Mesin Simulasi

`mock/simulator/engine.ts` berjalan sejak aplikasi dibuka (lewat `app/bootstrap.ts`
→ `runner.ts`): posisi sepanjang polyline (`turf.along`), kecepatan acak 10–16 km/jam
(dipilih agar satu putaran Jalur 1 ~14 menit) dengan perlambatan menjelang halte,
dwell 15–30 detik, `tick` 3 detik + jitter 0–1,5 detik, heading dari `turf.bearing`,
dan ETA ke semua halte. Langkah mesin dihitung dari **timestamp nyata** (bukan
jumlah tick) sehingga bus tetap mengejar posisi yang benar saat tab leader
di-throttle/tersembunyi (`MAX_STEP_ELAPSED_S`). Skenario yang sudah ada: sinyal
putus (antrean offline + flush batch + event `bus:signal`), keluar geofence
(koordinat diabaikan store), toggle Penuh, add/remove/reset bus, pengali
kecepatan, dan pause.

## Data Rute (hasil tracing)

Path rute diambil dari `docs/data/jalur1.geojson` & `jalur2.geojson` (GeoJSON
`[lng, lat]` → diubah ke `[lat, lng]`), titik duplikat dihapus, loop ditutup.
Jumlah titik < 1500 sehingga tidak disederhanakan.

| Rute | Titik | Panjang | Halte (arah putaran) | Satu putaran |
| --- | --- | --- | --- | --- |
| J1 Lingkar Luar | 67 | 2,537 km | pertanian → gsg → rektorat → fk → mipa → bundaran | ~14,5 menit |
| J2 Lingkar Dalam | 73 | 1,819 km | perpus → rektorat | ~9 menit |

Setiap halte diproyeksikan ke garis rute dengan `turf.nearestPointOnLine`; koordinat
halte di `mock/data/stops.ts` digeser ke titik terdekat di rute (marker tepat di atas
garis). **Peringatan jarak koreksi > 25 m:** FK 456 m, Perpus 352 m, Bundaran 156 m,
MIPA 103 m, Pertanian 87 m, GSG 62 m, Rektorat 44 m. Artinya rute hasil tracing belum
menjangkau gedung FK/Perpus; perlu tracing ulang atau penyesuaian titik halte.

### Uji mesin di konsol

Uji dilakukan dengan memuat modul engine asli lewat Vite SSR lalu menjalankan
`tickOnce()`. Hasil pada geometri baru: J1 = 67 titik / 2,537 km, J2 = 73 titik /
1,819 km; proyeksi halte ke rute ~0 m; satu putaran J1 ~14,5 menit (target 12–18);
ETA ke tiap halte terisi berurutan. Tab *Simulasi* di `/dev` juga mencetak
`console.table` posisi bus tiap 3 detik.

## Asumsi

1. **Tahap** — tahap 8B memakai editor Leaflet desktop responsif; panel demo (9)
   dan QA penuh (10) belum dikerjakan.
2. **Koordinat** — titik halte asli diverifikasi lewat OpenStreetMap/Nominatim, lalu
   **diproyeksikan ke garis rute** (`turf.nearestPointOnLine`) sehingga marker halte
   tepat di atas rute. Jarak koreksi > 25 m dilaporkan di `mock/data/stops.ts`
   (terbesar: FK 456 m, Perpus 352 m); hal ini karena rute tracing belum menjangkau
   kedua gedung tersebut.
3. **Geometri rute** — memakai hasil tracing `docs/data/jalur*.geojson` apa adanya
   (bukan lagi spline Catmull-Rom). Titik duplikat berurutan dihapus, loop ditutup,
   dan panjang/ETA dihitung ulang dari geometri tersebut.
4. **React 19** — mengikuti scaffold bawaan (BRIEF menyebut React 18).
5. **Sinkronisasi antar tab** — engine hanya berjalan di tab "leader" (dipilih via
   heartbeat `localStorage` + id tab `sessionStorage`, sehingga reload tab yang sama
   langsung mengambil alih); tab lain menerima posisi lewat `BroadcastChannel`.
   Perintah supir (`bus:control`) disiarkan agar tab leader ikut menerapkan.
6. **Posisi penggerak** — pada mode mock posisi bus digerakkan mesin simulasi, bukan
   GPS asli; endpoint `/tracking/location` hanya mengembalikan posisi saat ini.
7. **Penyimpanan** — hasil CRUD admin (bus, akun, PIN, rute, dan halte) dipersistensi
   pada satu key `localStorage` ber-versi `bus-unila:demo-data:v1` (`src/mock/db.ts`);
   data awal `mock/data/routes.ts` dan `mock/data/stops.ts` tidak pernah ditulis ulang.
   Tombol Reset Data Demo menghapus key tersebut dan kembali ke seed. Sesi login supir
   dan admin disimpan di `localStorage` (key terpisah), sedangkan posisi pengguna,
   pengingat, jejak bus, aktivitas, dan latensi hanya di memori.
8. **Gateway WebSocket** — `wsGateway` masih stub (throw) sampai backend tersedia.
9. **Detail bus** — daftar halte ditampilkan lengkap per rute (tidak dikelompokkan
   seperti contoh "FMIPA • GSG" pada gambar) agar status Lewat/Berikutnya/+mnt jelas.
10. **Mode skematik** — blok bangunan memakai koordinat nyata namun bentuk/ukuran
    masih dekoratif (bukan jejak denah OSM).
11. **Ukuran bundle** — `vite build` memunculkan peringatan chunk > 500 kB
    (Leaflet + Turf). Fungsional; code-splitting direncanakan pada tahap polesan (9).
12. **Verifikasi viewport** — screenshot memakai Playwright (Chromium) pada viewport
    persis 390x844 dan 1280x800; artefak di `docs/screenshots/`.
13. **Simulator supir vs data awal** — bus 01 sudah `ACTIVE` sejak data dummy (agar
    peta publik langsung hidup). Panel `/driver` tetap menampilkan *Standby* setelah
    login dan `START TRACKING` akan memulai ulang posisi bus; status panel mengikuti
    aksi sesi supir, bukan status awal data.
14. **Sinyal putus** — status "putus" disimulasikan di dalam mesin (`bus:signal`)
    karena tidak ada GPS/backend asli. Durasi default 20 detik; marker publik jadi
    abu + label waktu pembaruan terakhir.
15. **`/demo` memaksa leader** — route `/demo` memaksa tab menjadi leader agar mesin
    berjalan di tab yang sama dengan peta publik (jalur presentasi). Bila dibuka
    bersamaan dengan tab leader lain, bisa terjadi dua penggerak; untuk presentasi
    cukup buka `/demo` di satu tab.
16. **Playwright sebagai devDependency** — ditambahkan khusus untuk verifikasi
    screenshot/skenario (diminta pada instruksi tahap 7). Tidak memengaruhi runtime
    aplikasi. Perintah: `npx playwright test`.
17. **Field `active` pada `Bus`** — ditambahkan agar toggle aktif/nonaktif admin
    terpisah dari status live (`ACTIVE`/`STANDBY`/`OFFLINE`). Bus nonaktif
    dikeluarkan dari mesin simulasi sehingga marker-nya hilang di peta publik.
18. **Sesi admin terpisah** — key `localStorage` berbeda dari sesi supir; akun
    role `DRIVER` ditolak saat login di `/admin`.
19. **Geofence kampus** — poligon transparan di Monitor admin dihitung sebagai
    *convex hull* titik geometri rute (bukan batas administratif resmi kampus).
20. **Jejak bus** — disimpan di memori `useSimStore` dengan jendela 5 menit dan
    batas 200 titik per bus (hanya untuk tampilan Monitor).
21. **Data dashboard** — grafik penumpang/jam & perjalanan/hari memakai data
    dummy deterministik (fungsi tersegel, bukan `Math.random`); uptime 99,2%
    dummy. Latensi data dihitung nyata dari selisih `Date.now()` dengan timestamp
    event `bus:position` (jitter simulasi 0–1,5 dtk).
22. **PIN akun** — disimpan di mock db (`src/mock/db.ts`), seed dari kredensial
    demo. Tambah akun & reset PIN menghasilkan PIN acak 6 digit yang ditampilkan
    sekali saja.
23. **Tema admin** — toggle menulis kelas `.dark`/`.light` pada `<html>` dan
    `localStorage` (`bus-unila:theme`); berlaku global saat berpindah halaman.
24. **TanStack Table v9** — memakai API `useTable` + `tableFeatures` (bukan
    `useReactTable` v8) sesuai versi yang terpasang.
25. **Channel `fleet:changed`** — channel realtime baru untuk menyiarkan daftar
    armada ke seluruh tab saat CRUD admin; mesin simulasi di tab leader ikut
    menyinkronkan runtime lewat channel ini.
26. **Anomali data halte** — pada satu titik saat pengerjaan, `mock/data/stops.ts`
    sempat berubah di luar perubahan tahap 8A (id `tj-*`) sementara
    `mock/data/routes.ts` belum disesuaikan, sehingga pemetaan rute↔halte kosong.
    File dikembalikan ke versi HEAD (konsisten) agar fitur tetap berjalan; editor
    rute/halte (8B) belum dikerjakan.
