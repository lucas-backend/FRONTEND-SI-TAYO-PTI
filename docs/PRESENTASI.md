# Panduan Presentasi Mockup Sistem Pelacak Bus Unila

> **Status isi:** panduan ini membedakan fakta yang terlihat di mockup, simulasi
> frontend, dan rencana menuju produksi. Bagian konteks presentasi yang masih
> berupa placeholder harus diisi pemilik proyek sebelum tampil.

## 1. Ringkasan

**Pesan inti:** mockup ini mengubah pengalaman menunggu Bus Tayo dari menebak
menjadi melihat posisi, rute, kapasitas, dan estimasi pada satu alur yang
terhubung dengan simulator supir dan panel admin.

Tiga hal yang perlu diingat audiens:

1. Web publik memperlihatkan peta rute, bus, halte, kapasitas, dan ETA.
2. Aksi supir di `/driver` atau `/demo` langsung menjadi bukti visual di peta.
3. Admin dapat memantau armada dan mengelola rute/halte, sementara backend asli
   masih merupakan tahap berikutnya.

**Kalimat pembuka:** “Hari ini kita tidak hanya menunjukkan peta bus; kita
menunjukkan bagaimana satu keputusan supir terlihat oleh penumpang dan admin
dalam satu alur.”

**Perlu dikonfirmasi pemilik proyek:** durasi presentasi dan tanya jawab,
profil audiens, format layar/internet, jumlah penyaji dan pembagian peran,
serta pilihan bahasa/gaya akhir. Rencana waktu di bawah memakai contoh **7
menit presentasi + 3 menit tanya jawab**, satu penyaji, Bahasa Indonesia.

## 2. Alur presentasi per adegan

### Kode risiko waktu

- **[RISIKO]** bergantung pada interaksi, state demo, atau tile peta. Uji
  sebelum tampil dan jangan memaksakan percobaan kedua ketika waktu sempit.
- **[AMAN]** cukup dijelaskan dengan slide atau tangkapan layar.
- Jika waktu tinggal separuh, **persingkat adegan yang bertanda [AMAN]**:
  adegan 1 menjadi 20 detik, adegan 6 menjadi 20 detik, dan lewati detail
  editor rute. Pertahankan bukti `/demo` dan satu layar admin.

