import { TopBar } from "../components/AppShell";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../context/Store";
import { getProduct } from "../data/products";

export function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter((p) => p != null);

  return (
    <>
      <TopBar title="Wishlist" back="/more" />
      <div className="page">
        {items.length === 0 ? (
          <p className="empty">Nothing saved. Hearts live only on this device.</p>
        ) : (
          <div className="grid">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
