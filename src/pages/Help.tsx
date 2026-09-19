import { TopBar } from "../components/AppShell";

export function HelpPage() {
  return (
    <>
      <TopBar title="Help & support" back="/more" />
      <div className="page legal">
        <h1>Shopping without a login</h1>
        <p>
          Haat never asks for a password or OTP. Keep your Order ID (like ORD-2026-8F42K) and the mobile number you
          entered at checkout.
        </p>
        <h2>Track an order</h2>
        <p>Orders tab → enter ID + mobile, or open any order stored on this device.</p>
        <h2>Returns</h2>
        <p>Unused items, 7 days, original packing. Write to returns@haat.example with the Order ID.</p>
        <h2>KarmaCoins</h2>
        <p>1 KarmaCoin = ₹1 at guest checkout. Redeem on the payment step. Coins stay on this device.</p>
        <h2>Sell used</h2>
        <p>More → Sell used products, or the Sell used button on Home. List an item with your mobile number.</p>
        <h2>Repair</h2>
        <p>More → Request a repair for lamps, laptops, phones and other electronics. Pickup uses the address you enter.</p>
        <h2>Notifications</h2>
        <p>
          Delivery updates go to the browser/device that placed the order, via a device FCM token linked to that Order
          ID.
        </p>
      </div>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <TopBar title="About" back="/more" />
      <div className="page legal">
        <h1>Haat</h1>
        <p>
          A guest-first marketplace. Walk in, pick things up, ask the stall an honest question, and leave with a parcel
          — not a profile.
        </p>
      </div>
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <TopBar title="Privacy" back="/more" />
      <div className="page legal">
        <h1>Privacy policy</h1>
        <p>
          Cart, wishlist, searches, AI chats, and checkout drafts stay in this device’s local storage. Orders are keyed
          by Order ID, phone, email, and address — not by a user account. A device notification token is stored so we
          can ping the same device about delivery.
        </p>
        <p>We do not run login, social auth, or OTP in this app.</p>
      </div>
    </>
  );
}

export function TermsPage() {
  return (
    <>
      <TopBar title="Terms" back="/more" />
      <div className="page legal">
        <h1>Terms & conditions</h1>
        <p>
          Placing an order is a guest contract for that Order ID only. Payment methods in this demo are simulated.
          Prices include a guest discount versus MRP. Delivery windows are estimates.
        </p>
      </div>
    </>
  );
}
