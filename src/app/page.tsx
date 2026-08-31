"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { STATS, MITRA_KERJA, BERITA_LIST, AGENDA_LIST, NewsArticle, AgendaItem } from "@/lib/data";
import NewsModal from "@/components/NewsModal";
import AgendaModal from "@/components/AgendaModal";
import { Shield, Users, Scale, FileText, ArrowRight, Play, Calendar, CheckCircle2, MessageSquare, Sparkles, Building2, Gavel, MapPin, Clock, Mail, Instagram, User, ExternalLink, Phone, Youtube, Twitter, Globe, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaItem | null>(null);

  return (
    <div className="space-y-20 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-hero-gradient-light dark:bg-hero-gradient pt-10 pb-20 transition-colors duration-300">
        {/* Decorative Lighting Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-dpr-emerald/15 dark:bg-dpr-red/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-dpr-gold/20 dark:bg-dpr-gold/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-dpr-gold/10 border border-emerald-300 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
                <Sparkles className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                <span>Parlemen Transparan & Akuntabel • Periode 2024-2029</span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {/* Tier 1: Main Title */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-[1.15]">
                  Dewan Perwakilan Rakyat Republik Indonesia (DPR RI)
                </h1>

                {/* Tier 2: Subtitle */}
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-dpr-emerald dark:text-red-600 uppercase tracking-wide">
                  KOMISI XIII
                </h2>

                {/* Tier 3: Smaller Description */}
                <p className="text-base sm:text-xl font-bold text-slate-700 dark:text-slate-300">
                  Reformasi Hukum & HAM
                </p>
              </div>

              <p className="text-slate-800 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                Komisi XIII DPR RI bertugas mengawasi legislasi, anggaran, dan kinerja penegakan hukum nasional bersama Kementerian Hukum, KemenHAM, Kemenimipas, KPK, BNPT, Komnas HAM, dan LPSK.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/anggota"
                  className="bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-md dark:shadow-gold-glow hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Daftar Anggota Komisi</span>
                </Link>

                <Link
                  href="/agenda"
                  className="glass-panel text-slate-900 dark:text-white hover:text-dpr-emerald dark:hover:text-dpr-gold font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full border border-slate-300 dark:border-white/15 transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                  <span>Jadwal Rapat Kerja</span>
                </Link>
              </div>

              {/* Quick Live Hearing Callout */}
              {AGENDA_LIST.some((a) => a.status === "LIVE NOW") && (
                <div
                  onClick={() => setSelectedAgenda(AGENDA_LIST.find((a) => a.status === "LIVE NOW") || null)}
                  className="glass-panel-emerald dark:glass-panel-red p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4 mt-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dpr-emerald dark:bg-dpr-red flex items-center justify-center shrink-0">
                      <Play className="w-5 h-5 text-white ml-0.5 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-dpr-emerald dark:bg-dpr-red text-white font-bold px-2 py-0.5 rounded uppercase">SEDANG SIARAN</span>
                        <span className="text-xs text-dpr-emerald-dark dark:text-dpr-gold font-bold">Ruang Komisi XIII</span>
                      </div>
                      <p className="text-xs text-slate-900 dark:text-white font-bold truncate max-w-md">
                        {AGENDA_LIST.find((a) => a.status === "LIVE NOW")?.title}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0" />
                </div>
              )}
            </motion.div>

            {/* Right Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-dpr-gold/30 shadow-2xl relative space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-black text-lg sm:text-xl tracking-tight">KAPASITAS LEGISLASI</h3>
                    <p className="text-xs sm:text-sm text-dpr-emerald-dark dark:text-dpr-gold font-bold mt-0.5">Periode Sidang 2024-2029</p>
                  </div>
                  <Gavel className="w-6 h-6 text-dpr-emerald dark:text-dpr-gold opacity-80" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-dpr-navy-card p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                    <span className="text-2xl sm:text-3xl font-extrabold text-dpr-emerald-dark dark:text-dpr-gold block">{STATS.activeBills}</span>
                    <span className="text-xs text-slate-800 dark:text-slate-300 font-semibold">RUU Prolegnas Prioritas</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-dpr-navy-card p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block">{STATS.completedHearings}+</span>
                    <span className="text-xs text-slate-800 dark:text-slate-300 font-semibold">RDP & Raker Selesai</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-900 dark:text-slate-300 font-medium">
                    <span>Fokus Pengawasan HAM & Imigrasi</span>
                    <span className="text-dpr-emerald-dark dark:text-dpr-gold font-bold">94% Target</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-dpr-emerald dark:bg-gold-gradient h-full rounded-full w-[94%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-dpr-red/25 border border-emerald-200 dark:border-dpr-red/40 text-xs text-slate-900 dark:text-slate-100 leading-relaxed italic">
                  &quot;Menjamin kepastian hukum yang adil serta perlindungan hak asasi seluruh warga negara Indonesia tanpa diskriminasi.&quot;
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- STATS COUNTER BAR --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xl">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-dpr-emerald-dark dark:text-dpr-gold">{STATS.totalMembers}</span>
            <span className="text-xs text-slate-800 dark:text-slate-300 font-bold block uppercase tracking-wider">Anggota Parlemen</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{STATS.mitraKerjaCount}</span>
            <span className="text-xs text-slate-800 dark:text-slate-300 font-bold block uppercase tracking-wider">Kementerian & Lembaga</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-dpr-emerald-dark dark:text-dpr-gold">{STATS.completedHearings}+</span>
            <span className="text-xs text-slate-800 dark:text-slate-300 font-bold block uppercase tracking-wider">Rapat Kemitraan</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{STATS.aspirationsProcessed}</span>
            <span className="text-xs text-slate-800 dark:text-slate-300 font-bold block uppercase tracking-wider">Aspirasi Diproses</span>
          </div>
        </div>
      </section>

      {/* --- MITRA KERJA SHOWCASE --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">KEMITRAAN STRATEGIS</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">Mitra Kerja Komisi XIII DPR RI</h2>
          <p className="text-slate-800 dark:text-slate-300 text-xs sm:text-sm font-medium">
            Komisi XIII melakukan pengawasan berkala dan pembagian alokasi anggaran bersama 8 Kementerian & Lembaga Negara Republik Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MITRA_KERJA.map((mitra) => (
            <motion.div
              key={mitra.id}
              whileHover={{ y: -5 }}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 dark:bg-dpr-gold/15 text-dpr-emerald-dark dark:text-dpr-gold font-bold text-xs px-3 py-1 rounded-full border border-emerald-300 dark:border-dpr-gold/30">
                    {mitra.acronym}
                  </span>
                  <Building2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-base">{mitra.name}</h3>
                <p className="text-slate-800 dark:text-slate-300 text-xs line-clamp-3 leading-relaxed">
                  {mitra.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-700 dark:text-slate-400 font-medium">
                Pimpinan: <span className="text-dpr-emerald-dark dark:text-dpr-gold font-bold">{mitra.ministerOrHead}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- LATEST NEWS & AGENDA SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">INFORMASI TERKINI</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Berita & Siaran Pers Komisi XIII</h2>
          </div>
          <Link href="/berita" className="text-xs text-dpr-emerald-dark dark:text-dpr-gold font-bold hover:underline flex items-center gap-1">
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BERITA_LIST.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedNews(article)}
              className="glass-panel rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div style={{ position: "relative" }} className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-dpr-emerald dark:bg-dpr-red text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                    {article.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[11px] text-dpr-emerald-dark dark:text-dpr-gold font-bold">{article.date}</span>
                  <h3 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-2 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-slate-800 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 text-xs text-dpr-emerald-dark dark:text-dpr-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- LOKASI & MEDIA SOSIAL RESMI KOMISI XIII DPR RI SECTION --- */}
      <section id="lokasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>KANTOR SEKRETARIAT & KANAL INFORMASI</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Lokasi & Media Sosial Resmi <span className="text-dpr-emerald dark:text-dpr-gold">Komisi XIII DPR RI</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Gedung Nusantara II, Kompleks Parlemen DPR/MPR RI, Jl. Jend. Gatot Subroto, Senayan, Jakarta Pusat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* MAP DISPLAY (KIRI) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl min-h-[350px] lg:min-h-[440px] relative flex flex-col justify-between">
            <div className="absolute top-4 left-4 z-10">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white text-blue-600 text-[13px] font-semibold px-3 py-2 rounded shadow-sm border border-slate-200 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                <span>Buka di Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <iframe
              title="Lokasi Komisi XIII DPR RI"
              src="https://maps.google.com/maps?q=Gedung+Nusantara+II+DPR+RI&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[350px] filter contrast-[1.05] grayscale-[0.2] dark:contrast-125 dark:invert-[0.9] dark:hue-rotate-180"
            />
          </div>

          {/* INFORMASI KONTAK & MEDIA SOSIAL (KANAN) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* CARD LOKASI & JAM AKTIF */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 bg-white/80 dark:bg-slate-900/80 shadow-lg">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                <Building2 className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
                <span>Informasi Jam Layanan</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Jam Operasional Layanan Publik</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">Senin & Kamis: 14.00 – 17.00 WIB (Ruang Sekretariat)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Email Resmi Sekretariat</span>
                    <a href="mailto:komisi13@dpr.go.id" className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-xs">
                      komisi13@dpr.go.id
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* AKUN MEDIA SOSIAL RESMI GRID */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 bg-white/80 dark:bg-slate-900/80 shadow-lg">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                <Share2 className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
                <span>Akun Media Sosial Resmi</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://instagram.com/dpr_ri"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-pink-500 transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-pink-600 transition-colors">Instagram</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">@komisi13dpr</span>
                  </div>
                </a>

                <a
                  href="https://youtube.com/@DPRRIOfficial"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-red-500 transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-red-600 transition-colors">YouTube</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">DPR RI Official</span>
                  </div>
                </a>

                <a
                  href="https://x.com/DPR_RI"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-slate-800 dark:hover:border-white transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white flex items-center justify-center shrink-0">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-500 transition-colors">X (Twitter)</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">@DPR_RI</span>
                  </div>
                </a>

                <a
                  href="https://www.dpr.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-emerald-500 transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 transition-colors">Website DPR</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">dpr.go.id</span>
                  </div>
                </a>
              </div>
            </div>

            {/* BANNER LAYANAN ASPIRASI KHUSUS */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-dpr-emerald to-emerald-700 dark:from-dpr-red dark:to-red-900 text-white shadow-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wide">Punya Aspirasi Rakyat?</h4>
                <p className="text-xs opacity-90">Sampaikan aduan & masukan Anda di Halaman Khusus Aspirasi.</p>
              </div>
              <Link
                href="/aspirasi"
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-full shadow-md shrink-0 flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <span>Form Aspirasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Modals */}
      <NewsModal article={selectedNews} onClose={() => setSelectedNews(null)} />
      <AgendaModal agenda={selectedAgenda} onClose={() => setSelectedAgenda(null)} />

    </div>
  );
}
