export type ProductCategory =
  | "gardening"
  | "lighting"
  | "workspace"
  | "storage"
  | "furniture"
  | "carry";

export type PaymentMethod = "upi" | "card" | "cod";

export type OrderStatus =
  | "placed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  badge?: string;
  tagline: string;
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  deliveryDays: number;
  stock: number;
  hue: string;
  glyph: string;
  /** First image is the hero; the rest appear in the gallery. */
  images?: string[];
  sku: string;
  karmaCoins: number;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface GuestCheckout {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: PaymentMethod;
}

export interface UsedListing {
  id: string;
  title: string;
  category: string;
  condition: "working" | "fair" | "for_parts";
  price: number;
  description: string;
  sellerName: string;
  mobile: string;
  city: string;
  photo?: string;
  createdAt: string;
  sold?: boolean;
}

export interface ThriftSnapshot {
  listingId: string;
  title: string;
  price: number;
  condition: UsedListing["condition"];
  sellerName: string;
  sellerMobile: string;
  city: string;
  photo?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  guest: GuestCheckout;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  expectedDelivery: string;
  fcmToken: string;
  timeline: { status: OrderStatus; at: string; note: string }[];
  karmaCoins: number;
  karmaRedeemed: number;
  kind?: "catalog" | "thrift";
  thrift?: ThriftSnapshot;
}

export interface RepairRequest {
  id: string;
  itemType: string;
  brand: string;
  model: string;
  issue: string;
  preferredSlot: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  photo?: string;
  status: "requested" | "scheduled" | "in_progress" | "done";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  at: string;
  productId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  orderId?: string;
  at: string;
  read: boolean;
}

export interface DemoAccount {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface DemoSession {
  name: string;
  email: string;
  mobile: string;
  loggedInAt: string;
}

export interface DeviceIdentity {
  deviceId: string;
  fcmToken: string;
  notificationsEnabled: boolean;
  permission: NotificationPermission | "unsupported";
}

export interface FcmOrderLink {
  fcmToken: string;
  orderId: string;
  linkedAt: string;
}
