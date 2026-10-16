**TUGAS KELOMPOK MATA KULIAH PROYEK TEKNOLOGI INFORMASI**  
**ANALISIS KEBUTUHAN SISTEM PELACAK BUS KAMPUS UNIVERSITAS**  
**LAMPUNG BERBASIS WEB DAN MOBILE**

   
 ![][image1]

Disusun Oleh:  
 I Made Dipa Rama Artike 		(2415061001)  
Bintang Prastyo Kusumo Wicaksono (2455061007)  
Rio Gunawan 				(2415061092)  
Yostiar Aminudin 			(2415061016)  
Rizky Novrizal 			(2415061021)  
   
Kelas : PTI-C  
 Kelompok 3  
   
**PROGRAM STUDI TEKNIK INFORMATIKA**  
 **FAKULTAS TEKNIK**  
 **UNIVERSITAS LAMPUNG**  
 **BANDAR LAMPUNG**  
 **2026**  
**BAB I**

# **PENDAHULUAN**

## **1.1 Latar Belakang**

   
Transportasi internal kampus merupakan salah satu sarana vital bagi mahasiswa, dosen, dan staf dalam berpindah antar-fakultas maupun fasilitas kampus. Di lingkungan Universitas Lampung (Unila), layanan tersebut diwujudkan melalui Bus Tayo yang melayani mobilitas harian sivitas akademika. Keberadaan bus kampus sangat membantu, terutama pada jam-jam padat perkuliahan ketika mahasiswa harus berpindah dari satu fakultas ke fakultas lain dalam waktu singkat.  
   
Namun, pemanfaatan Bus Tayo saat ini masih menghadapi kendala efisiensi waktu. Mahasiswa tidak memiliki kepastian mengenai jadwal kedatangan bus, posisi armada secara *real-time*, serta kapasitas penumpang yang masih tersedia. Penantian di halte tanpa kepastian waktu sering kali menyebabkan keterlambatan masuk kelas. Di sisi lain, pengelola belum memiliki alat untuk memantau posisi armada dan mengelola rute secara terpusat.  
   
Berdasarkan permasalahan tersebut, diperlukan sebuah Sistem Pelacak Bus Kampus Unila berbasis web dan *mobile* yang mampu menyajikan informasi pemetaan jalur, lokasi bus secara presisi dan *real-time*, status ketersediaan kursi (kosong/penuh), hingga estimasi waktu kedatangan. Oleh karena itu, laporan ini mengangkat judul "Analisis Kebutuhan Sistem Pelacak Bus Kampus Universitas Lampung (Unila) Berbasis Web dan Mobile" dengan tujuan merumuskan kebutuhan fungsional, non-fungsional, serta alur kerja (*workflow*) sistem yang sesuai.  
 

## **1.2 Rumusan Masalah**

   
Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam penyusunan proyek ini adalah sebagai berikut:  
   
1\. Bagaimana kondisi, proses, dan kendala yang dihadapi mahasiswa dalam memanfaatkan layanan Bus Tayo Universitas Lampung saat ini?  
2\. Apa saja kebutuhan fungsional dan non-fungsional yang harus dipenuhi dalam perancangan Sistem Pelacak Bus Kampus Unila?  
3\. Bagaimana rancangan alur proses (*business process/workflow*) dan diagram *use case* yang melibatkan aktor Mahasiswa (Pengguna Publik), Supir (*Driver*), dan Admin dalam sistem tersebut?  
 

## **1.3 Tujuan Penelitian / Proyek**

   
Tujuan yang ingin dicapai melalui pelaksanaan proyek analisis kebutuhan sistem ini meliputi:  
   
1\. Mengidentifikasi dan menganalisis permasalahan serta kendala nyata yang dialami mahasiswa terkait ketidakpastian jadwal, posisi, dan kapasitas Bus Tayo.  
2\. Menentukan dan merumuskan spesifikasi kebutuhan fungsional serta non-fungsional sistem berdasarkan hasil survei kebutuhan pengguna (*user requirements*).  
3\. Merancang alur proses sistem dan pemodelan fungsional (*use case*) yang jelas dan terstruktur untuk memfasilitasi interaksi antara Mahasiswa, Supir, dan Admin.  
 

## **1.4 Manfaat Penelitian / Proyek**

   
Hasil dari analisis kebutuhan sistem ini diharapkan dapat memberikan manfaat bagi berbagai pihak, di antaranya:  
   
1\. **Bagi Mahasiswa dan Pengguna Bus:** Memberikan kepastian informasi posisi bus, rute, dan ketersediaan kursi secara *real-time* sehingga mahasiswa dapat merencanakan mobilitas harian dengan lebih efektif dan mengurangi risiko terlambat masuk kelas.  
2\. **Bagi Supir dan Admin Pengelola:** Mempermudah pengelolaan rute, akun, dan armada secara terpusat, serta menyediakan mekanisme sederhana bagi supir untuk membagikan lokasi dan status kapasitas bus.  
3\. **Bagi Pengembang dan Akademis:** Menjadi dokumen acuan awal (*requirements specification document*) yang terstruktur bagi tim pengembang untuk dilanjutkan ke tahap perancangan antarmuka (*UI/UX design*) serta implementasi pemrograman pada tahap berikutnya.  
 

## **1.5 Deskripsi Singkat Proyek**

   
Proyek ini bertujuan untuk menganalisis kebutuhan dan merancang Sistem Pelacak Bus Kampus Universitas Lampung berbasis web dan *mobile*. Sistem terdiri atas tiga komponen utama: (1) aplikasi *mobile* untuk supir yang mengirimkan koordinat GPS dan status kapasitas bus, (2) *backend* yang memvalidasi serta menyiarkan (*broadcast*) data secara *real-time*, dan (3) web yang terdiri atas Web Publik untuk mahasiswa serta Web Admin untuk pengelolaan rute dan akun. Melalui sistem ini, mahasiswa dapat melihat peta interaktif kampus, posisi bus yang sedang aktif, rute yang dilewati, serta informasi detail bus tanpa harus menunggu tanpa kepastian di halte.  
   
   
 

