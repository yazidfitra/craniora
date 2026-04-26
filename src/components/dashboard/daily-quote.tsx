"use client";

import { useState, useEffect } from "react";

const QUOTES = [
  "Kesuksesan adalah hasil dari kerja keras dan ketekunan.",
  "Belajar hari ini untuk masa depan yang lebih baik.",
  "Pengetahuan adalah kekuatan, belajarlah setiap hari.",
  "Jangan pernah berhenti belajar, karena hidup tidak pernah berhenti mengajar.",
  "Setiap hari adalah kesempatan baru untuk belajar sesuatu yang baru.",
  "Belajar bukanlah tentang menguasai segalanya, tetapi memahami hal-hal yang penting.",
  "Pendidikan adalah paspor ke masa depan, karena besok milik mereka yang mempersiapkannya hari ini.",
  "Kunci kesuksesan adalah belajar dari setiap kegagalan.",
  "Masa depanmu dimulai dari apa yang kamu pelajari hari ini.",
  "Investasi terbaik yang dapat kamu lakukan adalah investasi pada dirimu sendiri.",
  "Berani mencoba adalah langkah pertama menuju keberhasilan.",
  "Kegagalan adalah kesempatan untuk memulai lagi dengan lebih bijaksana.",
  "Jangan pernah ragu untuk bertanya, karena dengan bertanya, kita akan belajar lebih banyak.",
  "Ketika kamu berhenti belajar, kamu berhenti berkembang.",
  "Belajar adalah proses yang tidak pernah berakhir.",
  "Setiap buku adalah jendela ke dunia yang baru.",
  "Semakin banyak kamu belajar, semakin banyak kamu tahu; semakin banyak kamu tahu, semakin besar potensimu.",
  "Ilmu adalah harta yang tak ternilai, yang tidak akan pernah bisa dicuri.",
  "Belajar adalah kunci untuk membuka pintu kesempatan.",
  "Tetaplah merasa bodoh agar terus belajar dan tetaplah merasa lapar agar terus berusaha. — Steve Jobs",
  "Terima masa lalu dan belajar darinya. Setiap pengalaman membentukmu menjadi individu yang unik.",
  "Belajarlah dari kesalahan, tapi jangan pernah menjadikannya beban.",
  "Jangan menyerah pada kritik, tetapi gunakanlah sebagai kesempatan untuk belajar dan berkembang.",
  "Pendidikan bukan cuma pergi ke sekolah dan mendapatkan gelar. Tapi, juga soal memperluas pengetahuan dan menyerap ilmu kehidupan. — Shakuntala Devi",
  "Janganlah pernah menyerah ketika kamu masih mampu berusaha lagi. Tidak ada kata berakhir sampai kamu berhenti mencoba. — Brian Dyson",
];

export default function DailyQuote() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Pick random starting index
  useEffect(() => {
    setIndex(Math.floor(Math.random() * QUOTES.length));
  }, []);

  // Rotate every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % QUOTES.length);
        setFade(true);
      }, 300);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-secondary-container/50 border border-secondary-500/20 rounded-2xl px-5 py-4">
      <p
        className={`text-sm text-on-surface-variant italic leading-relaxed transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        &ldquo;{QUOTES[index]}&rdquo;
      </p>
    </div>
  );
}
