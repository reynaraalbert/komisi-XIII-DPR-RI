/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BERITA_LIST, ANGGOTA_KOMISI, AGENDA_LIST } from "@/lib/data";
import { useTheme } from "@/components/ThemeProvider";
import { Shield, Users, Newspaper, Info, Calendar, Menu, X, Search, Landmark, ChevronRight, Sun, Moon, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/", icon: Landmark },
    { name: "Anggota DPR", href: "/anggota", icon: Users },
    {
      name: "Berita",
      href: "/berita",
      icon: Newspaper,
      children: [
        { name: "Baca Berita", href: "/berita" },
        { name: "Tulis Berita", href: "/berita/tulis" }
      ]
    },
    {
      name: "Profil Komisi",
      href: "/profil",
      icon: Info,
      children: [
        { name: "Sejarah Komisi", href: "/profil/sejarah" },
        { name: "Visi & Misi", href: "/profil/visi-misi" },
        { name: "Pimpinan & Anggota", href: "/profil/pimpinan" },
        { name: "Daftar Mitra Kerja", href: "/profil/mitra-kerja" }
      ]
    },
    { name: "Agenda Rapat", href: "/agenda", icon: Calendar },
    { name: "Aspirasi", href: "/aspirasi", icon: MessageSquare },
  ];

  // Live search filtering logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matchedBerita = BERITA_LIST.filter(
      (b) => b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAnggota = ANGGOTA_KOMISI.filter(
      (m) => m.name.toLowerCase().includes(q) || m.fraksi.toLowerCase().includes(q) || m.dapil.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAgenda = AGENDA_LIST.filter(
      (a) => a.title.toLowerCase().includes(q) || a.partner.toLowerCase().includes(q)
    ).slice(0, 2);

    return { matchedBerita, matchedAnggota, matchedAgenda, totalCount: matchedBerita.length + matchedAnggota.length + matchedAgenda.length };
  }, [searchQuery]);

  return (
    <header className={`sticky z-40 transition-all duration-150 ${
      isScrolled
        ? "top-3 max-w-[1440px] mx-auto px-3 sm:px-6 pointer-events-none"
        : "top-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 shadow-md"
    }`}>
      <div className={`w-full mx-auto transition-all duration-150 ${
        isScrolled
          ? "pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl lg:rounded-full shadow-2xl border border-slate-200/90 dark:border-white/15 px-3 sm:px-6 py-2"
          : "max-w-[1536px] px-2.5 sm:px-4 lg:px-5 py-1.5 min-h-[76px] sm:min-h-[82px]"
      }`}>
        <div className="flex items-center justify-between gap-2 lg:gap-3">
          
          {/* Logo & Brand matching Photo 2 & Photo 3 (Dynamic scroll collapse) */}
          <Link href="/" className="flex items-center gap-1.5 lg:gap-2 group shrink-0 py-0.5">
            <div className={`transition-all duration-150 shrink-0 flex items-center justify-center gap-0 lg:gap-0.5 ${
              isScrolled ? "h-8 sm:h-9" : "h-[36px] sm:h-[42px] lg:h-[48px]"
            }`}>
              {/* eslint-disable-next-html-element-for-svg */}
              <img
                src="/images/logo-dpr.svg"
                alt="Lambang DPR RI"
                className={`w-auto object-contain drop-shadow-md transition-all duration-150 ${
                  isScrolled ? "h-8 sm:h-9" : "h-[36px] sm:h-[40px] lg:h-[44px]"
                }`}
              />
              <img
                src="/images/fraksi-golkar-new.png"
                alt="Fraksi Partai Golkar"
                className={`w-auto object-contain drop-shadow-md transition-all duration-150 ${
                  isScrolled ? "h-8 sm:h-9" : "h-[36px] sm:h-[40px] lg:h-[44px]"
                }`}
              />
              <img
                src="/images/golkar-internship-trans.png"
                alt="Golkar Internship"
                className={`w-auto object-contain drop-shadow-md transition-all duration-150 -ml-1 sm:-ml-2 ${
                  isScrolled ? "h-9 sm:h-10" : "h-[42px] sm:h-[46px] lg:h-[50px]"
                }`}
              />
            </div>

            <AnimatePresence mode="wait">
              {!isScrolled ? (
                <motion.div
                  key="full-brand"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col justify-center"
                >
                  <span className="text-xs sm:text-sm xl:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    Dewan Perwakilan Rakyat
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-none">
                      Republik Indonesia
                    </span>
                    <span className="bg-dpr-emerald dark:bg-dpr-gold text-white dark:text-slate-900 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-0.5 shadow-sm">
                      KOMISI XIII
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-black text-dpr-emerald dark:text-dpr-gold tracking-widest mt-1">
                    GOLKAR INTERNSHIP STUDENT
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="scrolled-brand"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <span className="bg-dpr-emerald dark:bg-dpr-gold text-white dark:text-slate-900 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    KOMISI XIII
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 p-1 sm:p-1.5 rounded-full border border-slate-200 dark:border-white/10 shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-1 lg:gap-1.5 px-1.5 lg:px-2 xl:px-3 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "text-white dark:text-dpr-navy font-bold shadow-md"
                        : "text-slate-700 dark:text-slate-200 hover:text-dpr-emerald dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-dpr-emerald dark:bg-gold-gradient rounded-full shadow-md dark:shadow-gold-glow"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1 lg:gap-1.5">
                      <Icon className={`w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 shrink-0 ${isActive ? "text-white dark:text-dpr-navy" : "text-dpr-emerald dark:text-dpr-gold"}`} />
                      <span>{link.name}</span>
                    </span>
                  </Link>

                  {link.children && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-dpr-emerald dark:hover:text-dpr-gold transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Search, Theme Toggle & Actions */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0 relative">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/15 text-slate-700 dark:text-dpr-gold hover:scale-110 transition-transform shadow-sm"
              title={theme === "dark" ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-dpr-gold animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-dpr-emerald-dark" />
              )}
            </button>

            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari RUU, berita, anggota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-28 lg:w-32 xl:w-36 bg-slate-100 dark:bg-dpr-navy text-[10px] xl:text-[11px] text-slate-900 dark:text-white placeholder-slate-400 pl-7 xl:pl-8 pr-5 py-1.5 rounded-full border border-slate-300 dark:border-white/15 focus:outline-none focus:border-dpr-emerald dark:focus:border-dpr-gold focus:ring-1 focus:ring-dpr-emerald dark:focus:ring-dpr-gold transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 dark:hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Live Search Dropdown Popover */}
            <AnimatePresence>
              {searchResults && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/40 rounded-2xl shadow-2xl overflow-hidden z-50 p-4 space-y-4 max-h-[75vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                    <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" />
                      Hasil Pencarian ({searchResults.totalCount})
                    </span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full"
                    >
                      Tutup [X]
                    </button>
                  </div>

                  {searchResults.totalCount === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                      Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Anggota Results */}
                      {searchResults.matchedAnggota.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Anggota Komisi XIII</span>
                          {searchResults.matchedAnggota.map((m) => (
                            <Link
                              key={m.id}
                              href="/anggota"
                              onClick={() => setSearchQuery("")}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-dpr-navy hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 transition-all text-left group"
                            >
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors">{m.name}</h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.fraksi} • {m.role}</p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold opacity-60 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Berita Results */}
                      {searchResults.matchedBerita.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Berita & Siaran Pers</span>
                          {searchResults.matchedBerita.map((b) => (
                            <Link
                              key={b.id}
                              href="/berita"
                              onClick={() => setSearchQuery("")}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-dpr-navy hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 transition-all text-left group"
                            >
                              <div className="pr-2">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors line-clamp-1">{b.title}</h4>
                                <p className="text-[10px] text-dpr-emerald-dark dark:text-dpr-gold font-semibold">{b.category} • {b.date}</p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold opacity-60 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Agenda Results */}
                      {searchResults.matchedAgenda.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Agenda Rapat</span>
                          {searchResults.matchedAgenda.map((a) => (
                            <Link
                              key={a.id}
                              href="/agenda"
                              onClick={() => setSearchQuery("")}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-dpr-navy hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 transition-all text-left group"
                            >
                              <div className="pr-2">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors line-clamp-1">{a.title}</h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">{a.partner} • {a.date}</p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold opacity-60 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Mobile Right Bar (Theme toggle + Menu toggle) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-dpr-gold"
              title="Ganti Mode"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-dpr-gold" /> : <Moon className="w-5 h-5 text-dpr-emerald-dark" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-dpr-navy-card border-b border-slate-200 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-dpr-navy text-xs text-slate-800 dark:text-white placeholder-slate-400 pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-white/15"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile Search Popup */}
              {searchResults && (
                <div className="bg-slate-50 dark:bg-dpr-navy border border-slate-200 dark:border-dpr-gold/30 rounded-xl p-3 space-y-3 max-h-60 overflow-y-auto">
                  <div className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold">Hasil Pencarian ({searchResults.totalCount})</div>
                  {searchResults.totalCount === 0 ? (
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tidak ada hasil</div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {searchResults.matchedAnggota.map((m) => (
                        <Link key={m.id} href="/anggota" onClick={() => setMobileMenuOpen(false)} className="block p-1.5 bg-white dark:bg-dpr-navy-card rounded text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-transparent">
                          {m.name} ({m.fraksi})
                        </Link>
                      ))}
                      {searchResults.matchedBerita.map((b) => (
                        <Link key={b.id} href="/berita" onClick={() => setMobileMenuOpen(false)} className="block p-1.5 bg-white dark:bg-dpr-navy-card rounded text-slate-900 dark:text-white font-medium truncate border border-slate-200 dark:border-transparent">
                          {b.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <div key={link.name} className="flex flex-col space-y-1">
                    <Link
                      href={link.href}
                      onClick={() => !link.children && setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive && !link.children
                          ? "bg-emerald-100 dark:bg-dpr-gold/20 text-dpr-emerald-dark dark:text-dpr-gold font-semibold border border-dpr-emerald/40 dark:border-dpr-gold/40"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
                        <span>{link.name}</span>
                      </div>
                    </Link>
                    {link.children && (
                      <div className="pl-11 space-y-1 pb-2">
                        {link.children.map(child => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-dpr-emerald dark:hover:text-white transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Mobile links finish naturally with navLinks */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