# 

# **BAB II**

# **LANDASAN TEORI**

 

## **2.1 Konsep Sistem Informasi**

   
Sistem informasi merupakan kombinasi terstruktur dari komponen perangkat keras, perangkat lunak, infrastruktur jaringan, sumber daya manusia, serta prosedur yang saling berinteraksi untuk mengumpulkan, memproses, menyimpan, dan mendistribusikan informasi guna mendukung pengambilan keputusan dan koordinasi dalam suatu organisasi. Dalam konteks layanan kampus modern, sistem informasi berbasis web umumnya dibangun menggunakan arsitektur *client-server* multi-tier yang memisahkan antarmuka pengguna (*frontend*), logika bisnis (*backend*), dan penyimpanan data (*database*). Pada sistem pelacak bus, lapisan *frontend* menampilkan peta dan informasi armada secara interaktif, lapisan *backend* menerima serta memvalidasi data lokasi dari perangkat supir, dan *database* menyimpan data akun, rute, dan armada. Integrasi komponen tersebut mengubah layanan transportasi yang sebelumnya tidak terpantau menjadi layanan digital yang dapat diakses dari mana saja (*remote access*), terukur, dan transparan.  
 

## **2.2 Sistem Pelacakan Real-Time dan Teknologi Pendukung**

   
Pelacakan armada secara *real-time* bekerja dengan memanfaatkan sensor *Global Positioning System* (GPS) pada perangkat *mobile* supir untuk memperoleh koordinat bus secara berkala. Koordinat tersebut dikirim ke server dan diteruskan ke seluruh klien web yang sedang membuka peta. Pendekatan HTTP REST biasa kurang efisien untuk kebutuhan ini karena klien harus melakukan *polling* berulang-ulang. Sebagai alternatif, komunikasi dua arah berbasis **WebSocket** (misalnya melalui pustaka **Socket.io**) memungkinkan server mendorong (*push*) pembaruan posisi ke klien segera setelah data diterima, sehingga latensi dapat ditekan. Untuk visualisasi peta, pustaka *open-source* seperti **Leaflet.js** (melalui react-leaflet) dapat dimanfaatkan karena ringan dan tidak mewajibkan *API key* berbayar. Selain itu, mekanisme **Role-Based Access Control** (RBAC) berbasis JWT/*session* digunakan untuk membedakan hak akses Admin dan Supir dari pengguna publik.  
 

## **2.3 Metode Pengumpulan Data & Analisis Kebutuhan**

   
Metode pengumpulan data dan analisis kebutuhan (*requirements engineering*) merupakan tahapan krusial untuk menggali fakta empiris serta merumuskan batasan operasional sistem yang akan dibangun. Pengumpulan data dilakukan melalui penyebaran kuesioner terstruktur kepada calon pengguna (mahasiswa pengguna Bus Tayo), observasi lapangan terhadap halte dan titik awal rute, serta studi dokumen terhadap informasi operasional Bus Tayo. Hasil pengumpulan data dianalisis untuk merumuskan dua kelompok kebutuhan utama, yaitu kebutuhan fungsional yang mencakup fitur spesifik seperti pelacakan lokasi, tampilan peta, pengelolaan rute, dan status kapasitas, serta kebutuhan non-fungsional yang mengatur kriteria kualitas seperti performa, ketersediaan, kemudahan penggunaan, dan keamanan. Seluruh kebutuhan tersebut kemudian dimodelkan menggunakan *Unified Modeling Language* (UML), yaitu *Use Case Diagram*, *Activity Diagram*, *Sequence Diagram*, dan *Class Diagram*.  
 

## **2.4 Model Pengembangan**

   
Dalam penyusunan proyek ini, kami menggunakan kerangka kerja *Agile* dengan metode **Scrum sederhana**. Metode ini dipilih karena sesuai dengan durasi proyek yang singkat (4 minggu) dan kebutuhan koordinasi antar-anggota yang mengerjakan komponen berbeda (*backend*, *mobile*, *web*, desain, dan pengujian). Tahapan pada metode ini meliputi:  
   
1\. **Perencanaan Sprint (*Sprint Planning*)**  
 Menentukan target dan pembagian tugas pada setiap minggu berdasarkan kebutuhan hasil analisis.  
2\. **Pelaksanaan Sprint (*Development*)**  
 Anggota mengerjakan tugas sesuai peran, yaitu perancangan arsitektur dan API, aplikasi supir, antarmuka web, serta desain dan pengujian. Proyek dibagi menjadi 4 *sprint* mingguan.  
3\. **Evaluasi Mingguan (*Sprint Review*)**  
 Pada akhir setiap minggu dilakukan evaluasi singkat untuk memastikan progres sesuai target dan mengidentifikasi hambatan.  
4\. **Penyempurnaan dan Dokumentasi (*Refinement*)**  
 Memperbaiki *bug*, mengoptimalkan latensi, dan menyusun dokumen laporan akhir beserta materi presentasi.  
   
   
 

# 

# **BAB III**

# **METODOLOGI PELAKSANAAN PROYEK**

 

## **3.1 Tahapan Pengerjaan Proyek**

   
Pelaksanaan proyek analisis kebutuhan Sistem Pelacak Bus Kampus Unila ini dilakukan melalui beberapa tahapan sistematis untuk memastikan hasil yang akurat dan sesuai dengan kebutuhan riil di lapangan. Tahapan tersebut meliputi:

1. Penentuan Tema dan Identifikasi Masalah: Menentukan fokus studi kasus pada layanan Bus Tayo Universitas Lampung serta mengidentifikasi permasalahan utama yang dihadapi pengguna.  
2. Survei Lapangan Rute dan Halte: Melakukan observasi langsung terhadap halte, titik awal rute, dan jalur yang dilalui bus untuk memetakan rute (*mapping path*).  
3. Penyusunan Instrumen Survei: Merancang kuesioner menggunakan Google Form guna menggali kebiasaan, kendala, dan kebutuhan fitur dari calon pengguna.  
4. Penyebaran dan Pengumpulan Data Survei: Mendistribusikan kuesioner secara daring kepada mahasiswa untuk mendapatkan respons yang representatif.  
5. Pengolahan dan Analisis Hasil Survei: Mengolah data mentah, menyajikannya dalam bentuk grafik, dan menganalisis pola kebutuhan pengguna.  
6. Identifikasi Kebutuhan Fungsional dan Non-Fungsional: Merumuskan fitur dan spesifikasi mutu sistem berdasarkan kondisi awal yang diperkuat hasil survei.  
7. Analisis Kebutuhan Teknologi dan Infrastruktur: Menganalisis perangkat lunak, perangkat keras, jaringan, dan aspek keamanan yang diperlukan.  
8. Analisis Potensi Penerapan AI: Mengidentifikasi peluang integrasi kecerdasan buatan untuk fitur cerdas pada sistem.  
9. Perancangan Pemodelan Sistem dan Antarmuka: Menyusun diagram UML serta *wireframe* dan *mockup* antarmuka.

 

## **3.2 Penjadwalan Proyek (*Timeline*)**

   
*Tabel 3.2 Penjadwalan Proyek (Timeline)*  
 

| No. | Tahapan Kegiatan | Waktu | Anggota Terlibat | Output |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Penentuan tema dan identifikasi masalah | Minggu 1 | Seluruh anggota | Tema, latar belakang, dan rumusan masalah |
| 2 | Survei lapangan rute dan titik halte | Minggu 1 | Opek, Yostiar | Data halte dan titik awal rute (*mapping path*) |
| 3 | Penyusunan dan penyebaran instrumen survei | Minggu 1 | \[ISI ANGGOTA\] | Google Form dan data hasil survei |
| 4 | Perancangan UI/UX (*wireframe* dan *prototype*) | Minggu 1 | Yostiar | *Wireframe* / *mockup* antarmuka Mobile dan Web |
| 5 | Perancangan database dan arsitektur API | Minggu 1 | Dipa | Skema database dan rancangan API *endpoint* |
| 6 | Identifikasi kebutuhan fungsional dan non-fungsional | Minggu 2 | Yostiar, Dipa, Opek | Daftar kebutuhan fungsional dan non-fungsional |
| 7 | Analisis teknologi, infrastruktur, dan potensi AI | Minggu 2 | Dipa, Bintang, Rio | Kebutuhan teknologi, infrastruktur, dan rancangan kebutuhan AI |
| 8 | Perancangan pemodelan sistem (UML & *Class Diagram*) | Minggu 3 | Yostiar, Dipa | *Use Case*, *Activity*, *Sequence*, & *Class Diagram* |
| 9 | Pengolahan dan analisis hasil survei | Minggu 3 | Opek, Yostiar | Hasil analisis data dan grafik |
| 10 | Penyusunan dokumen laporan akhir & finalisasi | Minggu 4 | Yostiar, Opek (didukung seluruh anggota) | Dokumen laporan lengkap dan materi presentasi |

   
   
*Catatan: kolom "Waktu" dan "Anggota Terlibat" disesuaikan dengan Dokumen Planning (4 minggu). Sesuaikan kembali bila jadwal kelompok berbeda.*  
 

## **3.3 Pembagian Tugas dan Tanggung Jawab Tim**

   
1\. Dipa: Merancang arsitektur sistem, skema database, dan API *endpoint*. Merancang integrasi *WebSocket* / Socket.io (atau MQTT) agar koordinat dari aplikasi supir diteruskan secara instan ke Web Publik, serta mengelola autentikasi berbasis peran.  
2\. Bintang: Menganalisis dan merancang aplikasi Android (Kotlin) untuk supir, meliputi *login*, *Start/Stop Tracking*, integrasi GPS / *Location Manager*, *background service*, dan *toggle* status kapasitas bus.  
3\. Rio: Merancang antarmuka peta interaktif (Leaflet.js / Mapbox) yang menampilkan posisi bus, rute, dan informasi detail armada. Merancang dashboard manajemen rute dan akun.  
4\. Yostiar: Merancang *wireframe* dan *high-fidelity prototype* (Figma) untuk Mobile dan Web. Merancang alur sistem dan pemodelan UML (*Use Case*, *Activity*, *Sequence*, *Class Diagram*) serta memetakan *Mapping Path* rute bus.  
5\. Rizky: Melakukan survei halte dan pemetaan titik awal rute. Merancang pengujian sistem (*black-box testing* dan *User Acceptance Testing*) serta menyusun dokumen laporan proyek.  
 

## **3.4 Diagram-Diagram**

 

### **3.4.1 Use Case**

   
**\[PLACEHOLDER GAMBAR: Use Case Diagram\]**  
 *Aktor: Mahasiswa (Pengguna Publik), Supir, Admin. Use case yang disarankan: Melihat Peta dan Posisi Bus, Melihat Rute, Melihat Detail Bus, Login, Start/Stop Tracking, Ubah Status Kapasitas, Kelola Rute, Kelola Akun Driver/Admin.*  
   
*Gambar 3.4.1 Use Case Diagram*  
 

### **3.4.2 Sequence Diagram**

 

#### **3.4.2.a Sequence Diagram Login (Supir/Admin)**

   
**\[PLACEHOLDER GAMBAR: Sequence Diagram Login\]**  
   
*Gambar 3.4.2.a Sequence Diagram Login*  
 

#### **3.4.2.b Sequence Diagram Start/Stop Tracking dan Pengiriman Lokasi**

   
**\[PLACEHOLDER GAMBAR: Sequence Diagram Pengiriman Lokasi Real-Time (Mobile → Backend → Web Publik)\]**  
   
*Gambar 3.4.2.b Sequence Diagram Start/Stop Tracking dan Pengiriman Lokasi*  
 

#### **3.4.2.c Sequence Diagram Mengelola Data Rute**

   
**\[PLACEHOLDER GAMBAR: Sequence Diagram Kelola Rute oleh Admin\]**  
   
*Gambar 3.4.2.c Sequence Diagram Mengelola Data Rute*  
 

#### **3.4.2.d Sequence Diagram Mengubah Status Kapasitas Bus**

   
**\[PLACEHOLDER GAMBAR: Sequence Diagram Ubah Status Kapasitas (Tersedia/Penuh)\]**  
   
*Gambar 3.4.2.d Sequence Diagram Mengubah Status Kapasitas Bus*  
 

#### **3.4.2.e Sequence Diagram Melihat Posisi Bus pada Peta**

   
**\[PLACEHOLDER GAMBAR: Sequence Diagram Mahasiswa Melihat Peta dan Posisi Bus\]**  
   
*Gambar 3.4.2.e Sequence Diagram Melihat Posisi Bus pada Peta*  
 

### **3.4.3 Activity Diagram**

   
**\[PLACEHOLDER GAMBAR: Activity Diagram Alur Pelacakan Bus\]**  
   
*Gambar 3.4.3 Activity Diagram*  
 

### **3.4.4 Class Diagram**

   
**\[PLACEHOLDER GAMBAR: Class Diagram\]**  
 *Entitas yang disarankan: User (Admin/Driver), Bus, Rute, Halte, LokasiBus (koordinat dan waktu), StatusKapasitas.*  
   
*Gambar 3.4.4 Class Diagram*  
   
   
 

# 

# **BAB IV**

# **HASIL DAN PEMBAHASAN**

 

## 

## **4.1 Analisis Hasil Survei dan Kuesioner**

   
**\[PLACEHOLDER: Jumlah responden \= \[JUMLAH\] orang. Lengkapi seluruh angka bertanda \[XX%\] setelah survei Google Form selesai.\]**  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Status responden saat ini\]**  
   
Berdasarkan grafik mengenai status responden, partisipasi kuesioner didominasi oleh \[KATEGORI RESPONDEN\] sebanyak \[XX\] responden (\[XX%\]). \[Jelaskan bahwa responden merupakan target pengguna Bus Tayo yang relevan.\]  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Seberapa sering Anda menggunakan Bus Tayo?\]**  
   
Terkait frekuensi penggunaan Bus Tayo, sebanyak \[XX%\] responden menggunakan bus \[FREKUENSI\]. \[Jelaskan bahwa tingkat penggunaan menunjukkan kebutuhan sistem yang bersifat harian/berkala.\]  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Bagaimana Anda mengetahui jadwal/posisi Bus Tayo saat ini?\]**  
   
Grafik cara responden mengetahui jadwal dan posisi bus menunjukkan bahwa \[XX%\] responden \[CARA, misal: menunggu langsung di halte / bertanya kepada teman\]. \[Jelaskan kurangnya pusat informasi yang memadai.\]  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Seberapa sering Anda terlambat karena menunggu bus?\]**  
   
Sebanyak \[XX%\] responden pernah terlambat masuk kelas akibat menunggu bus tanpa kepastian. \[Jelaskan urgensi sistem.\]  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Kendala yang pernah dialami saat menggunakan Bus Tayo\]**  
   
Kendala utama yang dialami responden adalah \[KENDALA 1\] (\[XX%\]), \[KENDALA 2\] (\[XX%\]), serta \[KENDALA 3\] (\[XX%\]). \[Jelaskan bahwa kendala ini menjadi alasan mendasar perlunya digitalisasi informasi bus.\]  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Informasi apa yang perlu ditampilkan untuk setiap bus?\]**  
   
Informasi yang dianggap paling dibutuhkan adalah posisi bus secara *real-time* (\[XX%\]), estimasi waktu kedatangan (\[XX%\]), status kapasitas (\[XX%\]), dan rute yang dilalui (\[XX%\]).  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Fitur yang dianggap penting dalam sistem pelacak bus\]**  
   
Fitur sistem yang dinilai paling penting adalah \[FITUR 1\] (\[XX%\]), \[FITUR 2\] (\[XX%\]), dan \[FITUR 3\] (\[XX%\]).  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Seberapa penting informasi status kapasitas (kosong/penuh)?\]**  
   
Informasi status kapasitas dinilai sangat penting (skala 5\) oleh \[XX%\] responden dan penting (skala 4\) oleh \[XX%\] responden.  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Seberapa penting estimasi waktu kedatangan bus?\]**  
   
Estimasi waktu kedatangan dinilai sangat penting (skala 5\) oleh \[XX%\] responden.  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Perangkat yang digunakan untuk mengakses sistem (smartphone/laptop)\]**  
   
Perangkat yang paling banyak digunakan responden adalah \[PERANGKAT\] (\[XX%\]). \[Jelaskan perlunya antarmuka yang responsif.\]  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Seberapa besar sistem pelacak bus akan membantu Anda?\]**  
   
Mayoritas responden menjawab bahwa sistem ini akan sangat membantu (skala 5 dipilih oleh \[XX%\] dan skala 4 dipilih oleh \[XX%\]).  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Kesediaan menggunakan sistem bila tersedia\]**  
   
Saat ditanya apakah bersedia menggunakan sistem bila telah tersedia, \[XX%\] responden menjawab "Ya". \[Jelaskan potensi tingkat adopsi pengguna.\]  
   
**\[PLACEHOLDER GAMBAR: Diagram jawaban — Fitur yang paling dibutuhkan\]**  
   
Fitur yang paling dibutuhkan adalah \[FITUR 1\] (\[XX%\]), \[FITUR 2\] (\[XX%\]), dan \[FITUR 3\] (\[XX%\]).  
   
*Catatan: pertanyaan di atas adalah usulan. Sesuaikan dengan isi Google Form kelompok. Hasil survei lapangan oleh Opek dan Yostiar (halte, titik awal rute) dapat ditambahkan sebagai subbab **4.1.1 Hasil Survei Lapangan** dengan **\[PLACEHOLDER TABEL: Daftar halte dan koordinat\]** dan **\[PLACEHOLDER FOTO: Dokumentasi halte\]**.*  
 

## **4.2 Analisis Pengguna (*User / Actor*)**

   
Analisis pengguna dilakukan untuk mengidentifikasi pihak-pihak yang berinteraksi dengan sistem, karakteristik, tujuan, serta kebutuhan masing-masing. Analisis ini menjadi dasar penentuan hak akses dan penyusunan *use case*.  
 

### **4.2.1 Karakteristik Calon Pengguna Berdasarkan Survei**

   
Berdasarkan \[JUMLAH\] responden, pengguna utama sistem didominasi oleh \[KATEGORI RESPONDEN\] (\[XX%\]). Sebanyak \[XX%\] responden menggunakan Bus Tayo minimal \[FREKUENSI\], sehingga sistem akan dipakai secara berkala. Selain itu, \[XX%\] responden menyatakan pernah terlambat akibat menunggu bus, dan \[XX%\] bersedia menggunakan sistem ini. \[Sesuaikan dengan hasil survei.\]  
 

### **4.2.2 Identifikasi dan Profil Aktor**

 

| Aspek | Mahasiswa (Pengguna Publik) | Supir (*Driver*) | Admin |
| :---- | :---- | :---- | :---- |
| Peran | Pengguna informasi posisi dan rute bus | Pengirim data lokasi dan status kapasitas bus | Pengelola rute dan akun |
| Deskripsi | Mahasiswa, dosen, dan staf Unila pengguna Bus Tayo | Pengemudi Bus Tayo yang bertugas pada jam operasional | Pengelola sistem yang mengatur rute, akun supir, dan akun admin |
| Tingkat keahlian teknis | Beragam, dari pemula sampai terbiasa dengan aplikasi | Dasar sampai menengah | Menengah |
| Perangkat utama | Smartphone (browser HP) dan laptop/PC | Smartphone Android | Laptop/PC |
| Frekuensi penggunaan | Harian pada jam perkuliahan | Setiap jam operasional | Sesekali (saat ada perubahan rute/akun) |
| Tujuan | Mengetahui posisi dan kedatangan bus dengan pasti | Mengirim lokasi dan status tanpa mengganggu pekerjaan mengemudi | Memastikan data rute dan akun selalu akurat |
| Kendala saat ini | \[ISI SESUAI SURVEI: tidak tahu posisi bus, ketidakpastian jadwal, tidak tahu kapasitas\] | Belum ada alat bantu untuk berbagi lokasi dan status bus | Belum ada pusat data rute dan armada |
| Kebutuhan utama | Melihat peta, posisi bus *real-time*, rute, detail bus, status kapasitas | *Login*, *Start/Stop Tracking*, mengubah status kapasitas | Mengelola rute (tambah, ubah, hapus), mengelola akun supir dan admin |

   
 

### **4.2.3 Hak Akses dan Aktivitas Aktor**

 

| Fitur / Aktivitas | Mahasiswa | Supir | Admin |
| :---- | :---- | :---- | :---- |
| Melihat peta interaktif dan posisi bus aktif | ✔ | \- | ✔ |
| Melihat rute/jalur setiap bus | ✔ | \- | ✔ |
| Melihat detail bus (plat nomor, nama armada, status kapasitas) | ✔ | \- | ✔ |
| *Login* | \- | ✔ | ✔ |
| *Start/Stop Tracking* GPS | \- | ✔ | \- |
| Mengubah status kapasitas bus | \- | ✔ | \- |
| Mengelola data rute (tambah, ubah, hapus) | \- | \- | ✔ |
| Mengelola akun supir dan admin | \- | \- | ✔ |

   
 

### **4.2.4 Relasi Aktor dengan Sistem**

   
1\. Supir memulai proses dengan *login* dan mengaktifkan pelacakan, kemudian secara berkala mengirim koordinat dan status kapasitas bus.  
2\. Sistem (*backend*) memvalidasi bahwa bus berada di area kampus, lalu menyiarkan posisi dan status secara *real-time* ke Web Publik.  
3\. Mahasiswa membuka Web Publik tanpa *login* untuk melihat posisi bus, rute, dan informasi detail armada.  
4\. Admin mengelola rute serta akun supir dan admin melalui Web Admin.  
 

## **4.3 Kebutuhan Fungsional (*Functional Requirements*)**

   
Kebutuhan fungsional awal sebelum melakukan survei, yang dirumuskan berdasarkan permasalahan dan gambaran proyek sebelum mengetahui jawaban responden.  
 

| Kode | Kebutuhan Fungsional Awal |
| :---- | :---- |
| KF-01 | Admin dapat mengelola data rute/jalur bus (tambah, ubah, hapus) melalui Web Admin. |
| KF-02 | Sistem dapat menerima data koordinat GPS secara *real-time* dari aplikasi *driver* (mobile). |
| KF-03 | Sistem dapat memvalidasi apakah bus berada di area kampus. |
| KF-04 | Sistem dapat menyiarkan (*broadcast*) lokasi bus dan statusnya secara *real-time* ke Web Publik. |
| KF-05 | Sistem dapat mengelola akun *driver* dan *admin*. |
| KF-06 | Supir dapat *login* ke aplikasi menggunakan kredensial khusus. |
| KF-07 | Supir dapat mengaktifkan atau mematikan fitur pelacakan (*Start/Stop Tracking*) lokasi GPS. |
| KF-08 | Supir dapat mengubah *toggle* status kapasitas bus (misal: "Tersedia" / "Penuh"). |
| KF-09 | Mahasiswa dapat melihat peta interaktif kampus yang memuat posisi *real-time* bus yang sedang aktif. |
| KF-10 | Mahasiswa dapat melihat rute/jalur yang dilewati oleh setiap armada bus. |
| KF-11 | Mahasiswa dapat melihat informasi detail bus (plat nomor, nama armada, dan status kapasitas penumpang). |

   
   
Kebutuhan fungsional setelah dilakukan survei, yang diperoleh atau diperkuat setelah melihat jawaban responden, yakni:  
   
*\[Sesuaikan butir di bawah ini dengan hasil survei kelompok.\]*  
 

| Kode | Kebutuhan Fungsional Survei |
| :---- | :---- |
| KF-S01 | Sistem menampilkan estimasi waktu kedatangan bus pada halte tertentu. |
| KF-S02 | Sistem menampilkan titik halte pada peta beserta bus yang akan melintas. |
| KF-S03 | Sistem menampilkan status kapasitas bus (tersedia/penuh) secara jelas dan mudah dibedakan. |
| KF-S04 | Sistem menampilkan hanya bus yang sedang aktif beroperasi pada peta. |
| KF-S05 | Sistem menampilkan penanda jika data lokasi bus tidak diperbarui (misal: sinyal supir terputus). |
| KF-S06 | Sistem dapat diakses oleh mahasiswa tanpa perlu membuat akun atau *login*. |

   
 

## **4.4 Kebutuhan Non-Fungsional (*Non-Functional Requirements*)**

   
Kebutuhan non-fungsional awal sebelum melakukan survei, yang dirumuskan berdasarkan permasalahan dan gambaran proyek sebelum mengetahui jawaban responden.  
 

| Kode | Kebutuhan Non-Fungsional Awal |
| :---- | :---- |
| KNF-01 | **Performansi & *Real-Time*:** latensi pengiriman dan pembaruan koordinat dari *mobile* hingga tampil di web tidak lebih dari 3–5 detik. |
| KNF-02 | **Ketersediaan:** Web Publik dapat diakses 24/7 dengan *uptime* minimal 95% selama jam operasional kampus. |
| KNF-03 | **Usability & Responsif:** antarmuka Web Publik responsif dan nyaman diakses melalui *smartphone* maupun laptop/PC. |
| KNF-04 | **Keamanan:** autentikasi berbasis peran (*Role-Based Authentication*) menggunakan JWT/*session* untuk membatasi akses Web Admin dan Aplikasi Supir. |
| KNF-05 | **Keandalan Koneksi:** aplikasi *driver* memiliki penanganan toleransi sinyal (*graceful handling*) ketika koneksi internet terputus di area *blank spot*. |

   
   
Kebutuhan non-fungsional setelah dilakukan survei, yang diperoleh atau diperkuat setelah melihat jawaban responden, yakni:  
   
*\[Sesuaikan butir di bawah ini dengan hasil survei kelompok.\]*  
 

| Kode | Kebutuhan Non-Fungsional Survei |
| :---- | :---- |
| KNF-S01 | Sistem mudah digunakan oleh pengguna baru tanpa panduan khusus. |
| KNF-S02 | Sistem dapat diakses dari mana saja melalui browser HP tanpa instalasi aplikasi. |
| KNF-S03 | Informasi posisi, rute, dan kapasitas bus disajikan jelas dan mudah dipahami. |
| KNF-S04 | Aplikasi supir hemat baterai dan kuota selama pelacakan berjalan. |

   
 

## **4.5 Alur Proses Sistem (*Business Process / Workflow*)**

 

### **A. Definisi Pengguna dan Aktor Sistem**

   
1\. **Mahasiswa (Pengguna Publik)**  
○ **Deskripsi:** Mahasiswa, dosen, atau staf Unila yang memanfaatkan Bus Tayo.  
○ **Hak Akses:** Melihat peta interaktif, posisi bus aktif, rute, dan informasi detail bus tanpa perlu *login*.  
2\. **Supir (*Driver*)**  
○ **Deskripsi:** Pengemudi Bus Tayo yang menggunakan aplikasi *mobile* untuk membagikan lokasi dan status bus.  
○ **Hak Akses:** *Login*, mengaktifkan/mematikan pelacakan, serta mengubah status kapasitas bus.  
3\. **Admin**  
○ **Deskripsi:** Pengelola sistem yang mengatur rute dan akun.  
○ **Hak Akses:** Mengelola data rute (tambah, ubah, hapus) serta akun supir dan admin melalui Web Admin.  
 

### **B. Rincian Data yang Dikelola Sistem**

   
● **Data Akun:** Nama, *username*, kata sandi (terenkripsi), dan peran (*driver*/*admin*).  
● **Data Bus/Armada:** Nama armada, plat nomor, dan status kapasitas ("Tersedia"/"Penuh").  
● **Data Rute:** Nama rute, daftar titik koordinat jalur, dan titik halte.  
● **Data Lokasi:** Koordinat *latitude* dan *longitude*, waktu pengiriman, serta status aktif pelacakan.  
 