| Waktu | Layar/URL | Langkah klik berurutan | Naskah ucapan siap baca | Bukti yang harus tampak | Jalan keluar bila macet |
|---|---|---|---|---|---|
| 0:00–0:45 **[AMAN]** | Slide masalah dan hasil survei | Tidak ada klik. Tampilkan slide 1. | “Masalah yang kami angkat sederhana tetapi berulang: mahasiswa menunggu tanpa kepastian posisi dan kedatangan bus. Brief mencatat 27 responden dari seluruh fakultas menilai solusi ini sangat membantu. Empat fitur unggulan yang kami bawa ke mockup adalah Peta Lokasi Presisi, Estimasi Sisa Waktu Kedatangan, Notifikasi Otomatis, dan Status Operasional.” | Angka **27 responden** dan empat nama fitur, persis dari brief; jangan menambah persentase atau klaim performa survei. | Jika slide gagal, ucapkan ringkasannya dan langsung buka `/`. |
| 0:45–2:00 **[RISIKO]** | Web publik `/` | 1) Pastikan peta selesai render. 2) Klik **Jalur 1** atau **Jalur 2**. 3) Klik marker/label bus, misalnya **Bus 02 • BE 2110 UZ**, atau kartu **Lihat Bus 02 BE 2110 UZ**. 4) Klik salah satu label halte seperti **Titik Jemput Rektorat** untuk mengubah target ETA. 5) Tunjukkan badge kapasitas, ETA, jarak, kecepatan, dan daftar halte. | “Di web publik, penumpang langsung melihat jalur yang aktif dan jumlah bus yang beroperasi. Saya pilih satu bus; detailnya membuka kapasitas, kecepatan, halte berikutnya, dan hitung mundur ETA. Halte juga dapat dipilih sebagai target, sehingga pertanyaannya bukan hanya ‘bus ada di mana’, tetapi ‘kapan bus ini sampai ke halte saya’.” | Header **BUS UNILA**, tab **Peta Rute**, **Jadwal Halte**, **Armada**, **Civitas**, segmented **Jalur 1/Jalur 2**, peta OSM, marker bus, kartu detail. | Bila tile OSM belum muncul, tetap tunjukkan panel dan label halte; aktifkan **Mode skematik peta** (tombol dengan label **U**) atau gunakan tangkapan layar `public-peta-1280x800.png`. |
| 2:00–2:45 **[RISIKO]** | Web publik `/`, posisi pengguna | 1) Buka **Panel demo** bila belum tampak dengan **Shift+D**. 2) Klik **Dekat FMIPA**, **Dekat Perpus**, atau **Dekat FK**. 3) Kembali lihat chip halte terdekat dan kartu **Bus tercepat untuk Anda**, bila muncul. 4) Alternatif jalur UI: klik **Lokasi Saya** dan izinkan lokasi; bila ditolak, ikuti tawaran **Posisi Simulasi**. | “Fitur personal menjawab kebutuhan yang lebih praktis: dari posisi pengguna, halte mana yang terdekat dan bus mana yang paling cepat. Mockup menyediakan preset posisi simulasi agar skenario dapat diulang tanpa bergantung pada GPS laptop. Waktu jalan kaki dan ETA ditampilkan sebagai bantuan keputusan, bukan janji kedatangan produksi.” | Chip **Halte terdekat: ...**, kartu **Bus tercepat untuk Anda**, garis putus-putus dari posisi pengguna ke halte, atau dialog/opsi **Posisi Simulasi**. | Pada sesi uji preview ini, klik preset tidak menampilkan chip personal secara konsisten; jangan mengarang angka. Katakan “perlu dikonfirmasi pemilik proyek”, lalu lanjutkan dengan slide/tangkapan `demo-4-lokasi-saya-390x844.png`. |
| 2:45–4:00 **[RISIKO]** | `/demo` (satu tab) atau `/driver` + `/` | Skenario `/demo`: 1) Klik **Reset Data Demo** dan konfirmasi. 2) Pada ponsel, isi **ID Pengemudi** `DRV-19842` dan **PIN Akses** `123456`. 3) Klik **Login**. 4) Klik **Start Tracking**. 5) Klik **Penuh**. 6) Amati peta: bus aktif, badge berubah, dan sisa kursi berubah. 7) Klik **Simulasikan Sinyal Putus**. 8) Tunggu kira-kira 20 detik sampai pemulihan; amati banner antrean dan pemulihan. | “Sekarang kita pindah ke sudut pandang supir. Setelah login, tombol Start Tracking membuat bus masuk ke peta; status Penuh dipantulkan ke penumpang. Saat sinyal diputus, aplikasi tidak langsung kehilangan perjalanan: lokasi masuk antrean lokal, lalu dikirim kembali ketika koneksi pulih.” | Ponsel menampilkan **Panel Pengemudi**, **GPS Aktif**, **Transmisi Sinyal Setiap 3 Detik • Akurasi 2m**, **Penuh**, lalu **Sinyal putus: lokasi masuk antrean lokal (...)** dan pesan pemulihan. | Jika `/demo` memuat sesi lama, klik **Reset Data Demo**; jika tombol belum merespons, tunggu sampai halaman selesai render. Jika pemulihan belum terlihat, gunakan `demo-6-sinyal-putus-1280x800.png` dan `demo-6-pemulihan-1280x800.png`. |
| 4:00–5:30 **[RISIKO]** | `/admin/login` lalu `/admin/*` | 1) Buka `/admin/login`. 2) Isi **Nama Pengguna** `admin`, **Kata Sandi** `admin123`. 3) Klik **Masuk**. 4) Tunjukkan **Dashboard**. 5) Klik **Monitor Langsung**, pilih/filter **Semua**, **Jalur 1**, atau **Jalur 2**, lalu klik kartu bus. 6) Klik **Armada**; tunjukkan **Tambah Bus**, pencarian/filter, switch aktif, ubah/hapus. 7) Klik **Rute & Halte**; pilih **Edit rute** bila perlu. 8) Di editor, tunjukkan **Gambar rute**, **Tambah halte**, **Undo**, **Redo**, **Tutup loop**, **Pasang ke jalan**, dan **Simpan**. | “Panel admin memperlihatkan operasional dari sisi pengelola: ringkasan dashboard, monitor langsung, dan armada. Pada Rute & Halte, rute dapat digambar serta halte dapat ditambah dan diurutkan. Perubahan data demo memakai lapisan yang sama, sehingga efeknya dapat terlihat kembali pada peta publik; ini tetap simulasi frontend, bukan perubahan database produksi.” | Sidebar **Dashboard**, **Monitor Langsung**, **Armada**, **Rute & Halte**, **Akun**; kartu statistik; daftar bus; editor peta dan tombol-tombolnya. | Jika login tidak berpindah setelah klik, pastikan halaman selesai render lalu tekan Enter pada field **Kata Sandi**. Jika editor terlalu berisiko, cukup tunjukkan daftar rute dan gunakan `admin-dashboard-1280x800.png`, `admin-monitor-1280x800.png`, `admin-armada-1280x800.png`, dan `admin-rute-halte-1280x800.png`. |
| 5:30–6:30 **[AMAN]** | Slide arsitektur target | Tidak ada klik aplikasi; tampilkan diagram/slide 6. | “Yang sudah dibangun adalah kontrak frontend dan mock gateway: UI mengambil data melalui store/hooks, API mock, dan realtime gateway. Target produksinya adalah aplikasi Android supir dengan antrean offline, REST API dan WebSocket, PostgreSQL serta Redis, lalu web publik dan admin. Langkah berikutnya adalah mengganti sumber mock dengan backend yang memenuhi kontrak yang sama, melakukan uji lapangan, keamanan, dan validasi operasional.” | Diagram **App supir → REST API/WebSocket → PostgreSQL/Redis → Web publik/Web admin**; label “sudah ada”, “simulasi”, dan “rencana”. | Jika diagram gagal tampil, baca tiga lapisan tersebut dan tutup dengan batasan bahwa backend belum terhubung. |
| 6:30–7:00 | Penutup | Kembali ke slide judul atau `/`. | “Jadi, nilai mockup ini bukan hanya tampilan peta, melainkan alur lintas peran yang dapat dicoba: penumpang melihat, supir mengirim status, dan admin mengelola. Kami sengaja memisahkan fakta yang sudah berjalan dari simulasi dan rencana produksi. Setelah ini kami siap menjelaskan akurasi ETA, keamanan, dan jalur implementasinya.” | Tiga peran dan tiga status: publik, supir, admin. | Lewati demo tambahan dan langsung masuk tanya jawab. |

