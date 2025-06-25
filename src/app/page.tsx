"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/config";
import Card from "../components/ui/Card";
import { formatCurrency } from "../utils/helpers";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  sold?: number;
  rating?: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef);
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Product)
        );
        // Urutkan berdasarkan sold, fallback ke rating jika tidak ada sold
        const sorted = [...productsList].sort((a, b) => {
          if (b.sold !== undefined && a.sold !== undefined) {
            return b.sold - a.sold;
          }
          if (b.sold !== undefined) return 1;
          if (a.sold !== undefined) return -1;
          return (b.rating || 0) - (a.rating || 0);
        });
        setFeaturedProducts(sorted.slice(0, 3));
      } catch (err) {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-500 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Fruits Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-500/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Buah Segar untuk
              <span className="block text-green-100 mt-2">Gaya Hidup Sehat</span>
            </h1>
            <p className="text-xl text-green-50 text-center mb-8 max-w-3xl mx-auto leading-relaxed">
              Temukan pilihan buah segar terbaik, dipetik dengan hati-hati dan dikirim ke rumah Anda.
              Rasakan cita rasa terbaik dari alam.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg bg-white text-green-600 hover:bg-green-50 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Belanja Sekarang
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Segar dari Pertanian</h3>
              <p className="text-gray-600 leading-relaxed">Diperoleh langsung dari petani setempat, memastikan buah paling segar dan bergizi untuk Anda dan keluarga.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Pengiriman Cepat</h3>
              <p className="text-gray-600 leading-relaxed">Pengiriman di hari yang sama tersedia di area tertentu. Buah Anda akan tiba dalam keadaan segar dan siap dinikmati.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Kualitas Premium</h3>
              <p className="text-gray-600 leading-relaxed">Kualitas terjamin 100%. Kami memilih setiap buah dengan saksama untuk memastikan rasa dan kesegaran terbaik.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Produk Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan pilihan buah-buahan premium pilihan kami, dipilih karena kualitas dan rasanya yang luar biasa.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Memuat produk unggulan...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(product.price)}
                      </span>
                      <button
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                        onClick={e => { e.stopPropagation(); setSelectedProduct(product); }}
                      >
                        Lihat Detail
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Product Detail Modal */}
          {selectedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detail Produk</h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="h-64 w-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/150?text=Gambar+Tidak+Tersedia";
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                      <p className="text-sm text-gray-500">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedProduct.price)}</p>
                      <p className="text-sm text-gray-500">Stok: {selectedProduct.stock}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Deskripsi</h4>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-500 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-colors duration-200"
            >
              Lihat Semua Produk
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Lokasi Toko Kami</h2>
          <div className="rounded-lg overflow-hidden shadow-lg border">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7927.237909806672!2d106.74593989357909!3d-6.569682699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c51a3c69c889%3A0x46bdb04c65dea354!2sPD.%20Sari%20Buah%20Lokal%20%26%20Impor!5e0!3m2!1sid!2sid!4v1748514682169!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