### **C. Alur Proses Sistem (*Workflow*)**

   
1\. **Tahap Persiapan oleh Admin:**  
○ Admin *login* ke Web Admin.  
○ Admin menambahkan akun supir dan data armada, serta menetapkan data rute dan titik halte.  
2\. **Tahap Pelacakan oleh Supir:**  
○ Supir *login* ke aplikasi *mobile* menggunakan kredensial khusus.  
○ Supir menekan tombol *Start Tracking*, lalu aplikasi mengirim koordinat GPS secara berkala ke *backend*.  
○ Supir mengubah *toggle* status kapasitas ("Tersedia"/"Penuh") sesuai kondisi bus.  
○ Jika koneksi terputus, aplikasi menyimpan data sementara dan mengirimkannya kembali saat koneksi pulih (*graceful handling*).  
○ Setelah selesai bertugas, supir menekan *Stop Tracking*.  
3\. **Tahap Pemrosesan oleh Backend:**  
○ *Backend* menerima koordinat dan memvalidasi bahwa bus berada di area kampus.  
○ Data yang valid disimpan dan disiarkan (*broadcast*) melalui WebSocket/Socket.io ke seluruh klien Web Publik.  
4\. **Tahap Pemantauan oleh Mahasiswa:**  
○ Mahasiswa membuka Web Publik dan melihat peta interaktif beserta posisi bus yang aktif.  
○ Mahasiswa memilih bus atau rute untuk melihat jalur, plat nomor, nama armada, dan status kapasitas.  
○ Posisi dan status bus diperbarui otomatis tanpa memuat ulang halaman.  
 