### Skenario reset yang disarankan

Untuk demo yang deterministik, buka `/demo`, klik **Reset Data Demo**, set
kecepatan **1x**, lalu mulai hanya satu bus dari panel ponsel. Panel demo juga
menyediakan **Jeda semua bus**, **+ Bus J1**, **+ Bus J2**, pilihan **Bus
 sasaran**, **Tersedia**, **Penuh**, **Putus 20 dtk**, **Keluar area**,
**Hentikan bus**, dan preset **Dekat FMIPA**, **Dekat Perpus**, **Dekat FK**.
Panel dapat disembunyikan/ditampilkan dengan **Shift+D**.

## 3. Kerangka slide pendukung (maksimal 6 slide)

1. **Mengapa pelacakan bus diperlukan**
   - Mahasiswa menunggu tanpa kepastian posisi dan waktu kedatangan.
   - Target pengalaman: posisi, ETA, kapasitas, dan status operasional.
   - **27 responden** dari seluruh fakultas, sesuai brief.
   - Saran visual: `public-peta-1280x800.png`.
2. **Empat fitur unggulan**
   - Peta Lokasi Presisi.
   - Estimasi Sisa Waktu Kedatangan.
   - Notifikasi Otomatis.
   - Status Operasional.
   - Saran visual: `public-detail-bus-390x844.png` dan `demo-4-lokasi-saya-390x844.png`.
3. **Satu alur penumpang–supir**
   - Penumpang memilih jalur dan tap bus.
   - Supir login, **Start Tracking**, dan memilih **Penuh**.
   - Peta publik menerima perubahan status.
   - Saran visual: `driver-1-login-390x844.png`, `driver-2-standby-390x844.png`, `driver-3-tracking-390x844.png`.
4. **Toleransi sinyal**
   - **Simulasikan Sinyal Putus**.
   - Lokasi masuk antrean lokal.
   - Koneksi pulih dan antrean dikirim.
   - Saran visual: `demo-6-sinyal-putus-1280x800.png` dan `demo-6-pemulihan-1280x800.png`.
5. **Web admin**
   - Dashboard dan **Monitor Langsung**.
   - **Kelola Armada** dan status aktif.
   - **Rute & Halte** dengan editor peta.
   - Saran visual: `admin-dashboard-1280x800.png`, `admin-monitor-1280x800.png`, `admin-armada-1280x800.png`, `admin-rute-halte-1280x800.png`.
