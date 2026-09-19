import type { Product } from "../types";

export function ProductThumb({
  product,
  className = "swatch",
  height,
  showBadge = true,
}: {
  product: Product;
  className?: string;
  height?: number | string;
  showBadge?: boolean;
}) {
  const src = product.images?.[0];
  return (
    <div
      className={className}
      style={{
        background: src ? "#ead8c4" : product.hue,
        height,
      }}
    >
      {showBadge && product.badge ? <span className="badge">{product.badge}</span> : null}
      {src ? (
        <img src={src} alt={product.name} />
      ) : (
        <span>{product.glyph}</span>
      )}
    </div>
  );
}
