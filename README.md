# Si-Tayo — Mockup Pelacak Bus Unila

Mockup frontend interaktif Sistem Pelacak Bus Universitas Lampung (web publik,
web admin, simulator supir). Spesifikasi lengkap: `docs/BRIEF.md`. Acuan visual:
`docs/design/`.

Status saat ini: **Tahap 1–3** dari urutan BRIEF bagian 16 sudah selesai.

| Tahap | Isi | Status |
| --- | --- | --- |
| 1 | Scaffold, token desain, komponen UI dasar | Selesai |
| 2 | Tipe data, data dummy (halte/rute/bus/user), verifikasi koordinat OSM | Selesai |
| 3 | Mesin simulasi + `mockGateway` + uji di konsol | Selesai |
| 4–10 | Peta publik, bottom sheet, ETA personal, simulator supir, admin, panel demo, QA | Belum |

## Menjalankan

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint
```

Halaman sementara:
- `/` — beranda placeholder + tautan ke lab.
- `/dev` — **Lab Pengembangan**: tab *Komponen* (token warna, tipografi, tombol,
  chip/badge/toggle/segmented, skeleton, toast, bottom sheet) dan tab *Simulasi*
  (kartu bus live + `console.table` posisi tiap 3 detik + tombol Reset Data Demo).
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
  app/        router, providers, bootstrap, halaman (PublicHome, DevShowcase, Placeholder)
  api/        types.ts, endpoints.ts, client.ts (flag mock)
  mock/
    data/     stops.ts, routes.ts, buses.ts, users.ts
    simulator/ engine.ts, eta.ts, instance.ts, runner.ts
  realtime/   gateway.ts (interface), mockGateway.ts, wsGateway.ts (stub)
  store/      useSimStore.ts (bus/posisi/rute/halte + status gateway)
  components/ui/  Button, Card, Chip, Badge, Toggle, SegmentedControl, Skeleton, Sheet, Toast
  lib/        geo.ts, format.ts, time.ts, cn.ts
  styles/     tokens.css, leaflet-overrides.css
  config.ts   konstanta simulasi + pengaturan peta
```

Tiga lapisan dipisah tegas: **UI → store/hooks → api/realtime**. Komponen tidak
mengimpor `src/mock` secara langsung; data masuk lewat store yang berlangganan
`api` dan `gateway`.

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

1. **Tahap** — hanya tahap 1–3 yang dikerjakan; sisanya menyusul sesuai urutan.
2. **Koordinat** — titik halte Rujukan (Rektorat, Perpustakaan, FMIPA, FK, Pertanian)
   diverifikasi lewat OpenStreetMap/Nominatim. Halte **GSG** dan **Bundaran** belum
   punya node resmi di OSM sehingga masih perkiraan dan ditandai `TODO: verifikasi
   lapangan` di `mock/data/stops.ts`.
3. **Geometri rute** — path dibentuk dari titik kontrol + spline Catmull-Rom tertutup
   (halus, bukan garis lurus). Belum hasil tracing jalan penuh di OSM; ditandai TODO
   di `mock/data/routes.ts`.
4. **React 19** — mengikuti scaffold bawaan (BRIEF menyebut React 18).
5. **Sinkronisasi antar tab** — engine hanya berjalan di tab "leader" (dipilih via
   heartbeat `localStorage`), tab lain menerima posisi lewat `BroadcastChannel`.
   Bila tab leader ditutup, tab lain mengambil alih.
6. **Posisi penggerak** — pada mode mock posisi bus digerakkan mesin simulasi, bukan
   GPS asli; endpoint `/tracking/location` hanya mengembalikan posisi saat ini.
7. **Penyimpanan** — belum ada persistensi CRUD admin; tombol Reset Data Demo
   membangun ulang runtime dari data dummy.
8. **Gateway WebSocket** — `wsGateway` masih stub (throw) sampai backend tersedia.
