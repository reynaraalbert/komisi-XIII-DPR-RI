/**
 * Server-side CMS data store.
 * Persists all editable content as human-readable JSON files inside the
 * `data/` directory at the project root. Each "collection" maps to one file.
 *
 * The store is seeded on first use from the static defaults defined in
 * `src/lib/data.ts` so the CMS starts with the same content as the public site.
 */
import fs from "fs";
import path from "path";
import {
  STATS,
  ANGGOTA_KOMISI,
  PIMPINAN_KOMISI,
  MITRA_KERJA,
  BERITA_LIST,
  AGENDA_LIST,
  SiteContent,
} from "@/lib/data";
import type { NewsSubmission, Aspirasi, PageContent } from "@/lib/data";
import { PAGES } from "@/lib/pages";

export interface CmsData {
  stats: typeof STATS;
  anggota: typeof ANGGOTA_KOMISI;
  pimpinan: typeof PIMPINAN_KOMISI;
  mitraKerja: typeof MITRA_KERJA;
  berita: typeof BERITA_LIST;
  agenda: typeof AGENDA_LIST;
  siteContent: SiteContent;
  submissions: NewsSubmission[];
  aspirasi: Aspirasi[];
  pages: PageContent[];
}

function getDataDir(): string {
  // Resolve to the project root (two levels up from src/lib) regardless of cwd.
  const root = path.join(process.cwd(), "data");
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
  return root;
}

function filePathFor(key: keyof CmsData): string {
  return path.join(getDataDir(), `${key}.json`);
}

const scope: "server" | "browser" =
  typeof window === "undefined" ? "server" : "browser";

const memoryCache: Partial<CmsData> = {};

function seed(): CmsData {
  return {
    stats: JSON.parse(JSON.stringify(STATS)),
    anggota: JSON.parse(JSON.stringify(ANGGOTA_KOMISI)),
    pimpinan: JSON.parse(JSON.stringify(PIMPINAN_KOMISI)),
    mitraKerja: JSON.parse(JSON.stringify(MITRA_KERJA)),
    berita: JSON.parse(JSON.stringify(BERITA_LIST)),
    agenda: JSON.parse(JSON.stringify(AGENDA_LIST)),
    siteContent: JSON.parse(JSON.stringify(SiteContent)),
    submissions: [],
    aspirasi: [],
    pages: JSON.parse(JSON.stringify(PAGES)),
  };
}

/**
 * Read a single collection. Reads from disk (server) and falls back to the
 * static default when no persisted file exists yet.
 */
export function readCollection<K extends keyof CmsData>(key: K): CmsData[K] {
  const all = seed();
  const fallback = all[key];

  if (memoryCache[key] !== undefined) {
    return memoryCache[key] as CmsData[K];
  }

  if (scope === "browser") {
    return fallback;
  }

  try {
    const file = filePathFor(key);
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf-8");
      const parsed = JSON.parse(raw);
      memoryCache[key] = parsed;
      return parsed as CmsData[K];
    }
  } catch (e) {
    // Corrupt or read error → fall back to default.
  }

  // First run → attempt to write seeded default if filesystem is writable
  try {
    const file = filePathFor(key);
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2), "utf-8");
  } catch (e) {
    // Ignore write errors on read-only serverless environments (Vercel)
  }
  memoryCache[key] = fallback;
  return fallback;
}

/**
 * Write a whole collection to disk (or memory cache if read-only filesystem).
 */
export function writeCollection<K extends keyof CmsData>(key: K, value: CmsData[K]): void {
  memoryCache[key] = value;
  try {
    const file = filePathFor(key);
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf-8");
  } catch (err) {
    // Safe fallback for Vercel / serverless platforms where filesystem is read-only
    console.warn(`[CMS Store] Saved to memory cache (read-only filesystem on Vercel): ${key}`);
  }
}

/**
 * Read the entire CMS dataset (used by dashboard + bulk endpoints).
 * Reads each collection from disk so edits are reflected immediately.
 */
export function readAllCms(): CmsData {
  return {
    stats: readCollection("stats"),
    anggota: readCollection("anggota"),
    pimpinan: readCollection("pimpinan"),
    mitraKerja: readCollection("mitraKerja"),
    berita: readCollection("berita"),
    agenda: readCollection("agenda"),
    siteContent: readCollection("siteContent"),
    submissions: readCollection("submissions"),
    aspirasi: readCollection("aspirasi"),
    pages: readCollection("pages"),
  };
}
