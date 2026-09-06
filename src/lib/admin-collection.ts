"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet, apiPut } from "@/lib/admin-client";
import { useSyncLive } from "@/components/admin/ui";

/**
 * Loads a CMS collection and provides save state handling.
 * On save, pushes updates to the API which persists to the data/ directory
 * (so the public site reflects edits after a page refresh).
 *
 * When Sync Live is active, changes are auto-saved after 800ms debounce.
 */
export function useCollection<T>(collection: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { syncLive } = useSyncLive();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef<T>(data);
  const initialLoadRef = useRef(true);

  // Keep dataRef in sync
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    let cancelled = false;
    apiGet<T>(`/api/data/${collection}`)
      .then((d) => {
        if (!cancelled) {
          setData(d);
        }
      })
      .catch(() => {
        // fall back to default on error
      })
      .finally(() => {
        if (!cancelled) {
          setLoaded(true);
          // Mark initial load complete after a tick
          setTimeout(() => { initialLoadRef.current = false; }, 100);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [collection]);

  // Auto-save when syncLive is active
  useEffect(() => {
    if (!syncLive || !loaded || initialLoadRef.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await apiPut(`/api/data/${collection}`, dataRef.current);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch {
        // silently fail on auto-save
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [data, syncLive, loaded, collection]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await apiPut(`/api/data/${collection}`, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Gagal menyimpan. Pastikan server berjalan.");
    } finally {
      setSaving(false);
    }
  }, [collection, data]);

  return { data, setData, save, saving, saved, loaded };
}
