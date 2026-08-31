/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Phone, Mail, MapPin, ExternalLink, Globe, Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#050A14] text-slate-300 dark:text-slate-400 border-t border-slate-700 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-dpr-emerald dark:via-dpr-gold to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-auto shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-html-element-for-svg */}
                <img
                  src="/images/logo-dpr.svg"
                  alt="Lambang DPR RI"
                  className="h-14 w-auto object-contain drop-shadow-md"
                />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base leading-tight">Dewan Perwakilan Rakyat</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-300 font-bold">Republik Indonesia</p>
                  <span className="bg-dpr-emerald dark:bg-dpr-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    KOMISI XIII
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              Komisi XIII DPR RI membidangi Reformasi Hukum, Hak Asasi Manusia (HAM), Keimigrasian, Pemasyarakatan, Antikorupsi, dan Kepegawaian Negara.
            </p>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-dpr-gold shrink-0 mt-0.5" />
                <span>Gedung Nusantara II Lantai 1, Jl. Jend. Gatot Subroto, Jakarta Pusat 10270</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-dpr-gold shrink-0" />
                <span>(021) 5715-341 / Ext. 1300</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-dpr-gold shrink-0" />
                <span>set_komisi13@dpr.go.id</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-slate-700 dark:border-white/10 flex items-center gap-2">
              <Scale className="w-4 h-4 text-dpr-gold" />
              <span>Navigasi Portal</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="/anggota" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Daftar Pimpinan & Anggota
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Berita & Siaran Pers Parlemen
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Tugas, Fungsi & Ruang Lingkup
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Jadwal Rapat & Siaran Live
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Partners */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-slate-700 dark:border-white/10 flex items-center gap-2">
              <Globe className="w-4 h-4 text-dpr-gold" />
              <span>Mitra Kerja Komisi XIII</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Kementerian Hukum RI</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Kementerian HAM RI</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Kementerian Imigrasi & Pemasyarakatan</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Komisi Pemberantasan Korupsi (KPK)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Komnas HAM & LPSK</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• BNPT & BKN</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
            </ul>
          </div>

          {/* Public Transparency Statement */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm pb-2 border-b border-slate-700 dark:border-white/10">
              Keterbukaan Informasi
            </h4>
            <p className="text-xs leading-relaxed text-slate-300 dark:text-slate-400">
              Setiap hasil risalah rapat, draf rancangan undang-undang, serta risalah pengawasan Komisi XIII DPR RI bersifat terbuka dan dapat diakses oleh publik sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
            </p>
            <div className="p-3 rounded-xl bg-slate-800 dark:bg-dpr-navy-card border border-dpr-gold/20 text-[11px] text-slate-300">
              <span className="font-semibold text-dpr-gold block mb-0.5">Layanan Informasi PPID:</span>
              Jam Kerja: Senin - Jumat (08:00 - 16:00 WIB)
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 Golkar Internship Student. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <Link href="/kebijakan-privasi" className="hover:text-dpr-gold transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat-penggunaan" className="hover:text-dpr-gold transition-colors">Syarat Penggunaan</Link>
            <Link href="/peta-situs" className="hover:text-dpr-gold transition-colors">Peta Situs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
