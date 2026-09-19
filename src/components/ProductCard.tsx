import { Link } from "react-router-dom";
import { formatInr } from "../data/products";
import type { Product } from "../types";
import { ProductThumb } from "./ProductMedia";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="pcard">
      <ProductThumb product={product} />
      <div className="body">
        <div className="muted">{product.brand}</div>
        <h3>{product.name}</h3>
        <div className="muted">
          {product.rating} ★ · {product.reviews}
        </div>
        <div className="price">
          <b>{formatInr(product.price)}</b>
          {product.mrp > product.price ? <span className="strike">{formatInr(product.mrp)}</span> : null}
        </div>
        <div className="muted">{product.karmaCoins} KarmaCoins</div>
      </div>
    </Link>
  );
}
