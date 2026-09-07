"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  STATS,
  ANGGOTA_KOMISI,
  PIMPINAN_KOMISI,
  MITRA_KERJA,
  BERITA_LIST,
  AGENDA_LIST,
  SiteContent,
} from "@/lib/data";
import { PAGES } from "@/lib/pages";

export interface CmsContent {
  stats: typeof STATS;
  anggota: typeof ANGGOTA_KOMISI;
  pimpinan: typeof PIMPINAN_KOMISI;
  mitraKerja: typeof MITRA_KERJA;
  berita: typeof BERITA_LIST;
  agenda: typeof AGENDA_LIST;
  siteContent: typeof SiteContent;
  pages: typeof PAGES;
}

const DEFAULT_CONTENT: CmsContent = {
  stats: STATS,
  anggota: ANGGOTA_KOMISI,
  pimpinan: PIMPINAN_KOMISI,
  mitraKerja: MITRA_KERJA,
  berita: BERITA_LIST,
  agenda: AGENDA_LIST,
  siteContent: SiteContent,
  pages: PAGES,
};

interface CmsContextValue {
  content: CmsContent;
  loaded: boolean;
}

const CmsContext = createContext<CmsContextValue>({ content: DEFAULT_CONTENT, loaded: false });

export function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/content", {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setContent((prev) => ({ ...DEFAULT_CONTENT, ...prev, ...data }));
          }
        }
      } catch {
        // Fall back to default content.
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    load();

    // Listen for instant 0ms BroadcastChannel updates from Admin edits across tabs
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel("cms_sync_channel");
        bc.onmessage = (event) => {
          if (event.data?.collection && event.data?.data) {
            const { collection, data } = event.data;
            setContent((prev) => ({
              ...prev,
              [collection]: data,
            }));
          }
        };
      } catch {
        // ignore
      }
    }

    // Re-fetch every 2 seconds for near-realtime sync with CMS edits on server.
    const interval = setInterval(load, 2000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      if (bc) bc.close();
    };
  }, []);

  return <CmsContext.Provider value={{ content, loaded }}>{children}</CmsContext.Provider>;
}

export function useCmsContent(): CmsContent {
  return useContext(CmsContext).content;
}
