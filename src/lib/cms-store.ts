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

  if (scope === "browser") {
    return (memoryCache[key] as CmsData[K]) ?? fallback;
  }

  const file = filePathFor(key);
  if (fs.existsSync(file)) {
    try {
      const raw = fs.readFileSync(file, "utf-8");
      const parsed = JSON.parse(raw);
      memoryCache[key] = parsed;
      return parsed as CmsData[K];
    } catch (e) {
      // Corrupt file → fall back to default.
      return fallback;
    }
  }
  // First run → persist the seeded default so the file exists on disk.
  try {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2), "utf-8");
  } catch (e) {
    // ignore write errors
  }
  memoryCache[key] = fallback;
  return fallback;
}

/**
 * Write a whole collection to disk.
 */
export function writeCollection<K extends keyof CmsData>(key: K, value: CmsData[K]): void {
  memoryCache[key] = value;
  const file = filePathFor(key);
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf-8");
}

/**
 * Read the entire CMS dataset (used by dashboard + bulk endpoints).
 */
export function readAllCms(): CmsData {
  return seed();
}
