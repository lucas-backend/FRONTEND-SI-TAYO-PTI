# Aturan Proyek: Pelacak Bus Unila (mockup frontend)

Spesifikasi lengkap ada di docs/BRIEF.md. Brief awal di docs/BRIEF-AWAL.md.
Acuan visual ada di docs/design/ (mobile Android). Tiru gambar itu semirip mungkin.

## Aturan keras
- Stack sudah terpasang. Jangan ganti framework atau tambah library tanpa alasan.
- TypeScript strict, tanpa `any`. Alias impor `@/`.
- UI hanya boleh mengambil data lewat hooks/store -> src/api atau src/realtime.
  Komponen tidak boleh impor src/mock langsung.
- Seluruh teks UI Bahasa Indonesia.
- Konstanta simulasi (interval tick, kecepatan, dwell) di src/config.ts.
- Jangan mengerjakan semua sekaligus. Ikuti urutan di bagian 16 BRIEF.md.

## Perintah
- npm run dev       jalankan lokal
- npm run build     wajib sukses sebelum menyatakan tahap selesai
- npm run lint

## Definisi selesai tiap tahap
Build sukses, tanpa error konsol, dan fitur tahap itu bisa dicoba di browser.
Catat asumsi di README.md bagian "Asumsi".