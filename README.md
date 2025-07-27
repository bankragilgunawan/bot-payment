# 🤖 Bot Payment - Asten Service

Bot Payment ini adalah chatbot web sederhana untuk membantu pelanggan melakukan pemesanan layanan digital seperti Pulsa, Transfer, PPOB, dan lainnya langsung melalui WhatsApp.

---

## 🚀 Fitur Utama

- 🔐 **Verifikasi Nomor WA**  
  Pengguna diminta memasukkan nomor WhatsApp sebelum bisa mengakses menu layanan.

- 📋 **Menu Layanan Otomatis**  
  Pilihan layanan seperti:
  - Pulsa Reguler & Paket Data
  - Transfer Bank & E-Money
  - Token PLN, PDAM, BPJS, Internet, dan TV Kabel
  - Voucher Game & Streaming
  - Donasi & Asuransi

- 📱 **Kirim ke WhatsApp Admin**  
  Setelah form diisi, pesan dikirim ke admin (0816308466) via WhatsApp Web dengan format rapi otomatis.

- 💬 **Antarmuka Mirip Chat**  
  Tampilan chatbot seperti percakapan, nyaman digunakan di perangkat mobile maupun desktop.

- 💾 **Penyimpanan Lokal**  
  Nomor WA user disimpan di localStorage agar tidak perlu diisi ulang.

---

## 🛠 Teknologi Digunakan

- HTML5 + CSS3
- JavaScript DOM & localStorage
- WhatsApp Web integration (`wa.me`)
- UI ringan & animasi smooth

---

## 📷 Tampilan

> 1. Bot menyapa user dan meminta nomor WA.  
> 2. Setelah nomor dimasukkan, menu layanan muncul.  
> 3. User pilih layanan → isi form → klik “Pesan Sekarang”.  
> 4. WhatsApp terbuka otomatis dengan isi pesan siap kirim.

---

## 💡 Cara Menggunakan

1. Buka file `chat-bot.html` di browser.
2. Masukkan nomor WhatsApp untuk mulai.
3. Ketik `menu` untuk melihat daftar layanan.
4. Isi form layanan, klik “Pesan Sekarang”.
5. WhatsApp akan terbuka dengan isi pesan otomatis.

---

## ⚠️ Catatan Penting

- Chatbot **tidak mengirim pesan otomatis** ke admin.
- Pesan dikirim menggunakan WhatsApp user sendiri via `wa.me`.
- Jika ingin pengiriman otomatis dari sistem ke WA admin, dibutuhkan integrasi dengan WhatsApp Gateway (Wablas, Twilio, dll).

---

## 🎯 Cocok Untuk

- Agen pulsa dan PPOB mandiri
- UMKM yang butuh sistem pemesanan otomatis ke WA
- Layanan digital seperti token PLN, transfer bank, dll

---

## 👤 Pengembang

Dibuat dengan ❤️ oleh **Ragil Gunawan**  
📱 WhatsApp: [0816308466](https://wa.me/62816308466)

---

## 📄 Lisensi

Proyek ini bersifat open-source dan bebas digunakan atau dimodifikasi.  
Lisensi: MIT License