## **4.6 Analisis Teknologi, Infrastruktur, dan Potensi AI**

   
Untuk mendukung implementasi Sistem Pelacak Bus Kampus Unila agar berjalan optimal, aman, dan efisien, diperlukan analisis terkait arsitektur teknologi, infrastruktur pendukung, serta potensi pemanfaatan *Artificial Intelligence* (AI).  
 

### **4.6.1 Analisis Teknologi (*Technology Stack*)**

   
Pemilihan *technology stack* disesuaikan dengan kebutuhan pelacakan *real-time*, aplikasi supir, peta interaktif, dan pengelolaan multi-aktor (Mahasiswa, Supir, Admin):  
   
1\. **Frontend Web (Web Publik & Web Admin)**  
○ Teknologi: React.js dengan *library* peta Leaflet.js (react-leaflet) atau Mapbox GL.  
○ Alasan Pemilihan: Memungkinkan antarmuka responsif di *smartphone* maupun laptop (mendukung KNF-03). Leaflet bersifat *open-source*, gratis tanpa batasan *API key*, dan ringan untuk kebutuhan proyek mahasiswa.  
2\. **Aplikasi Mobile Supir**  
○ Teknologi: Android (Kotlin) dengan *Location Manager* / *Fused Location Provider* dan *background service*.  
○ Alasan Pemilihan: Memungkinkan pengambilan koordinat GPS secara berkala meskipun aplikasi berjalan di latar belakang.  
3\. **Backend (Logika Bisnis & Server)**  
○ Teknologi: Node.js (Express.js) dengan Socket.io/WebSocket (alternatif: MQTT).  
○ Alasan Pemilihan: Komunikasi dua arah memungkinkan koordinat dari *mobile* diteruskan instan ke *frontend* tanpa *polling*, sehingga mendukung KNF-01.  
4\. **Database**  
○ Teknologi: \[ISI: misal PostgreSQL / MySQL / MongoDB sesuai rancangan Dipa\].  
○ Alasan Pemilihan: Menyimpan data akun, rute, armada, dan lokasi secara terstruktur dan konsisten.  
5\. **Autentikasi**  
○ Teknologi: JWT / *session* berbasis peran (RBAC).  
○ Alasan Pemilihan: Membatasi akses Web Admin dan Aplikasi Supir (mendukung KNF-04).  
 

