"use client";

import React, { useState, useEffect } from "react";

interface PrediksiResponse {
  buah: string;
  tanggal: string;
  minggu_ke_bulan: number;
  bulan: number;
  tahun: number;
  prediksi_kg: number;
}

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
export default function PredictionPage() {
  const { currentUser, isAdmin } = useAuth();
  const router = useRouter();
  const [buahList, setBuahList] = useState<string[]>([]);
  const [buah, setBuah] = useState("");
  const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1);
  const [mingguKe, setMingguKe] = useState<number>(1);
  const [result, setResult] = useState<PrediksiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tahun] = useState<number>(2025);

  useEffect(() => {
    if (currentUser && !isAdmin) {
      router.replace("/login");
      return;
    }
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    fetch("https://rifkiaf-prediksi-stok-buah.hf.space/daftar-buah")
      .then((res) => res.json())
      .then((data) => {
        if (data.buah_tersedia) {
          setBuahList(data.buah_tersedia);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        "https://rifkiaf-prediksi-stok-buah.hf.space/prediksi",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ buah, bulan, minggu_ke: mingguKe }),
        }
      );
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (err) {
      setError("Gagal menghubungi server prediksi.");
    } finally {
      setLoading(false);
    }
  };

  const bulanList = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-md p-8 text-white text-center">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-2">
          🍎 Prediksi Stok Buah 2025
        </h1>
        <p className="text-base sm:text-lg">
          Prediksi stok buah mingguan untuk toko <strong>SariBuah</strong>.
        </p>
        <p className="text-sm text-green-100 mt-1">
          Silakan pilih buah, bulan, dan minggu ke-berapa untuk melihat estimasi
          stoknya.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white mt-8 p-6 rounded-xl shadow space-y-6 border"
      >
        <div>
          <label className="block mb-1 font-semibold text-green-700">
            Nama Buah
          </label>
          <select
            className="w-full rounded-lg border-2 border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-300 px-3 py-2 outline-none"
            value={buah}
            onChange={(e) => setBuah(e.target.value)}
            required
          >
            <option value="" disabled className="text-gray-400">
              Pilih buah...
            </option>
            {buahList.map((b) => (
              <option key={b} value={b}>
                {b.replace(/_kg$/, "").replace(/^\w/, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-green-700">
              Bulan
            </label>
            <select
              className="w-full rounded-lg border-2 border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-300 px-3 py-2 outline-none"
              value={bulan}
              onChange={(e) => setBulan(Number(e.target.value))}
              required
            >
              {bulanList.map((b, i) => (
                <option key={b} value={i + 1}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-semibold text-green-700">
              Minggu ke-
            </label>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full rounded-lg border-2 border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-300 px-3 py-2 outline-none"
              value={mingguKe}
              onChange={(e) => setMingguKe(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2 animate-pulse">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Memproses...
            </span>
          ) : (
            "Prediksi"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded-lg text-center font-medium">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border space-y-4">
          <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            📊 Hasil Prediksi
          </h2>
          <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-700">
            <div className="bg-green-50 text-green-800 px-3 py-1 rounded-md">
              Buah:{" "}
              {result.buah
                .replace(/_kg$/, "")
                .replace(/^\w/, (c) => c.toUpperCase())}
            </div>
            <div className="bg-green-50 text-green-800 px-3 py-1 rounded-md">
              Bulan: {bulanList[result.bulan - 1]}
            </div>
            <div className="bg-green-50 text-green-800 px-3 py-1 rounded-md">
              Minggu ke-{result.minggu_ke_bulan}
            </div>
          </div>
          <table className="w-full border mt-4 text-sm sm:text-base">
            <thead className="bg-green-100 text-green-900">
              <tr>
                <th className="border px-4 py-2 text-left">Tanggal (Minggu)</th>
                <th className="border px-4 py-2 text-left">
                  Prediksi Stok (kg)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">{result.tanggal}</td>
                <td className="border px-4 py-2 font-bold text-green-700">
                  {Math.round(result.prediksi_kg)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
