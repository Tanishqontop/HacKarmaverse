/**
 * Storage abstraction. Swap LocalStorageAdapter for an HTTP/database
 * adapter later without changing app repositories.
 */
export interface StorageAdapter {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export class LocalStorageAdapter implements StorageAdapter {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();

export const KEYS = {
  cart: "haat.cart",
  wishlist: "haat.wishlist",
  recentViews: "haat.recentViews",
  recentSearches: "haat.recentSearches",
  chats: "haat.chats",
  checkout: "haat.checkoutDraft",
  orders: "haat.orders",
  device: "haat.device",
  fcmLinks: "haat.fcmOrderLinks",
  notifications: "haat.notifications",
  karma: "haat.karmaCoins",
  usedListings: "haat.usedListings",
  repairs: "haat.repairs",
  session: "haat.demoSession",
  demoUsers: "haat.demoUsers",
  thriftSeeded: "haat.thriftSeeded",
} as const;
