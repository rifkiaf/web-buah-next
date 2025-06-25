export const APP_NAME = "Buah Segar" as const;

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  CART: "/cart",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  ADMIN: "/admin",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const PRODUCT_CATEGORIES = ["Semua", "Buah Lokal", "Buah Impor"] as const;

export const PAYMENT_METHODS = [
  {
    id: "transfer",
    name: "Transfer Bank",
    banks: [
      { name: "BCA", number: "1234567890" },
      { name: "Mandiri", number: "0987654321" },
    ],
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    providers: ["GoPay", "OVO", "DANA"],
  },
] as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Menunggu Pembayaran",
  [ORDER_STATUS.PROCESSING]: "Diproses",
  [ORDER_STATUS.SHIPPED]: "Dikirim",
  [ORDER_STATUS.DELIVERED]: "Selesai",
  [ORDER_STATUS.CANCELLED]: "Dibatalkan",
} as const; 