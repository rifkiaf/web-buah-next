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

export default function PredictionPage() {
  const [buahList, setBuahList] = useState<string[]>([]);
  const [buah, setBuah] = useState("");
  const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1);
  const [mingguKe, setMingguKe] = useState<number>(1);
  const [result, setResult] = useState<PrediksiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tahun] = useState<number>(2025); // Tahun tetap 2025 sesuai backend

  useEffect(() => {
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
      const res = await fetch("https://rifkiaf-prediksi-stok-buah.hf.space/prediksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buah, bulan, minggu_ke: mingguKe }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (err) {
      setError("Gagal menghubungi server prediksi.");
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk label bulan
  const bulanList = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-green-500 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
        <h1 className="text-3xl font-extrabold mb-2 flex items-center justify-center gap-2">
          <span role="img" aria-label="apple">🍎</span> Prediksi Stok Buah 2025
        </h1>
        <p className="text-lg font-medium mb-1">Prediksi stok mingguan untuk buah di toko SariBuah.</p>
        <p className="text-sm opacity-90">Pilih buah, bulan, dan minggu ke berapa untuk melihat prediksi stok pada minggu tersebut.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow border">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nama Buah</label>
          <select
            className="border-2 border-green-400 focus:border-green-600 rounded px-3 py-2 w-full outline-none transition"
            value={buah}
            onChange={e => setBuah(e.target.value)}
            required
            autoFocus
          >
            <option value="" disabled>Pilih buah...</option>
            {buahList.map((b) => (
              <option key={b} value={b}>{b.replace(/_kg$/, "").charAt(0).toUpperCase() + b.replace(/_kg$/, "").slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-gray-700">Bulan</label>
            <select
              className="border-2 border-green-400 focus:border-green-600 rounded px-3 py-2 w-full outline-none transition"
              value={bulan}
              onChange={e => setBulan(Number(e.target.value))}
              required
            >
              {bulanList.map((b, i) => (
                <option key={b} value={i + 1}>{b}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-gray-700">Minggu ke-</label>
            <input
              type="number"
              min={1}
              max={5}
              className="border-2 border-green-400 focus:border-green-600 rounded px-3 py-2 w-full outline-none transition"
              value={mingguKe}
              onChange={e => setMingguKe(Number(e.target.value))}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Memproses...</span>
          ) : (
            "Prediksi"
          )}
        </button>
      </form>
      {error && <div className="mt-4 text-red-600 text-center font-semibold">{error}</div>}
      {result && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2"><span role="img" aria-label="chart">📈</span> Hasil Prediksi Mingguan</h2>
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">Buah: <span className="font-bold">{result.buah.replace(/_kg$/, "").charAt(0).toUpperCase() + result.buah.replace(/_kg$/, "").slice(1)}</span></div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">Bulan: <span className="font-bold">{bulanList[result.bulan-1]}</span></div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">Minggu ke-<span className="font-bold">{result.minggu_ke_bulan}</span></div>
          </div>
          <table className="w-full text-base border mb-4 mt-4">
            <thead>
              <tr className="bg-green-50">
                <th className="border px-3 py-2">Tanggal (Minggu)</th>
                <th className="border px-3 py-2">Prediksi Stok (kg)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2 font-mono">{result.tanggal}</td>
                <td className="border px-3 py-2 font-mono font-bold text-green-700">{Math.round(result.prediksi_kg)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
