import React from "react";
import Link from "next/link";

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Pembayaran Berhasil!
      </h1>
      <p className="mb-6 text-gray-700">Terima kasih sudah berbelanja.</p>
      <Link
        href="/products"
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      >
        Lanjut Belanja
      </Link>
    </div>
  );
}