6. **Fakta, simulasi, rencana**
   - Sudah ada: UI React/Vite, peta Leaflet/OSM, store, mock API, mock gateway.
   - Simulasi: GPS, ETA, login/JWT, offline queue, data CRUD.
   - Rencana: backend, WebSocket/REST produksi, database, uji lapangan.
   - Saran visual: `demo-tracking-1280x800.png` dengan tiga label warna.

Semua nama berkas di atas ada di `docs/screenshots/` pada repository ini.

## 4. Persiapan H-1 dan 30 menit sebelum tampil

### H-1

- [ ] Isi placeholder konteks presentasi: durasi, audiens, format, penyaji,
      dan keputusan gaya bahasa.
- [ ] Jalankan `npm run build` sampai sukses.
- [ ] Jalankan `npm run preview -- --host 127.0.0.1`; uji URL lokal yang
      dipakai, default `http://127.0.0.1:4173`.
- [ ] Uji `/`, `/demo`, `/driver`, `/admin/login`, `/admin/dashboard`,
      `/admin/monitor`, `/admin/armada`, `/admin/rute`, dan `/admin/akun`.
- [ ] Uji login supir **DRV-19842 / 123456** dan admin **admin / admin123**.
- [ ] Uji **Reset Data Demo**, **Panel demo**, shortcut **Shift+D**, **Penuh**,
      **Simulasikan Sinyal Putus**, dan **STOP/Stop Tracking**.
- [ ] Siapkan jendela terpisah untuk login admin dan supir bila memakai dua
      tab; `/demo` dapat dipakai bila hanya satu tab.
- [ ] Pastikan screenshot cadangan tersedia lokal, bukan hanya di repository.
- [ ] Pastikan browser mengizinkan pop-up/geolocation bila adegan posisi
      pengguna akan ditampilkan.

### 30 menit sebelum tampil

- [ ] Jalankan build/preview sekali lagi dan buka URL preview.
- [ ] Klik **Reset Data Demo** dari panel demo dan mulai dari state bersih.
- [ ] Pastikan login admin dan supir siap di jendela terpisah atau gunakan
      `/demo`.
- [ ] Atur zoom browser dan ukuran jendela agar peta, ponsel, dan panel tidak
      bertumpuk; uji mode fullscreen.
- [ ] Matikan notifikasi sistem dan aplikasi lain.
- [ ] Pastikan baterai cukup dan charger terpasang.
- [ ] Pastikan koneksi internet kampus tersedia untuk tile OpenStreetMap.
- [ ] Siapkan rekaman layar/screenshot sebagai cadangan.
- [ ] Pastikan penyaji tahu bahwa teks **GPS Aktif** di aplikasi adalah bagian
      dari simulator, bukan bukti GPS perangkat nyata.

## 5. Rencana cadangan

