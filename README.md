# Si-Tayo — Mockup Pelacak Bus Unila

Mockup frontend interaktif Sistem Pelacak Bus Universitas Lampung (web publik,
web admin, simulator supir). Spesifikasi lengkap: `docs/BRIEF.md`. Acuan visual:
`docs/design/`.

Status saat ini: **Tahap 1–5** dari urutan BRIEF bagian 16 sudah selesai.

| Tahap | Isi | Status |
| --- | --- | --- |
| 1 | Scaffold, token desain, komponen UI dasar | Selesai |
| 2 | Tipe data, data dummy (halte/rute/bus/user), verifikasi koordinat OSM | Selesai |
| 3 | Mesin simulasi + `mockGateway` + uji di konsol | Selesai |
| 4 | Peta publik (Leaflet+OSM, rute/halte/bus bergerak, header/segmented/nav, mobile+desktop) | Selesai |
| 5 | Bottom sheet detail bus (ETA countdown, daftar halte), tab Jadwal/Armada/Civitas, state loading/kosong/galat | Selesai |
| 6–10 | ETA personal (lokasi saya), simulator supir, admin, panel demo, QA | Belum |

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
- `/dev` — Lab Pengembangan (token, komponen, monitor simulasi + Reset Data Demo).
- `/driver`, `/admin/*` — placeholder tahap 7–8.

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
  store/      useSimStore.ts (bus/posisi/rute/halte + status gateway)
  hooks/      useSimulation.ts, useCountdown.ts
  features/public/
    PublicLayout.tsx, nav.ts
    map/      MapView, RouteLayer, StopLayer, BusLayer, BusMarker, SchematicLayer, icons
    components/  PublicHeader, BottomNav, RouteControls, MapHintToast, SchematicToggle,
                 ConnectionBanner, BusDetailContent, StopStatusList, BusCard, StateViews
    pages/    PublicMapPage, SchedulePage, FleetPage, CivitasPage
    hooks/    useRouteProjection.ts
    lib/      stopStatus.ts
  components/ui/  Button, Card, Chip, Badge, Toggle, SegmentedControl, Skeleton, Sheet, Toast
  lib/        geo.ts, format.ts, time.ts, cn.ts
  styles/     tokens.css, leaflet-overrides.css
  config.ts   konstanta simulasi + pengaturan peta
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
`bus:started`, `bus:stopped`, `gateway:status`. Implementasi aktif `mockGateway`
(in-memory + `BroadcastChannel`); `wsGateway` masih stub menuju `VITE_WS_URL`.

## Mesin Simulasi

`mock/simulator/engine.ts` berjalan sejak aplikasi dibuka (lewat `app/bootstrap.ts`
→ `runner.ts`): posisi sepanjang polyline (`turf.along`), kecepatan acak 18–32 km/jam
dengan perlambatan menjelang halte, dwell 15–30 detik, `tick` 3 detik + jitter 0–1,5
detik, heading dari `turf.bearing`, dan ETA ke semua halte. Skenario yang sudah ada:
sinyal putus (antrean offline + flush batch), keluar geofence (koordinat diabaikan
store), toggle Penuh, add/remove/reset bus, pengali kecepatan, dan pause.

### Uji mesin di konsol

Uji dilakukan dengan memuat modul engine asli lewat Vite SSR lalu menjalankan
`tickOnce()` (dipakai untuk menembak waktu simulasi tanpa menunggu timer). Hasil:
rute J1 = 133 titik / 3,483 km, J2 = 97 titik / 0,882 km; 800 event `bus:position`
dan 24 event `bus:capacity` tanpa galat; antrean offline 4 titik ter-flush saat
sinyal pulih; lifecycle `bus:started`/`bus:stopped` dan geofence berjalan benar.
Tab *Simulasi* di `/dev` juga mencetak `console.table` posisi bus tiap 3 detik.

## Asumsi

1. **Tahap** — yang dikerjakan tahap 1–5. ETA personal/"Lokasi Saya" (tahap 6),
   simulator supir (7), admin (8), panel demo (9), dan QA (10) belum.
2. **Koordinat** — titik halte Rujukan (Rektorat, Perpustakaan, FMIPA, FK, Pertanian)
   diverifikasi lewat OpenStreetMap/Nominatim. Halte **GSG** dan **Bundaran** belum
   punya node resmi di OSM sehingga masih perkiraan dan ditandai `TODO: verifikasi
   lapangan` di `mock/data/stops.ts`.
3. **Geometri rute** — path dibentuk dari titik kontrol + spline Catmull-Rom tertutup
   (halus, bukan garis lurus). Belum hasil tracing jalan penuh di OSM; ditandai TODO
   di `mock/data/routes.ts`.
4. **React 19** — mengikuti scaffold bawaan (BRIEF menyebut React 18).
5. **Sinkronisasi antar tab** — engine hanya berjalan di tab "leader" (dipilih via
   heartbeat `localStorage` + id tab `sessionStorage`, sehingga reload tab yang sama
   langsung mengambil alih); tab lain menerima posisi lewat `BroadcastChannel`.
6. **Posisi penggerak** — pada mode mock posisi bus digerakkan mesin simulasi, bukan
   GPS asli; endpoint `/tracking/location` hanya mengembalikan posisi saat ini.
7. **Penyimpanan** — belum ada persistensi CRUD admin; tombol Reset Data Demo
   membangun ulang runtime dari data dummy.
8. **Gateway WebSocket** — `wsGateway` masih stub (throw) sampai backend tersedia.
9. **Detail bus** — daftar halte ditampilkan lengkap per rute (tidak dikelompokkan
   seperti contoh "FMIPA • GSG" pada gambar) agar status Lewat/Berikutnya/+mnt jelas.
10. **Mode skematik** — blok bangunan memakai koordinat nyata namun bentuk/ukuran
    masih dekoratif (bukan jejak denah OSM).
11. **Ukuran bundle** — `vite build` memunculkan peringatan chunk > 500 kB
    (Leaflet + Turf). Fungsional; code-splitting direncanakan pada tahap polesan (9).
12. **Verifikasi viewport** — desktop dicek pada 1280px; mobile dirender pada 500px
    (batas minimum lebar window Chrome di Windows). Layout mobile memakai breakpoint
    `< 768px` yang sama untuk 390px, tanpa lebar tetap sehingga aman di 390px.
