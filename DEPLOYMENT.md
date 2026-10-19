# 🚀 Panduan Publikasi (Deployment) FLUIDLAB ke Internet

Website **FLUIDLAB — Asas Kontinuitas** dirancang dengan arsitektur web modern yang ringan, cepat, dan **bebas proses kompilasi rumit** (*zero-build static site*). 

Website ini dapat langsung dipublikasikan ke internet secara **GRATIS** dan mendapatkan tautan publik berprotokol HTTPS (contoh: `https://fluidlab-kontinuitas.netlify.app` atau `https://fluidlab.vercel.app`) sehingga dapat langsung dibagikan kepada seluruh siswa SMA dari jaringan Wi-Fi sekolah maupun kuota data seluler smartphone tanpa batasan `localhost`.

---

## 🌟 Metode 1: Netlify Drop (PALING MUDAH — Selesai dalam 1 Menit, Tanpa Koding)

Ini adalah cara paling cepat dan ramah bagi guru maupun siswa:

1. Buka browser dan kunjungi: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Jika diminta login, Anda bisa masuk menggunakan akun Google atau GitHub secara gratis.
3. Buka File Explorer di komputer Anda, lalu cari folder proyek ini:
   ```
   C:\Users\TOSHIBA.DESKTOP-KP9BUOK\.gemini\antigravity\scratch\fluidlab-kontinuitas
   ```
4. **Drag & Drop (Tarik dan Lepaskan)** folder `fluidlab-kontinuitas` tersebut langsung ke area kotak unggah di halaman web Netlify Drop.
5. Tunggu proses unggah selama 5-10 detik.
6. **Selesai!** Netlify akan langsung memberikan tautan publik aktif yang bisa diklik dan dibagikan lewat WhatsApp kelas atau Google Classroom.
   *(Tips: Anda dapat mengubah nama domain acak Netlify menjadi nama keren seperti `fluidlab-fisika-xi.netlify.app` melalui menu **Site Configuration > Change site name**).*

---

## ⚡ Metode 2: Vercel (Menggunakan Vercel Dashboard / Git)

Jika Anda memiliki akun GitHub / Vercel:

### Opsi A: Drag & Drop / Impor via GitHub
1. Buat repositori baru di GitHub (misal: `fluidlab-kontinuitas`).
2. Unggah seluruh isi file di folder `fluidlab-kontinuitas` ke repositori tersebut.
3. Masuk ke **[https://vercel.com](https://vercel.com)**.
4. Klik tombol **"Add New..."** → **"Project"**.
5. Pilih repositori GitHub Anda, lalu klik **"Deploy"**.
6. Vercel akan membaca konfigurasi `vercel.json` dan aplikasi akan aktif secara global dalam hitungan detik.

### Opsi B: Menggunakan Vercel CLI di Terminal
Jika Anda telah memasang Node.js:
1. Buka terminal PowerShell di folder proyek ini:
   ```powershell
   cd C:\Users\TOSHIBA.DESKTOP-KP9BUOK\.gemini\antigravity\scratch\fluidlab-kontinuitas
   ```
2. Jalankan perintah:
   ```powershell
   npx vercel
   ```
3. Ikuti petunjuk di layar (tekan Enter untuk opsi bawaan).
4. Proyek akan langsung live dengan domain `.vercel.app`.

---

## 🌐 Metode 3: GitHub Pages (Alternatif Gratis Selamanya)

1. Buat repositori publik di akun GitHub Anda bernama `fluidlab-kontinuitas`.
2. Unggah seluruh file (`index.html`, `css/`, `js/`, dll).
3. Masuk ke menu **Settings** di repositori GitHub > klik tab **Pages** di sebelah kiri.
4. Pada bagian **Build and deployment > Branch**, pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu 1 menit, website akan aktif di:
   `https://<username-github>.github.io/fluidlab-kontinuitas/`

---

## 🧪 Cara Menjalankan Pratinjau di Komputer Lokal

Jika ingin menguji coba terlebih dahulu di komputer sendiri:
- Cukup klik dua kali (double click) file `index.html` menggunakan Google Chrome, Microsoft Edge, atau Firefox.
- Atau jalankan perintah lokal:
  ```powershell
  cd C:\Users\TOSHIBA.DESKTOP-KP9BUOK\.gemini\antigravity\scratch\fluidlab-kontinuitas
  npm start
  ```
  Lalu buka tautan `http://localhost:3000` di peramban web.
