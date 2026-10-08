# Sistem Pelacak Bus Universitas Lampung

## Pendahuluan

Transportasi internal kampus seperti Bus Tayo Universitas Lampung (Unila) merupakan salah satu sarana vital yang dimanfaatkan oleh mahasiswa antar-fakultas maupun fasilitas kampus. Meskipun bermanfaat, mahasiswa sering kali menghadapi kendala efisiensi waktu akibat ketidakpastian jadwal kedatangan bus, posisi armada secara real-time, serta kapasitas penumpang yang tersedia. Penantian di halte tanpa kepastian waktu sering kali menyebabkan keterlambatan masuk kelas.

Untuk mengatasi permasalahan tersebut, kami ingin membuat sebuah Sistem Pelacak Bus Kampus Unila berbasis web dan mobile. Sistem ini dirancang untuk menyajikan informasi pemetaan jalur, lokasi Bus Tayo secara presisi dan real-time, status ketersediaan kursi (kosong/penuh), hingga estimasi waktu kedatangan. Dengan tersedianya platform digital ini, mahasiswa dapat merencanakan mobilitas harian mereka di lingkungan kampus secara lebih efektif, terstruktur, dan efisien.

## Hasil Observasi dan Survey

- Hasil Observasi Menunjukkan bahwa para mahasiswa risau menunggu kepastian dari kedatangan bus
- Hasil Observasi Menunjukkan bahwa para mahasiswa risau menunggu kepastian dari kedatangan bus
- Hasil Survey: 27 Jawaban, dari seluruh fakultas. Dibuktikan sangat membantu. Highlight Fitur :Peta Lokasi Presisi, Estimasi Sisa Waktu Kedatangan, Notifikasi Otomatis, Status Operasional

## Kebutuhan Fungsional

1. Latensi pengiriman dan pembaruan data koordinat lokasi dari mobile hingga tampil di web tidak boleh lebih dari 3–5 detik.
2. Sistem web publik dapat dia
3. Akses 24/7 dengan batas minimal uptime 95% selama jam operasional kampus.Antarmuka (UI) Web Publik dirancang responsif agar nyaman diakses baik melalui smartphone (browser HP) maupun laptop/PC.
4. Autentikasi berbasis peranan (Role-based Authentication) menggunakan JWT/Session untuk membatasi akses Web Admin dan Aplikasi Supir agar tidak bisa diakses publik.
5. Aplikasi driver memiliki penanganan toleransi sinyal (graceful handling) ketika koneksi internet supir sempat terputus secara tidak sengaja di area blank spot.

## Tugas Kamu

Membuat mockup website yang berisi tampilan awal untuk web publik dan admin dengan data dummy yang siap terhubung ke API. Menggunakan ReactJS, Leaflet (dengan peta Unila yang di custom agar ada bus dan rutenya). Buat agar seolah olah petanya hidup, bus nya bergerak, rutenya ada.

Web publik (peta leaflet dan OpenStreetMap)
Web admin (kelola bus dan rute)
Fokus utama kamu adalah membuat mockup frontend untuk web publik dan admin semirip mungkin dengan kondisi saat aplikasinya sudah launching (bus bergerak, bisa dipencet, rute dinamis, perkiraan bus sampai di halte tertentu di posisi user tertentu).

## Diagram Arsitektur Sistem

Sistem Pelacak Bus Unila mengusung arsitektur 3-Tier yang mengintegrasikan aplikasi mobile supir (Android/Kotlin dengan fitur offline queue), Web Publik mahasiswa untuk pemantauan peta dan estimasi kedatangan secara real-time, serta Web Admin pengelola. Sektor backend mengombinasikan REST API dengan WebSocket untuk menyiarkan koordinat bus berlatensi 3–5 detik setelah melalui validasi geofencing. Seluruh data tersimpan terpusat di basis data PostgreSQL dan dioptimalkan dengan cache Redis agar sistem tetap cepat dan responsif. [Semoga dapat membantu, namun ini hanya sebagai patokan, untuk sekarang fokus ke frontend dulu saja]

## Use Case Diagram

Sistem pelacak bus Unila
• Mahasiswa
• Lihat posisi bus real-time
• Lihat rute/jalur bus
• Lihat detail & kapasitas bus
• Lihat estimasi kedatangan
• Supir
• Login supir
• Start/stop tracking GPS
• Ubah status kapasitas
• Admin
• Login admin
• Kelola rute bus
• Kelola akun supir/admin

## Sequence Diagram

Komponen / Aktor (Bagian Atas)

• App supir (Aplikasi Pengemudi)
• REST API
• Tracking service (Layanan Pelacakan)
• Database
• Realtime gateway (Gerbang Waktu Nyata)
• Web publik

Alur Proses Pembuka (Login & Inisialisasi)

1. App supir mengirim pesan ke REST API: "Login (username, password)"
2. REST API mengirim pesan ke Database: "Cek kredensial"
3. REST API mengirim respon ke App supir: "JWT token"
4. REST API mengambil data dari Database: "Ambil rute, halte, daftar bus"
5. REST API meneruskan data ke Web publik: "Data statis"
6. Web publik terhubung ke Realtime gateway: "Subscribe channel bus"
7. App supir mengirim perintah ke Tracking service: "Start tracking"

Proses Perulangan: loop Setiap ±3 detik

Di dalam perulangan ini terdapat kondisi percabangan (alt):
• Aktivitas Rutin Utama:
• App supir mengirim data ke Tracking service: "Kirim lat, lng, timestamp"
• Kondisi 1: [Dalam area kampus] 1. Tracking service menyimpan data ke Database: "Simpan lokasi" 2. Tracking service memproses data secara internal: "Hitung ETA ke halte" 3. Tracking service meneruskan data ke Realtime gateway: "Teruskan lokasi + ETA" 4. Realtime gateway menyiarkan data ke Web publik: "Broadcast posisi" 5. Web publik memperbarui tampilan secara internal: "Gerakkan marker"
• Kondisi 2: [Di luar area kampus] 1. Tracking service memberikan respon balik ke App supir: "Abaikan lokasi"

Alur Pembaruan Status Kapasitas

1. App supir mengirim perintah ke Tracking service: "Toggle status Penuh"
2. Tracking service memperbarui data di Database: "Update capacityStatus"
3. Tracking service meneruskan data ke Realtime gateway: "Teruskan status"
4. Realtime gateway menyiarkan data ke Web publik: "Broadcast kapasitas"

Alur Proses Penutup (Offline / Berhenti)

1. Catatan Kondisi (Kotak Oranye): "Sinyal putus: lokasi masuk antrean lokal"
2. App supir mengirim data ke Tracking service: "Kirim batch lokasi saat online"
3. App supir mengirim perintah ke Tracking service: "Stop tracking"
4. Tracking service memperbarui status di Database: "Bus nonaktif"
5. Tracking service mengirim instruksi ke Web publik: "Hapus marker bus"
