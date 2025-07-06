// "use client";

// import React, { useState, useEffect } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../firebase/config";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { useCart } from "../../../context/CartContext";
// import { useAuth } from "../../../context/AuthContext";
// import { useRouter } from "next/navigation";
// import { formatCurrency } from "../../../utils/helpers";

// interface Product {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   description: string;
//   image: string;
//   rating?: number;
// }

// export default function ProductDetail() {
//   const params = useParams();
//   const { id } = params;
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);
//   const { addToCart } = useCart();
//   const { currentUser } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (id) {
//         try {
//           const productRef = doc(db, "products", id as string);
//           const productSnap = await getDoc(productRef);

//           if (productSnap.exists()) {
//             setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
//           } else {
//             console.log("No such document!");
//           }
//         } catch (error) {
//           console.error("Error fetching product:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!currentUser) {
//       router.push("/login");
//       return;
//     }
//     if (product) {
//       addToCart(product, quantity);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😕</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Produk tidak ditemukan
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Maaf, produk yang Anda cari tidak dapat ditemukan.
//           </p>
//           <Link
//             href="/products"
//             className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
//           >
//             Kembali ke Produk
//             <svg
//               className="w-5 h-5 ml-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M17 8l4 4m0 0l-4 4m4-4H3"
//               />
//             </svg>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
//               {/* Product Image */}
//               <div className="relative">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-[400px] object-cover rounded-xl shadow-md"
//                 />
//                 <div className="absolute top-4 right-4">
//                   <span className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full">
//                     {product.category}
//                   </span>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="flex flex-col">
//                 <div className="flex-1">
//                   <h1 className="text-3xl font-bold text-gray-800 mb-4">
//                     {product.name}
//                   </h1>
//                   <div className="flex items-center mb-6">
//                     <div className="flex items-center">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <svg
//                           key={star}
//                           className={`w-5 h-5 ${
//                             product.rating && star <= product.rating
//                               ? "text-yellow-400"
//                               : "text-gray-300"
//                           }`}
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                       ))}
//                       <span className="ml-2 text-gray-600">
//                         ({product.rating || "N/A"})
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-3xl font-bold text-green-600 mb-6">
//                     {formatCurrency(product.price)}
//                   </p>
//                   <p className="text-gray-600 leading-relaxed mb-6">
//                     {product.description}
//                   </p>

//                   {/* Quantity Selector */}
//                   <div className="flex items-center mb-6">
//                     <span className="text-gray-700 mr-4">Quantity:</span>
//                     <div className="flex items-center border border-gray-300 rounded-lg">
//                       <button
//                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                         className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
//                       >
//                         -
//                       </button>
//                       <span className="px-4 py-2 text-gray-800">
//                         {quantity}
//                       </span>
//                       <button
//                         onClick={() => setQuantity(quantity + 1)}
//                         className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="space-y-4">
//                   <button
//                     onClick={handleAddToCart}
//                     className="w-full px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
//                   >
//                     <svg
//                       className="w-5 h-5 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                       />
//                     </svg>
//                     Tambah ke Keranjang
//                   </button>
//                   <button className="w-full px-6 py-4 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                       />
//                     </svg>
//                     Tambah ke Wishlist
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
