"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet, apiPut } from "@/lib/admin-client";

/**
 * Fast & responsive CMS collection hook.
 *
 * 1. `loaded` defaults to `true` so all admin forms render instantly (0ms delay).
 * 2. Fetches background updates from server with a max 2-second timeout.
 * 3. Auto-saves changes debounced 600ms on every edit.
 * 4. Listens for global `cms-manual-save` event from header button.
 */
export function useCollection<T>(collection: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef<T>(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Background fetch without blocking initial form render
  useEffect(() => {
    let cancelled = false;

    // Timeout guard: 2.0 seconds max
    const timer = setTimeout(() => {
      if (!cancelled) setLoaded(true);
    }, 2000);

    apiGet<T>(`/api/data/${collection}`)
      .then((d) => {
        if (!cancelled && d !== null && d !== undefined) {
          setData(d);
          dataRef.current = d;
        }
      })
      .catch(() => {
        // Fall back gracefully to default value
      })
      .finally(() => {
        clearTimeout(timer);
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [collection]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await apiPut(`/api/data/${collection}`, dataRef.current);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err?.message || "Pastikan server berjalan."}`);
    } finally {
      setSaving(false);
    }
  }, [collection]);

  // Handle header "Simpan Perubahan" click
  useEffect(() => {
    const handleManualSave = () => {
      save();
    };
    window.addEventListener("cms-manual-save", handleManualSave);
    return () => window.removeEventListener("cms-manual-save", handleManualSave);
  }, [save]);

  // Auto-save with 600ms debounce
  const updateData = useCallback(
    (valOrFn: T | ((prev: T) => T)) => {
      setData((prev) => {
        const next = typeof valOrFn === "function" ? (valOrFn as (prev: T) => T)(prev) : valOrFn;
        dataRef.current = next;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          setSaving(true);
          try {
            await apiPut(`/api/data/${collection}`, next);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          } catch {
            // silent auto-save error catch
          } finally {
            setSaving(false);
          }
        }, 600);

        return next;
      });
    },
    [collection]
  );

  return { data, setData: updateData, save, saving, saved, loaded };
}
