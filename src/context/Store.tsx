import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_ACCOUNT, DEMO_CHECKOUT, normalizeEmail } from "../data/demo";
import { PRODUCTS, getProduct, KARMA_TO_INR } from "../data/products";
import { listingKarma, RETIRED_THRIFT_IDS, THRIFT_SEED } from "../data/thrift";
import { isoDaysFromNow, makeOrderId, newId } from "../lib/ids";
import { loadDevice, requestNotifications, showLocalPush } from "../services/device";
import { KEYS, storage } from "../storage/adapter";
import type {
  AppNotification,
  CartItem,
  ChatMessage,
  DemoAccount,
  DemoSession,
  DeviceIdentity,
  FcmOrderLink,
  GuestCheckout,
  Order,
  OrderStatus,
  RepairRequest,
  UsedListing,
} from "../types";

const emptyGuest: GuestCheckout = {
  fullName: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "upi",
};

const STATUS_FLOW: { status: OrderStatus; afterMs: number; note: string }[] = [
  { status: "packed", afterMs: 8000, note: "Packed at the city warehouse." },
  { status: "shipped", afterMs: 16000, note: "Handed to the delivery partner." },
  { status: "out_for_delivery", afterMs: 24000, note: "Rider is on the way." },
  { status: "delivered", afterMs: 32000, note: "Left at the door. Enjoy." },
];

function nextKarmaBalance(prev: number, redeemed: number, earned: number) {
  return Math.max(0, prev - Math.max(0, redeemed)) + Math.max(0, earned);
}

function applyDeliveryProgress(order: Order, now = Date.now()): Order {
  const created = new Date(order.createdAt).getTime();
  let next = order;
  for (const step of STATUS_FLOW) {
    if (now - created < step.afterMs) break;
    if (next.timeline.some((t) => t.status === step.status)) continue;
    next = {
      ...next,
      karmaCoins: next.karmaCoins ?? 0,
      status: step.status,
      timeline: [
        ...next.timeline,
        {
          status: step.status,
          at: new Date(created + step.afterMs).toISOString(),
          note: step.note,
        },
      ],
    };
  }
  return { ...next, karmaCoins: next.karmaCoins ?? 0, karmaRedeemed: next.karmaRedeemed ?? 0 };
}

