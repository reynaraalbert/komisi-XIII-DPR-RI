"use client";

import React, { useRef, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: "image" | "document" | "all";
  label?: string;
  className?: string;
}

export default function FileUpload({ value, onChange, accept = "image", label, className = "" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptMap = {
    image: "image/jpeg,image/png,image/webp",
    document: "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    all: "image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload gagal");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Gagal mengupload file. Periksa koneksi.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const isImage = value && /\.(jpg|jpeg|png|webp|gif|svg)/i.test(value);
  const isPdf = value && /\.pdf/i.test(value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{label}</label>
      )}

      {value ? (
        <div className="relative border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          ) : isPdf ? (
            <div className="w-full h-40 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
              <div className="text-center space-y-2">
                <FileText className="w-10 h-10 text-red-500 mx-auto" />
                <span className="text-xs text-slate-500 font-semibold">PDF Document</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
              <div className="text-center space-y-2">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <span className="text-xs text-slate-500 font-semibold">{value.split("/").pop()}</span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              type="button"
              onClick={() => { onChange(""); setError(null); }}
              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3 h-3" /> Uploaded
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
        >
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 text-dpr-emerald dark:text-dpr-gold mx-auto animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">Mengupload...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {accept === "image" ? (
                <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold mx-auto transition-colors" />
              ) : (
                <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold mx-auto transition-colors" />
              )}
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Klik atau seret file ke sini
              </p>
              <p className="text-[10px] text-slate-400">
                {accept === "image" ? "PNG, JPG, WEBP — maks. 5MB" : accept === "document" ? "PDF, DOCX, XLSX — maks. 10MB" : "Gambar atau Dokumen — maks. 10MB"}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-500 font-semibold">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptMap[accept]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