| Bila X terjadi | Lakukan Y |
|---|---|
| Internet mati atau tile peta tidak muncul | Tunggu sebentar; klik **Mode skematik peta** (tombol **U**) untuk menyembunyikan ketergantungan tile. Bila tetap gagal, jelaskan marker/panel memakai data mock dan tampilkan `public-peta-1280x800.png`. |
| Bus tidak bergerak atau membeku | Pastikan bus sudah **Start Tracking**, pilih **1x/2x/5x** di Panel demo, dan jangan aktifkan **Jeda semua bus**. Jika state kacau, klik **Reset Data Demo**, login ulang, lalu mulai tracking lagi. |
| Tab di latar belakang | Kembalikan tab ke foreground dan tunggu satu tick simulasi. Untuk menghindari sinkronisasi lintas tab, gunakan `/demo` satu tab. |
| Login gagal | Periksa persis `DRV-19842` + `123456` atau `admin` + `admin123`; klik **Lihat**/**LIHAT** untuk memeriksa PIN. Bila sesi lama mengganggu, refresh atau reset demo; jangan menyebut login produksi. |
| Data demo kacau | Klik **Reset Data Demo**, konfirmasi dialog “Reset semua perubahan data demo?”, tunggu render, lalu mulai urutan dari awal. |
| Layar proyektor tidak cocok | Gunakan fullscreen, kecilkan zoom browser, pindahkan panel demo agar tidak menutupi bukti, atau tampilkan screenshot ukuran 1280×800. |
| Waktu tersisa setengah | Lewati detail editor dan personalisasi lokasi. Tampilkan tiga bukti: peta publik, `/demo` Start Tracking + Penuh, dan dashboard admin. Gunakan naskah adegan yang bertanda **[AMAN]**. |
| Klik belum merespons | Tunggu lazy-loaded halaman selesai render sebelum klik berikutnya. Pada uji preview, klik otomatis terlalu cepat dapat timeout meskipun kontrol kemudian bisa dipakai; lanjutkan hanya setelah label layar terlihat. |

## 6. Tanya jawab

| Pertanyaan | Jawaban singkat dan jujur |
|---|---|
| Apakah GPS yang terlihat ini asli? | Tidak. Posisi bus digerakkan mesin simulasi frontend. **GPS Aktif** adalah label pada simulator, bukan pembacaan GPS perangkat. |
| Bagaimana ETA dihitung? | Mockup menghitung ETA dari posisi bus simulasi, jalur/halte, jarak geometris, dan kecepatan simulasi. Formula backend produksi, traffic, dan kalibrasi lapangan belum dibangun. |
| Apakah ETA akurat 3–5 detik? | Brief menargetkan latensi koordinat 3–5 detik untuk arsitektur target; mockup tidak membuktikan akurasi produksi atau SLA tersebut. |
| Bagaimana sinyal putus ditangani? | Tombol **Simulasikan Sinyal Putus** membuat lokasi masuk antrean lokal, lalu mockup menampilkan pemulihan dan pengiriman antrean setelah koneksi kembali. Offline queue produksi belum ada. |
| Apa arti **Penuh**? | Itu perubahan status kapasitas pada data mock; badge dan sisa kursi di layar publik ikut berubah. Belum terhubung ke sensor kursi atau backend produksi. |
| Apakah login aman? | Yang ada adalah login mock dengan sesi lokal dan JWT palsu untuk role `DRIVER`/`ADMIN`. HTTPS, hashing, rotasi token, audit, dan IAM produksi belum diverifikasi. |
| Apakah role benar-benar membatasi akses? | Mockup memiliki guard role untuk rute admin dan supir. Mekanisme otorisasi server produksi belum ada karena backend belum tersambung. |
| Apakah bisa menampung banyak pengguna? | Belum bisa diklaim. Skalabilitas belum diuji; kapasitas pengguna, beban WebSocket, PostgreSQL, Redis, dan biaya harus dihitung pada tahap backend. |
| Perangkat apa yang dibutuhkan supir? | Mockup hanya mensimulasikan layar Android di browser. Perangkat Android, GPS, aplikasi Kotlin, mode hemat baterai, dan MDM adalah kebutuhan rencana produksi. |
| Bagaimana privasi data lokasi? | Mockup tidak menetapkan kebijakan retensi, persetujuan, atau anonimisasi produksi. Itu harus dirancang bersama pemilik data dan UPT TIK. |
| Apa bedanya dengan Google Maps? | Fokusnya adalah operasi Bus Unila: rute internal, halte kampus, kapasitas, status armada, dan alur admin/supir. Ini bukan pengganti navigasi atau data lalu lintas Google Maps. |
| Apakah notifikasi sudah nyata? | Notifikasi halte adalah mock state/toast dan dapat memakai Notification API bila diizinkan browser; layanan push produksi belum ada. |
| Bagaimana perubahan admin masuk ke peta publik? | Pada mockup, store/API mock dan gateway menyebarkan perubahan ke UI lain, termasuk lintas tab melalui mekanisme demo. Sinkronisasi backend produksi masih rencana. |
| Bagaimana tersambung ke backend? | Flag `VITE_USE_MOCK=true` saat ini memakai mock. Kontrak endpoint dan gateway sudah disiapkan; targetnya mengganti ke `VITE_USE_MOCK=false` serta `VITE_API_URL`/`VITE_WS_URL` ketika REST API/WebSocket tersedia. |
| Apa kontrak API-nya? | Brief mendefinisikan login, data routes/stops/buses, ETA, start/stop tracking, location, dan capacity. Implementasi saat ini masih client/mock dan `wsGateway` masih stub. |
| Apakah sudah memakai PostgreSQL dan Redis? | Belum. PostgreSQL dan Redis ada pada arsitektur target, bukan pada mockup yang dipresentasikan. |
| Berapa lama menuju produksi? | Belum ada estimasi resmi. Secara jujur, perlu backlog backend, aplikasi supir, keamanan, observability, uji geofence, uji lapangan, dan operasi; waktu dan sumber daya harus dikonfirmasi pemilik proyek. |
| Apakah hasil survei berarti semua mahasiswa setuju? | Tidak. Fakta yang tersedia hanya 27 jawaban dari seluruh fakultas dan pernyataan brief bahwa solusi dinilai sangat membantu. Tidak ada persentase atau metode survei rinci yang boleh ditambahkan. |
| Apakah editor rute langsung mengubah data produksi? | Tidak. Perubahannya adalah CRUD/persistensi demo frontend. Produksi memerlukan API, validasi server, audit, dan workflow persetujuan. |

## 7. Batas dan keterbatasan yang harus diakui

### Fakta yang sudah ada

- React/Vite/TypeScript strict, routing halaman publik, `/driver`, `/demo`, dan
  `/admin/*`.
- Peta Leaflet dengan tile OpenStreetMap, rute, halte, marker bus, detail bus,
  bottom navigation, tab jadwal/armada/civitas.
- Store/hooks, mock API, mock realtime gateway, simulator bus, state kapasitas,
  Panel demo, dan Reset Data Demo.
- Guard UI admin/supir dan editor rute/halte pada data demo.
- Build yang diuji pada sesi ini sukses dengan `npm run build`.

### Simulasi/mock

- GPS/posisi bus, kecepatan, ETA dan hitung mundur.
- Login, JWT, sesi lokal, offline queue, sinyal putus/pulih.
- Data CRUD admin dan efek perubahan lintas UI.
- Statistik dashboard seperti uptime dan latensi yang diberi konteks dummy.
- Preset posisi pengguna dan notifikasi.

### Rencana atau belum diverifikasi

- Backend REST/WebSocket, PostgreSQL, Redis, aplikasi Android Kotlin, geofencing,
  autentikasi produksi, SLA, keamanan, beban, biaya, dan uji lapangan.
- Akurasi ETA terhadap kondisi nyata, kualitas GPS, dan perilaku ketika tile
  OSM tidak tersedia.
- Pada uji preview ini, preset **Dekat FMIPA/Dekat Perpus/Dekat FK** tidak
  konsisten menampilkan chip personal; perlakukan sebagai **perlu dikonfirmasi
  pemilik proyek**.
- Klik otomatis pada beberapa kontrol lazy-loaded timeout bila dilakukan
  sebelum render selesai; penyaji harus menunggu label layar tampak.
- Koneksi dua tab melalui BroadcastChannel dan pemulihan sinyal perlu diuji
  ulang di laptop presentasi.

Cara menyampaikannya: “Yang kami demonstrasikan adalah perilaku frontend dan
kontrak alurnya. GPS, backend, keamanan produksi, dan angka operasional adalah
pekerjaan lanjutan; kami tidak menyamarkannya sebagai fitur yang sudah live.”

## 8. Lembar contekan satu halaman

### URL dan kredensial

- Publik: `http://127.0.0.1:4173/`
- Supir: `http://127.0.0.1:4173/driver`
- Demo satu tab: `http://127.0.0.1:4173/demo`
- Login admin: `http://127.0.0.1:4173/admin/login`
- Admin: `/admin/dashboard`, `/admin/monitor`, `/admin/armada`,
  `/admin/rute`, `/admin/akun`
- Supir: ID `DRV-19842`, PIN `123456`
- Admin: pengguna `admin`, kata sandi `admin123`

### Shortcut dan urutan klik

1. `/demo` → **Reset Data Demo** → konfirmasi.
2. Ponsel → isi **DRV-19842**, **123456** → **Login** → **Start Tracking**.
3. Klik **Penuh** → tunjukkan badge/sisa kursi di peta.
4. Klik **Simulasikan Sinyal Putus** → tunggu banner pulih.
5. Panel demo: **Shift+D**, **1x/2x/5x**, **Jeda semua bus**, preset lokasi.
6. Admin → **Masuk** → **Dashboard** → **Monitor Langsung** → **Armada** →
   **Rute & Halte**.

### Lima kalimat kunci

1. “Mockup ini menghubungkan kebutuhan penumpang, supir, dan admin dalam satu
   alur yang bisa dicoba.”
2. “Peta, ETA, kapasitas, dan status operasional adalah bukti pengalaman publik.”
3. “Start Tracking dan Penuh di simulator supir dipantulkan ke peta sebagai
   simulasi realtime.”
4. “Sinyal putus ditangani dengan antrean lokal pada mockup; backend produksi
   belum terhubung.”
5. “Kami memisahkan dengan jelas fakta yang sudah dibangun, simulasi frontend,
   dan rencana menuju sistem produksi.”