interface StoreValue {
  ready: boolean;
  cart: CartItem[];
  wishlist: string[];
  recentViews: string[];
  recentSearches: string[];
  chats: ChatMessage[];
  checkout: GuestCheckout;
  orders: Order[];
  device: DeviceIdentity | null;
  notifications: AppNotification[];
  fcmLinks: FcmOrderLink[];
  karmaBalance: number;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  viewProduct: (productId: string) => void;
  rememberSearch: (q: string) => void;
  setCheckout: (patch: Partial<GuestCheckout>) => void;
  pushChat: (productId: string, role: ChatMessage["role"], text: string) => void;
  enableNotifications: () => Promise<void>;
  markNotificationsRead: () => void;
  placeOrder: (redeemCoins?: number) => Promise<Order>;
  findOrder: (orderId: string, mobile: string) => Order | undefined;
  usedListings: UsedListing[];
  addUsedListing: (listing: Omit<UsedListing, "id" | "createdAt">) => void;
  removeUsedListing: (id: string) => void;
  buyUsedListing: (listingId: string, redeemCoins?: number) => Promise<Order>;
  repairs: RepairRequest[];
  addRepairRequest: (request: Omit<RepairRequest, "id" | "createdAt" | "status">) => void;
  session: DemoSession | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: { name: string; email: string; mobile: string; password: string }) => Promise<void>;
  logout: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentViews, setRecentViews] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [checkout, setCheckoutState] = useState<GuestCheckout>(emptyGuest);
  const [orders, setOrders] = useState<Order[]>([]);
  const [device, setDevice] = useState<DeviceIdentity | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [fcmLinks, setFcmLinks] = useState<FcmOrderLink[]>([]);
  const [karmaBalance, setKarmaBalance] = useState(0);
  const [usedListings, setUsedListings] = useState<UsedListing[]>([]);
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [session, setSession] = useState<DemoSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [
        cartV,
        wishV,
        viewsV,
        searchV,
        chatsV,
        checkV,
        ordersV,
        notesV,
        linksV,
        deviceV,
        karmaV,
        usedV,
        repairV,
        sessionV,
      ] = await Promise.all([
        storage.getItem<CartItem[]>(KEYS.cart),
        storage.getItem<string[]>(KEYS.wishlist),
        storage.getItem<string[]>(KEYS.recentViews),
        storage.getItem<string[]>(KEYS.recentSearches),
        storage.getItem<ChatMessage[]>(KEYS.chats),
        storage.getItem<GuestCheckout>(KEYS.checkout),
        storage.getItem<Order[]>(KEYS.orders),
        storage.getItem<AppNotification[]>(KEYS.notifications),
        storage.getItem<FcmOrderLink[]>(KEYS.fcmLinks),
        loadDevice(),
        storage.getItem<number>(KEYS.karma),
        storage.getItem<UsedListing[]>(KEYS.usedListings),
        storage.getItem<RepairRequest[]>(KEYS.repairs),
        storage.getItem<DemoSession>(KEYS.session),
      ]);
      if (cancelled) return;
      setCart(cartV ?? []);
      setWishlist(wishV ?? []);
      setRecentViews(viewsV ?? []);
      setRecentSearches(searchV ?? []);
      setChats(chatsV ?? []);
      setCheckoutState(checkV ?? emptyGuest);
      setOrders((ordersV ?? []).map((o) => applyDeliveryProgress(o)));
      setNotifications(notesV ?? []);
      setFcmLinks(linksV ?? []);
      setDevice(deviceV);
      setKarmaBalance(typeof karmaV === "number" ? karmaV : 0);
      let listings = (usedV ?? []).filter(
        (l) =>
          !RETIRED_THRIFT_IDS.has(l.id) &&
          !l.photo?.startsWith("/products/") &&
          !/cane stool/i.test(l.title),
      );
      const have = new Set(listings.map((l) => l.id));
      const missing = THRIFT_SEED.filter((s) => !have.has(s.id));
      if (missing.length > 0 || listings.length !== (usedV ?? []).length) {
        listings = [...missing, ...listings];
        void storage.setItem(KEYS.usedListings, listings);
        void storage.setItem(KEYS.thriftSeeded, true);
      }
      setUsedListings(listings);
      setRepairs(repairV ?? []);
      setSession(sessionV);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(<T,>(key: string, value: T) => {
    void storage.setItem(key, value);
  }, []);

  const addNotification = useCallback(
    (title: string, body: string, orderId?: string) => {
      const note: AppNotification = {
        id: newId("NT"),
        title,
        body,
        orderId,
        at: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => {
        const next = [note, ...prev].slice(0, 50);
        persist(KEYS.notifications, next);
        return next;
      });
      showLocalPush(title, body);
    },
    [persist],
  );

  useEffect(() => {
    const tick = window.setInterval(() => {
      setOrders((prev) => {
        let changed = false;
        const next = prev.map((o) => {
          const updated = applyDeliveryProgress(o);
          if (updated.status !== o.status) {
            changed = true;
            addNotification(
              `Order ${updated.status.replaceAll("_", " ")}`,
              `${updated.id} · ${updated.timeline.at(-1)?.note ?? ""}`,
              updated.id,
            );
          }
          return updated;
        });
        if (changed) persist(KEYS.orders, next);
        return changed ? next : prev;
      });
    }, 2000);
    return () => window.clearInterval(tick);
  }, [addNotification, persist]);

  const addToCart = useCallback(
    (productId: string, qty = 1) => {
      setCart((prev) => {
        const found = prev.find((i) => i.productId === productId);
        const next = found
          ? prev.map((i) =>
              i.productId === productId ? { ...i, qty: Math.min(i.qty + qty, 9) } : i,
            )
          : [...prev, { productId, qty }];
        persist(KEYS.cart, next);
        return next;
      });
    },
    [persist],
  );

  const setQty = useCallback(
    (productId: string, qty: number) => {
      setCart((prev) => {
        const next =
          qty <= 0 ? prev.filter((i) => i.productId !== productId) : prev.map((i) => (i.productId === productId ? { ...i, qty } : i));
        persist(KEYS.cart, next);
        return next;
      });
    },
    [persist],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        persist(KEYS.cart, next);
        return next;
      });
    },
    [persist],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    persist(KEYS.cart, []);
  }, [persist]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [productId, ...prev];
        persist(KEYS.wishlist, next);
        return next;
      });
    },
    [persist],
  );

  const viewProduct = useCallback(
    (productId: string) => {
      setRecentViews((prev) => {
        const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, 12);
        persist(KEYS.recentViews, next);
        return next;
      });
    },
    [persist],
  );

  const rememberSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setRecentSearches((prev) => {
        const next = [trimmed, ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
        persist(KEYS.recentSearches, next);
        return next;
      });
    },
    [persist],
  );

  const setCheckout = useCallback(
    (patch: Partial<GuestCheckout>) => {
      setCheckoutState((prev) => {
        const next = { ...prev, ...patch };
        persist(KEYS.checkout, next);
        return next;
      });
    },
    [persist],
  );

  const pushChat = useCallback(
    (productId: string, role: ChatMessage["role"], text: string) => {
      const msg: ChatMessage = {
        id: newId("CH"),
        role,
        text,
        at: new Date().toISOString(),
        productId,
      };
      setChats((prev) => {
        const next = [...prev, msg].slice(-200);
        persist(KEYS.chats, next);
        return next;
      });
    },
    [persist],
  );

  const enableNotifications = useCallback(async () => {
    if (!device) return;
    const next = await requestNotifications(device);
    setDevice(next);
  }, [device]);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      persist(KEYS.notifications, next);
      return next;
    });
  }, [persist]);

  const placeOrder = useCallback(async (redeemCoins = 0) => {
    if (!device) throw new Error("Device not ready");
    if (cart.length === 0) throw new Error("Cart is empty");
    const days = Math.max(
      ...cart.map((i) => getProduct(i.productId)?.deliveryDays ?? 5),
    );
    const subtotal = cart.reduce((sum, i) => {
      const p = getProduct(i.productId);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
    const deliveryFee = subtotal >= 999 ? 0 : 49;
    const payable = subtotal + deliveryFee;
    const maxRedeem = Math.min(karmaBalance, payable);
    const karmaRedeemed = Math.max(0, Math.min(Math.floor(redeemCoins), maxRedeem));
    const discount = karmaRedeemed * KARMA_TO_INR;
    const karmaEarned = cart.reduce((sum, i) => {
      const p = getProduct(i.productId);
      return sum + (p ? p.karmaCoins * i.qty : 0);
    }, 0);
    const order: Order = {
      id: makeOrderId(),
      createdAt: new Date().toISOString(),
      items: cart,
      guest: checkout,
      subtotal,
      deliveryFee,
      total: Math.max(0, payable - discount),
      status: "placed",
      expectedDelivery: isoDaysFromNow(days),
      fcmToken: device.fcmToken,
      timeline: [
        {
          status: "placed",
          at: new Date().toISOString(),
          note:
            karmaRedeemed > 0
              ? `Guest order confirmed. Redeemed ${karmaRedeemed} KarmaCoins.`
              : "Guest order confirmed. No account created.",
        },
      ],
      karmaCoins: karmaEarned,
      karmaRedeemed,
    };

    setOrders((prev) => {
      const next = [order, ...prev];
      persist(KEYS.orders, next);
      return next;
    });

    const link: FcmOrderLink = {
      fcmToken: device.fcmToken,
      orderId: order.id,
      linkedAt: new Date().toISOString(),
    };
    setFcmLinks((prev) => {
      const next = [link, ...prev];
      persist(KEYS.fcmLinks, next);
      return next;
    });

    setCart([]);
    persist(KEYS.cart, []);

    const nextKarma = nextKarmaBalance(karmaBalance, karmaRedeemed, karmaEarned);
    setKarmaBalance(nextKarma);
    persist(KEYS.karma, nextKarma);

    addNotification(
      "Order placed successfully",
      `${order.id} · +${karmaEarned} / −${karmaRedeemed} KarmaCoins · expected ${new Date(order.expectedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      order.id,
    );

    return order;
  }, [addNotification, cart, checkout, device, karmaBalance, persist]);

  const findOrder = useCallback(
    (orderId: string, mobile: string) => {
      const id = orderId.trim().toUpperCase();
      const phone = mobile.trim();
      return orders.find((o) => o.id.toUpperCase() === id && o.guest.mobile === phone);
    },
    [orders],
  );

  const addUsedListing = useCallback(
    (listing: Omit<UsedListing, "id" | "createdAt">) => {
      const nextItem: UsedListing = {
        ...listing,
        id: newId("USED"),
        createdAt: new Date().toISOString(),
        sold: false,
      };
      setUsedListings((prev) => {
        const next = [nextItem, ...prev];
        persist(KEYS.usedListings, next);
        return next;
      });
    },
    [persist],
  );

  const buyUsedListing = useCallback(
    async (listingId: string, redeemCoins = 0) => {
      if (!device) throw new Error("Device not ready");
      const listing = usedListings.find((l) => l.id === listingId);
      if (!listing) throw new Error("That listing is gone.");
      if (listing.sold) throw new Error("Someone already bought this.");
      const subtotal = listing.price;
      const deliveryFee = subtotal >= 999 ? 0 : 49;
      const payable = subtotal + deliveryFee;
      const maxRedeem = Math.min(karmaBalance, payable);
      const karmaRedeemed = Math.max(0, Math.min(Math.floor(redeemCoins), maxRedeem));
      const discount = karmaRedeemed * KARMA_TO_INR;
      const karmaEarned = listingKarma(listing.price);
      const order: Order = {
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        items: [],
        guest: checkout,
        subtotal,
        deliveryFee,
        total: Math.max(0, payable - discount),
        status: "placed",
        expectedDelivery: isoDaysFromNow(3),
        fcmToken: device.fcmToken,
        timeline: [
          {
            status: "placed",
            at: new Date().toISOString(),
            note:
              karmaRedeemed > 0
                ? `Thrift buy confirmed. Redeemed ${karmaRedeemed} KarmaCoins.`
                : "Thrift buy confirmed. Seller will pack the used item.",
          },
        ],
        karmaCoins: karmaEarned,
        karmaRedeemed,
        kind: "thrift",
        thrift: {
          listingId: listing.id,
          title: listing.title,
          price: listing.price,
          condition: listing.condition,
          sellerName: listing.sellerName,
          sellerMobile: listing.mobile,
          city: listing.city,
          photo: listing.photo,
        },
      };

      setUsedListings((prev) => {
        const next = prev.map((l) => (l.id === listingId ? { ...l, sold: true } : l));
        persist(KEYS.usedListings, next);
        return next;
      });

      setOrders((prev) => {
        const next = [order, ...prev];
        persist(KEYS.orders, next);
        return next;
      });

      const link: FcmOrderLink = {
        fcmToken: device.fcmToken,
        orderId: order.id,
        linkedAt: new Date().toISOString(),
      };
      setFcmLinks((prev) => {
        const next = [link, ...prev];
        persist(KEYS.fcmLinks, next);
        return next;
      });

      const nextKarma = nextKarmaBalance(karmaBalance, karmaRedeemed, karmaEarned);
      setKarmaBalance(nextKarma);
      persist(KEYS.karma, nextKarma);

      addNotification(
        "Thrift order placed",
        `${order.id} · ${listing.title} · ${listing.city}`,
        order.id,
      );

      return order;
    },
    [addNotification, checkout, device, karmaBalance, persist, usedListings],
  );

  const removeUsedListing = useCallback(
    (id: string) => {
      setUsedListings((prev) => {
        const next = prev.filter((l) => l.id !== id);
        persist(KEYS.usedListings, next);
        return next;
      });
    },
    [persist],
  );

  const applyLoggedIn = useCallback(
    (account: DemoAccount) => {
      const next: DemoSession = {
        name: account.name,
        email: account.email,
        mobile: account.mobile,
        loggedInAt: new Date().toISOString(),
      };
      setSession(next);
      persist(KEYS.session, next);
      const demo = normalizeEmail(account.email) === normalizeEmail(DEMO_ACCOUNT.email);
      setCheckout({
        fullName: account.name,
        email: account.email,
        mobile: account.mobile,
        ...(demo ? DEMO_CHECKOUT : {}),
      });
    },
    [persist, setCheckout],
  );

  const listAccounts = useCallback(async () => {
    const extra = (await storage.getItem<DemoAccount[]>(KEYS.demoUsers)) ?? [];
    return [DEMO_ACCOUNT, ...extra];
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const accounts = await listAccounts();
      const found = accounts.find(
        (u) => normalizeEmail(u.email) === normalizeEmail(email) && u.password === password,
      );
      if (!found) throw new Error("Email or password is wrong. Try demo@hackarmaverse.com / demo1234.");
      applyLoggedIn(found);
    },
    [applyLoggedIn, listAccounts],
  );

  const signup = useCallback(
    async (input: { name: string; email: string; mobile: string; password: string }) => {
      const name = input.name.trim();
      const email = normalizeEmail(input.email);
      const mobile = input.mobile.trim();
      const password = input.password;
      if (name.length < 2) throw new Error("Enter your name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
      if (!/^[6-9]\d{9}$/.test(mobile)) throw new Error("Enter a 10-digit Indian mobile number.");
      if (password.length < 6) throw new Error("Use at least 6 characters for the demo password.");
      const accounts = await listAccounts();
      if (accounts.some((u) => normalizeEmail(u.email) === email)) {
        throw new Error("That email is already on this device. Log in instead.");
      }
      const extra = accounts.filter((u) => normalizeEmail(u.email) !== normalizeEmail(DEMO_ACCOUNT.email));
      const created: DemoAccount = { name, email, mobile, password };
      persist(KEYS.demoUsers, [...extra, created]);
      applyLoggedIn(created);
    },
    [applyLoggedIn, listAccounts, persist],
  );

  const logout = useCallback(() => {
    setSession(null);
    void storage.removeItem(KEYS.session);
  }, []);

  const addRepairRequest = useCallback(
    (request: Omit<RepairRequest, "id" | "createdAt" | "status">) => {
      const nextItem: RepairRequest = {
        ...request,
        id: newId("REP"),
        createdAt: new Date().toISOString(),
        status: "requested",
      };
      setRepairs((prev) => {
        const next = [nextItem, ...prev];
        persist(KEYS.repairs, next);
        return next;
      });
    },
    [persist],
  );

  const value = useMemo(
    () => ({
      ready,
      cart,
      wishlist,
      recentViews,
      recentSearches,
      chats,
      checkout,
      orders,
      device,
      notifications,
      fcmLinks,
      karmaBalance,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      viewProduct,
      rememberSearch,
      setCheckout,
      pushChat,
      enableNotifications,
      markNotificationsRead,
      placeOrder,
      findOrder,
      usedListings,
      addUsedListing,
      removeUsedListing,
      buyUsedListing,
      repairs,
      addRepairRequest,
      session,
      login,
      signup,
      logout,
    }),
    [
      ready,
      cart,
      wishlist,
      recentViews,
      recentSearches,
      chats,
      checkout,
      orders,
      device,
      notifications,
      fcmLinks,
      karmaBalance,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      viewProduct,
      rememberSearch,
      setCheckout,
      pushChat,
      enableNotifications,
      markNotificationsRead,
      placeOrder,
      findOrder,
      usedListings,
      addUsedListing,
      removeUsedListing,
      buyUsedListing,
      repairs,
      addRepairRequest,
      session,
      login,
      signup,
      logout,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function cartCount(cart: CartItem[]) {
  return cart.reduce((n, i) => n + i.qty, 0);
}

export function cartProducts(cart: CartItem[]) {
  return cart
    .map((i) => {
      const product = PRODUCTS.find((p) => p.id === i.productId);
      return product ? { ...i, product } : null;
    })
    .filter((x): x is CartItem & { product: NonNullable<ReturnType<typeof getProduct>> } => x != null);
}