### **4.6.2 Analisis Infrastruktur**

   
1\. **Server & Hosting**  
○ Server *deployment*: \[ISI: VPS / PaaS (misal Vercel/Render untuk frontend dan layanan cloud untuk backend)\].  
○ *Scalability*: Konfigurasi server mampu menangani banyak koneksi *WebSocket* bersamaan pada jam sibuk perkuliahan.  
2\. **Keamanan Sistem & Data**  
○ Enkripsi HTTPS/WSS (SSL/TLS) untuk mengamankan data selama transmisi.  
○ *Role-Based Access Control* (RBAC) untuk membedakan hak akses Supir dan Admin dari publik (mendukung KNF-04).  
○ Kata sandi disimpan dalam bentuk *hash*.  
3\. **Jaringan dan Perangkat Pendukung**  
○ Perangkat supir memerlukan koneksi internet seluler dan GPS aktif; penanganan *blank spot* dilakukan melalui mekanisme penyimpanan data sementara (mendukung KNF-05).  
4\. **Backup & Recovery**  
○ Pencadangan data database secara berkala untuk mencegah hilangnya data akun dan rute.  
 

### **4.6.3 Analisis Potensi Penerapan Artificial Intelligence (AI)**

   
Untuk meningkatkan kualitas layanan, sistem memiliki potensi untuk diintegrasikan dengan teknologi AI pada tahap pengembangan berikutnya:  
   
