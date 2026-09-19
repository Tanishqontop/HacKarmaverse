import type { DemoAccount, GuestCheckout } from "../types";

/** Built-in judge/demo login — not a real identity provider. */
export const DEMO_ACCOUNT: DemoAccount = {
  name: "Asha Demo",
  email: "demo@hackarmaverse.com",
  mobile: "9876543210",
  password: "demo1234",
};

export const DEMO_CHECKOUT: Partial<GuestCheckout> = {
  fullName: DEMO_ACCOUNT.name,
  mobile: DEMO_ACCOUNT.mobile,
  email: DEMO_ACCOUNT.email,
  address: "12, Demo Lane, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
  paymentMethod: "upi",
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
