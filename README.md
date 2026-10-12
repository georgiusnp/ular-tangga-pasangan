# 🎲 Ular Tangga Kartu Pasangan (Couple Play) 💕

Aplikasi web interaktif modern **"Ular Tangga Kartu Pasangan - Couple Play"** yang seru, romantis, dan bikin hubungan makin dekat. Mengadaptasi papan permainan 80 kotak dan menggunakan seluruh materi dari **100 PERTANYAAN.md**.

Aplikasi ini bersifat **Zero-Dependency** (Pure HTML5, CSS3, & Vanilla JavaScript), bekerja **100% offline**, dan siap di-hosting ke platform gratisan mana pun dalam hitungan detik!

---

## ✨ Fitur Unggulan

1. **Papan Ular Tangga 80 Kotak (Serpentine Grid)**
   - Tata letak identik dengan papan fisik (Kotak 1 kiri-bawah hingga Kotak 80 kiri-atas).
   - Visual tangga kayu dan ular bergelombang digambar secara dinamis dengan SVG resolusi tinggi.
   - Kotak interaktif: **Truth**, **Dare**, **Deep Talk**, **Kotak Spesial**, **Tangga**, dan **Ular**.

2. **Dadu 3D & Gerakan Pion Realistis**
   - Animasi lempar dadu 3D dengan efek rotasi realistis.
   - Pion melompat halus kotak demi kotak (*step-by-step hop*).
   - Animasi selebrasi saat menaiki tangga dan meluncur saat terkena ular.

3. **100 Kartu Pertanyaan & Tantangan Lengkap**
   - **30 Deep Talk** (Pertanyaan mendalam tentang hubungan & masa depan).
   - **30 Truth** (Pertanyaan kejujuran tanpa bohong).
   - **30 Dare** (Tantangan romantis dan lucu).
   - **10 Instruksi Kotak Spesial** (Instruksi romantis pada kotak tertentu).

4. **Multi-Pilihan Tema Warna (Sesuai Permintaan)**
   Dapat diganti secara instan langsung dari menu atas:
   - 🌹 **Tema Rose** (Merah & Pink Romantis - tema asli papan fisik)
   - 🌌 **Tema Midnight** (Dark Mode Elegan bernuansa malam romantis)
   - 🪻 **Tema Lavender** (Ungu Pastel yang lembut & menenangkan)
   - 🌅 **Tema Sunset** (Peach & Oranye hangat senja)
   - 🍃 **Tema Emerald** (Hijau Zamrud & Sage segar)

5. **Mode Cabut Kartu Cepat (Quick Draw)**
   - Bisa bermain cabut kartu Deep Talk, Truth, atau Dare tanpa harus bermain di papan. Sangat cocok saat rebahan, di kafe, atau di perjalanan mobil.

6. **Aturan Resmi & Batas Skip**
   - Fitur *Skip Challenge* otomatis membatasi maksimal 2 kali skip per pemain sesuai aturan permainan resmi.
   - Papan riwayat aktivitas permainan (*Game Log*).

7. **Audio Synthesizer Mandiri (Web Audio API)**
   - Efek suara lempar dadu, langkah pion, naik tangga, meluncur ular, dan kemenangan fanfare tanpa perlu file audio luar (hemat kuota & anti-error).

8. **Kemenangan & Efek Konfeti Romantis**
   - Animasi konfeti berbentuk hati dan bintang saat pemain mencapai kotak 80 (FINISH).

---

## 🚀 Cara Menjalankan Secara Lokal (Offline)

Anda tidak perlu menginstall software apa pun!
1. Buka folder ini di komputer atau HP Anda.
2. Klik dua kali file **`index.html`**.
3. Permainan langsung terbuka di browser (Chrome, Edge, Safari, Firefox) dan siap dimainkan!

---

## 🌐 Cara Upload ke Web Hosting Gratisan

Aplikasi ini terdiri dari file statis (`index.html`, `style.css`, `app.js`, `questions.js`, `audio.js`, `confetti.js`). Anda bisa mengunggahnya ke penyedia hosting web gratisan berikut:

### 1. Netlify Drop (Paling Cepat & Mudah - Tanpa Koding)
1. Buka situs [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Daftarkan akun gratis (bisa pakai Google/GitHub).
3. Tarik (*drag & drop*) folder `ular-tangga-pasangan` ini ke area kotak di layar.
4. Dalam beberapa detik, Netlify akan memberikan alamat web gratis (misal: `couple-play-xyz.netlify.app`) yang bisa langsung dibuka dari HP berdua!

### 2. Vercel
1. Buka [https://vercel.com](https://vercel.com) dan buat akun gratis.
2. Klik **Add New Project** lalu deploy folder ini atau via GitHub repository.

### 3. GitHub Pages
1. Buat repository publik baru di GitHub.
2. Upload semua file dari folder ini ke branch `main`.
3. Masuk ke tab **Settings** > **Pages** di repository Anda.
4. Pilih **Source: Deploy from a branch** > branch `main` > save.
5. Web Anda akan aktif di `https://username.github.io/nama-repo/`.

### 4. Cloudflare Pages
1. Masuk ke dashboard Cloudflare Pages.
2. Pilih **Direct Upload**, upload folder proyek ini, dan dapatkan link `.pages.dev` gratis dengan performa sangat cepat di seluruh dunia.

---

## 📱 Tips Bermain di HP
- Buka website di browser Chrome (Android) atau Safari (iOS).
- Klik tombol menu browser > pilih **"Tambahkan ke Layar Utama" / "Add to Home Screen"**.
- Game akan terpasang layaknya aplikasi Android/iOS asli dengan tampilan layar penuh!
