/**
 * Data 100 Pertanyaan & Tantangan untuk Game Ular Tangga Kartu Pasangan
 * Diambil lengkap dari 100 PERTANYAAN.md
 */

const GAME_QUESTIONS = {
  deeptalk: [
    { id: 1, text: "Hal apa dari awal hubungan kita yang paling sering kamu ingat?" },
    { id: 2, text: "Kapan momen kamu merasa paling dicintai olehku?" },
    { id: 3, text: "Apa ketakutan terbesar kamu mengenai hubungan kita ke depan?" },
    { id: 4, text: "Kebiasaan kecil dariku apa yang tanpa sadar bikin kamu tersenyum?" },
    { id: 5, text: "Impian apa yang paling ingin kita capai bersama dalam tiga tahun ke depan?" },
    { id: 6, text: "Bagaimana caraku membantu kamu saat kamu sedang merasa stres atau lelah?" },
    { id: 7, text: "Menurutmu, sifat apa dari diriku yang paling melengkapi sifatmu?" },
    { id: 8, text: "Penyesalan apa yang pernah kamu rasakan terkait cara kita menyelesaikan masalah?" },
    { id: 9, text: "Momen sulit apa dalam hubungan ini yang justru membuat kita semakin kuat?" },
    { id: 10, text: "Apa hal baru yang ingin kamu coba lakukan bersamaku tahun ini?" },
    { id: 11, text: "Menurutmu, apa perbedaan terbesar antara kita dan bagaimana cara kita menyikapinya?" },
    { id: 12, text: "Pertengkaran mana yang paling memberikan pelajaran berharga untukmu?" },
    { id: 13, text: "Apa batasan personal yang paling penting bagimu dalam hubungan ini?" },
    { id: 14, text: "Kapan terakhir kali kamu merasa bangga memiliki pasangan sepertiku?" },
    { id: 15, text: "Hal apa dari dalam dirimu yang terasa makin membaik sejak kita bersama?" },
    { id: 16, text: "Bagaimana definisi hari yang sempurna versi kamu jika kita lewati berdua?" },
    { id: 17, text: "Apa topik yang paling sering kamu hindari untuk dibicarakan denganku dan apa alasannya?" },
    { id: 18, text: "Tindakan nyata apa yang paling kamu harapkan dariku saat kamu sedang sedih?" },
    { id: 19, text: "Tempat mana yang menyimpan kenangan paling manis buat kamu selama kita berhubungan?" },
    { id: 20, text: "Bagian mana dari gaya komunikasiku yang menurutmu masih perlu kuperbaiki?" },
    { id: 21, text: "Apa pujian dariku yang paling membekas di hatimu sampai sekarang?" },
    { id: 22, text: "Pengorbanan apa yang pernah kamu lakukan demi hubungan ini yang jarang kuketahui?" },
    { id: 23, text: "Nilai hidup apa yang paling kamu pegang teguh dalam membangun masa depan bersama?" },
    { id: 24, text: "Bagaimana pandanganmu tentang pembagian peran dan tanggung jawab di antara kita?" },
    { id: 25, text: "Apa ketakutan terselubungmu tentang menjadi tua bersama?" },
    { id: 26, text: "Kapan kamu merasa kita benar-benar kompak sebagai tim?" },
    { id: 27, text: "Menurutmu, apa yang perlu kita lakukan agar rasa bosan tidak merusak hubungan ini?" },
    { id: 28, text: "Bahasa kasih apa yang paling membuatmu merasa dihargai?" },
    { id: 29, text: "Hal apa yang paling kamu syukuri dari takdir yang mempertemukan kita?" },
    { id: 30, text: "Jika kamu bisa mengubah satu keputusan di masa lalu hubungan kita, apa yang akan kamu ubah?" }
  ],

  truth: [
    { id: 31, text: "Pernahkah kamu pura-pura menyukai hadiah yang kuberikan?" },
    { id: 32, text: "Kebiasaan aneh apa dariku yang sebenarnya cukup mengganggumu?" },
    { id: 33, text: "Berapa kali kamu mengecek media sosialku sebelum kita resmi berpacaran atau menikah?" },
    { id: 34, text: "Kapan kesan pertamamu tentangku yang ternyata salah besar?" },
    { id: 35, text: "Kebohongan kecil apa yang pernah kamu ucapkan kepadaku agar aku tidak marah?" },
    { id: 36, text: "Apakah kamu pernah cemburu pada teman dekatku? Siapa orangnya?" },
    { id: 37, text: "Hal apa dari diriku yang pertama kali membuat kamu tertarik padaku?" },
    { id: 38, text: "Siapa di antara anggota keluargaku yang paling membuatmu canggung saat pertama bertemu?" },
    { id: 39, text: "Pernahkah kamu merasa ragu untuk melanjutkan hubungan ini? Momen apa itu?" },
    { id: 40, text: "Baju atau gaya penampilanku yang mana yang sebenarnya kurang kamu sukai?" },
    { id: 41, text: "Apa rahasia kecilmu yang sampai sekarang belum pernah kamu ceritakan ke siapa pun?" },
    { id: 42, text: "Lagu apa yang selalu mengingatkanmu padaku?" },
    { id: 43, text: "Apakah ada janji yang pernah kamu buat denganku tetapi belum kamu tepati?" },
    { id: 44, text: "Berapa lama waktu yang kamu butuhkan untuk menyadari bahwa kamu jatuh cinta padaku?" },
    { id: 45, text: "Menurutmu, siapa yang lebih sering mengalah dalam hubungan ini saat terjadi perselisihan?" },
    { id: 46, text: "Pernahkah kamu sengaja mematikan atau mengabaikan notifikasi pesan dariku?" },
    { id: 47, text: "Sifat negatif apa darimu yang paling sering kamu sembunyikan dariku?" },
    { id: 48, text: "Menurutmu, mantan pasanganku yang mana yang pernah membuatmu penasaran?" },
    { id: 49, text: "Hal paling memalukan apa yang pernah kamu alami di depanku?" },
    { id: 50, text: "Makanan apa buatanku atau pilihanku yang sebenarnya tidak terlalu cocok di lidahmu?" },
    { id: 51, text: "Kapan terakhir kali kamu menangis karena perbuatanku atau kata-kataku?" },
    { id: 52, text: "Apa kebiasaan tidurku yang paling sering membuatmu terbangun di malam hari?" },
    { id: 53, text: "Apakah kamu pernah membandingkan hubungan kita dengan hubungan orang lain?" },
    { id: 54, text: "Bagian tubuhku mana yang paling kamu sukai?" },
    { id: 55, text: "Apa impian pribadimu yang belum sempat kamu raih karena fokus pada hubungan ini?" },
    { id: 56, text: "Momen mana yang paling membuatmu merasa canggung saat kita berdua?" },
    { id: 57, text: "Apakah kamu pernah lupa tanggal penting dalam hubungan kita dan pura-pura ingat?" },
    { id: 58, text: "Hal apa yang paling sering membuatmu kesal dariku saat kita sedang bepergian bersama?" },
    { id: 59, text: "Jika ada satu sifatku yang bisa hilang secara ajaib, sifat apa yang kamu pilih?" },
    { id: 60, text: "Siapa orang pertama yang kamu ajak bicara ketika kita sedang bertengkar?" }
  ],

  dare: [
    { id: 61, text: "Tatap mata pasanganmu tanpa berkedip selama 30 detik." },
    { id: 62, text: "Cium pipi kanan dan kiri pasanganmu sambil membisikkan kata manis." },
    { id: 63, text: "Pijat bahu pasanganmu selama dua menit penuh." },
    { id: 64, text: "Buatkan minuman atau ambilkan cemilan untuk pasanganmu sekarang." },
    { id: 65, text: "Nyanyikan satu bait lagu romantis favorit pasanganmu dengan gaya opera." },
    { id: 66, text: "Peluk pasanganmu dari belakang dan tahan selama satu menit." },
    { id: 67, text: "Buat puisi spontan berisi empat baris tentang kebaikan pasanganmu." },
    { id: 68, text: "Biarkan pasanganmu merias wajahmu atau menata rambutmu selama tiga menit." },
    { id: 69, text: "Sandarkan kepalamu di pangkuan pasanganmu sampai putaran berikutnya selesai." },
    { id: 70, text: "Ucapkan tiga hal yang paling kamu syukuri dari pasanganmu sambil memegang kedua tangannya." },
    { id: 71, text: "Lakukan tarian romantis singkat bersama pasangan tanpa diiringi musik." },
    { id: 72, text: "Kirim pesan singkat berisi ucapan terima kasih romantis ke nomor pasanganmu sekarang." },
    { id: 73, text: "Berikan kecupan singkat di dahi, hidung, dan kedua kelopak mata pasanganmu." },
    { id: 74, text: "Izinkan pasanganmu melihat album foto lama di ponselmu selama satu menit." },
    { id: 75, text: "Tirukan gaya atau ucapan khas pasanganmu saat dia sedang merajuk." },
    { id: 76, text: "Genggam tangan pasanganmu dan jangan dilepaskan sampai dua putaran permainan berikutnya." },
    { id: 77, text: "Berikan pujian yang jujur tentang penampilan pasanganmu hari ini." },
    { id: 78, text: "Katakan kalimat aku sayang kamu menggunakan tiga bahasa daerah atau bahasa asing yang berbeda." },
    { id: 79, text: "Pijat telapak kaki atau tangan pasanganmu secara lembut selama dua menit." },
    { id: 80, text: "Ambil foto selfie mesra berdua menggunakan ponsel pasanganmu dan jadikan latar layar selama sehari." },
    { id: 81, text: "Biarkan pasanganmu menentukan satu aturan kecil yang harus kamu ikuti hingga permainan selesai." },
    { id: 82, text: "Usap rambut pasanganmu sambil menatap matanya selama 40 detik." },
    { id: 83, text: "Ceritakan lelucon konyol sampai pasanganmu tertawa." },
    { id: 84, text: "Ulangi reka adegan momen saat kamu pertama kali menyatakan perasaan ke pasanganmu." },
    { id: 85, text: "Berikan panggilan sayang baru yang unik dan gunakan panggilan itu sepanjang sisa permainan." },
    { id: 86, text: "Minta maaf atas satu kesalahan kecil yang pernah kamu buat dan peluk pasanganmu." },
    { id: 87, text: "Bisikkan rahasia lucu yang belum pernah pasanganmu dengar sebelumnya." },
    { id: 88, text: "Biarkan pasanganmu memilihkan posisi dudukmu sampai putaran berikutnya." },
    { id: 89, text: "Tuliskan satu kalimat janji manismu di selembar kertas dan serahkan ke pasanganmu." },
    { id: 90, text: "Kecup telapak tangan pasanganmu dengan lembut." }
  ],

  special: [
    { id: 91, text: "Mulai dengan senyuman hangat dan saling mendoakan sebelum melempar dadu." },
    { id: 92, text: "Ucapkan kalimat I love you dengan tulus ke arah pasanganmu." },
    { id: 93, text: "Pegang erat tangan pasanganmu selama lima detik tanpa melepaskannya." },
    { id: 94, text: "Tatap mata pasanganmu dengan lembut selama lima detik penuh." },
    { id: 95, text: "Berikan ucapan selamat dan pelukan hangat kepada pemenang permainan." },
    { id: 96, text: "Bisikkan satu kalimat penyemangat untuk pasanganmu." },
    { id: 97, text: "Berikan tepuk tangan dan pujian atas langkah yang diambil pasanganmu." },
    { id: 98, text: "Saling berjabat tangan dan sepakat untuk menikmati permainan bersama." },
    { id: 99, text: "Elus pipi pasanganmu secara lembut sebelum melanjutkan putaran." },
    { id: 100, text: "Ucapkan rasa terima kasih atas waktu yang dihabiskan bersama hari ini." }
  ]
};

// Flattened lookup for easy retrieval by ID
const ALL_QUESTIONS_MAP = {};
[...GAME_QUESTIONS.deeptalk, ...GAME_QUESTIONS.truth, ...GAME_QUESTIONS.dare, ...GAME_QUESTIONS.special].forEach(q => {
  ALL_QUESTIONS_MAP[q.id] = q;
});