1\. **Prediksi Estimasi Waktu Kedatangan (*ETA Prediction*)**  
○ Deskripsi: Model *machine learning* memanfaatkan data historis posisi dan kecepatan bus untuk memprediksi waktu kedatangan di tiap halte.  
○ Manfaat: Memberikan estimasi yang lebih akurat dibanding perhitungan jarak sederhana.  
2\. **Prediksi Kepadatan Penumpang**  
○ Deskripsi: Analisis pola status kapasitas ("Penuh"/"Tersedia") pada jam dan rute tertentu untuk memprediksi waktu padat.  
○ Manfaat: Membantu mahasiswa memilih waktu keberangkatan dan membantu pengelola menentukan kebutuhan armada.  
3\. **Deteksi Anomali Data GPS**  
○ Deskripsi: Algoritma mendeteksi lonjakan koordinat yang tidak wajar atau bus yang menyimpang jauh dari rute.  
○ Manfaat: Meningkatkan keakuratan data pada peta dan mengurangi data yang tidak valid.  
4\. **Chatbot / Virtual Assistant (NLP)**  
○ Deskripsi: Asisten virtual untuk menjawab pertanyaan seputar posisi bus, rute, dan jam operasional.  
○ Manfaat: Memberikan layanan informasi mandiri selama 24/7.  
 

