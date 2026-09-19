import { Link } from "react-router-dom";
import { CONDITION_LABEL } from "../data/thrift";
import { formatInr } from "../data/products";
import type { UsedListing } from "../types";

export function ThriftCard({ listing }: { listing: UsedListing }) {
  return (
    <Link to={`/thrift/${listing.id}`} className={`pcard${listing.sold ? " sold" : ""}`}>
      {listing.photo ? (
        <img src={listing.photo} alt="" className="thrift-thumb" />
      ) : (
        <div className="thrift-thumb fallback">Used</div>
      )}
      <div className="body">
        <div className="muted">
          {listing.city} · {CONDITION_LABEL[listing.condition]}
        </div>
        <h3>{listing.title}</h3>
        <div className="price">
          <b>{listing.sold ? "Sold" : formatInr(listing.price)}</b>
        </div>
        <div className="muted">{listing.sellerName}</div>
      </div>
    </Link>
  );
}