## **4.7 Hasil Perancangan Antarmuka (Mockup / Wireframe)**

 

### **4.7.1 Antarmuka Web Publik (Mahasiswa)**

   
**\[PLACEHOLDER GAMBAR: Mockup halaman peta interaktif dan posisi bus\]**  
   
*Gambar 4.7.1a Antarmuka Web Publik: Peta dan Posisi Bus*  
   
**\[PLACEHOLDER GAMBAR: Mockup halaman detail bus dan rute\]**  
   
*Gambar 4.7.1b Antarmuka Web Publik: Detail Bus dan Rute*  
 

### **4.7.2 Antarmuka Aplikasi Mobile Supir**

   
**\[PLACEHOLDER GAMBAR: Mockup halaman login supir\]**  
   
*Gambar 4.7.2a Antarmuka Aplikasi Supir: Login*  
   
**\[PLACEHOLDER GAMBAR: Mockup halaman Start/Stop Tracking dan toggle status kapasitas\]**  
   
*Gambar 4.7.2b Antarmuka Aplikasi Supir: Start/Stop Tracking dan Status Kapasitas*  
 

### **4.7.3 Antarmuka Web Admin**

   
**\[PLACEHOLDER GAMBAR: Mockup dashboard dan manajemen rute\]**  
   
*Gambar 4.7.3a Antarmuka Web Admin: Manajemen Rute*  
   
**\[PLACEHOLDER GAMBAR: Mockup manajemen akun supir dan admin\]**  
   
*Gambar 4.7.3b Antarmuka Web Admin: Manajemen Akun*  
   
   
 

# 

# **BAB V**

# **KESIMPULAN DAN SARAN**

 

## **5.1 Kesimpulan**

   
Berdasarkan keseluruhan hasil analisis kebutuhan, pengolahan data kuesioner, serta perancangan alur kerja Sistem Pelacak Bus Kampus Universitas Lampung, dapat disimpulkan bahwa pemanfaatan Bus Tayo saat ini masih menghadapi kendala berupa ketidakpastian jadwal kedatangan, posisi armada, dan kapasitas penumpang. Hasil survei menunjukkan bahwa \[XX%\] responden \[HASIL SURVEI UTAMA, misal: pernah terlambat akibat menunggu bus\], sementara \[XX%\] responden menilai \[HASIL SURVEI UTAMA 2\].  
   
Untuk mengatasi permasalahan tersebut, perancangan sistem ini merumuskan spesifikasi kebutuhan fungsional dan non-fungsional. Secara fungsional, pengguna membutuhkan peta interaktif dengan posisi bus *real-time*, informasi rute, serta detail bus termasuk status kapasitas, sedangkan supir membutuhkan aplikasi sederhana untuk mengaktifkan pelacakan dan mengubah status kapasitas. Dari sisi non-fungsional, sistem dirancang dengan latensi pembaruan maksimal 3–5 detik, *uptime* minimal 95% selama jam operasional, antarmuka responsif, autentikasi berbasis peran (JWT/*session*), serta penanganan toleransi sinyal pada aplikasi supir.  
   
Dalam perancangan alur kerja dan pemodelan sistem, proses dibagi ke dalam tiga peran utama, yaitu Mahasiswa sebagai pengguna informasi, Supir sebagai penyedia data lokasi dan status, serta Admin sebagai pengelola rute dan akun. Seluruh interaksi telah dimodelkan melalui diagram UML. Penggunaan *technology stack* modern (React, Kotlin, Express, Socket.io, Leaflet) yang dikombinasikan dengan potensi pemanfaatan AI seperti prediksi ETA, prediksi kepadatan, dan deteksi anomali GPS diharapkan meningkatkan efisiensi layanan. \[XX%\] responden bersedia menggunakan sistem ini sehingga potensi adopsinya tinggi.  
 

## **5.2 Saran**

   
Guna menindaklanjuti hasil analisis ini agar dapat diwujudkan menjadi sistem yang utuh dan berfungsi optimal, terdapat beberapa saran pengembangan. Pada tahap awal, tim disarankan merancang antarmuka yang sederhana dan responsif, khususnya pada tampilan peta dan informasi status bus. Pada sisi *backend*, komunikasi *real-time* melalui WebSocket/Socket.io perlu dioptimalkan agar latensi tetap berada di bawah batas yang ditetapkan, dan validasi area kampus harus diterapkan secara ketat.  
   
Pengembangan fitur AI disarankan dilakukan bertahap, di mana tahap awal (*MVP*) difokuskan pada fungsi inti pelacakan, sedangkan prediksi ETA, prediksi kepadatan, dan deteksi anomali dapat ditambahkan pada iterasi berikutnya setelah data historis terkumpul. Terakhir, sebelum sistem digunakan secara luas, perlu dilakukan pengujian lapangan (*field test*) dan *User Acceptance Testing* bersama calon pengguna dan supir untuk memastikan seluruh fitur berjalan baik, termasuk pada area dengan sinyal lemah.  
   
   
 

# 

# **DAFTAR PUSTAKA**

 

**\[PLACEHOLDER: Daftar referensi (jurnal, buku, dokumentasi resmi Leaflet, Socket.io, Android Location, dan sumber lain yang dikutip), ditulis sesuai format yang ditentukan dosen.\]**  
   
   
 

# 

# **LAMPIRAN**

 

## **Lampiran 1**

## **Instrumen Kuesioner**

   
Berikut adalah tampilan kuesioner yang didistribusikan kepada responden.  
   
**\[PLACEHOLDER GAMBAR: Tangkapan layar Google Form halaman 1\]**  
 **\[PLACEHOLDER GAMBAR: Tangkapan layar Google Form halaman 2\]**  
 **\[PLACEHOLDER GAMBAR: Tangkapan layar Google Form halaman 3 dan seterusnya\]**  
 

## **Lampiran 2**

## **Rekapitulasi Data Hasil Kuesioner**

   
**\[PLACEHOLDER GAMBAR / TABEL: Rekap jawaban kuesioner dari Google Sheets\]**  
 

## **Lampiran 3**

## **Dokumentasi Survei Lapangan**

   
**\[PLACEHOLDER FOTO: Dokumentasi halte dan titik awal rute\]**  


[image1]: <data:image/png;base64,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>