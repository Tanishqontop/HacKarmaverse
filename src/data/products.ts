import type { Product } from "../types";

export const CATEGORIES: { id: Product["category"]; label: string; glyph: string }[] = [
  { id: "gardening", label: "Gardening", glyph: "🪴" },
  { id: "lighting", label: "Lighting", glyph: "🪔" },
  { id: "workspace", label: "Workspace", glyph: "💻" },
  { id: "storage", label: "Storage", glyph: "🧺" },
  { id: "furniture", label: "Furniture", glyph: "🪑" },
  { id: "carry", label: "Carry", glyph: "👜" },
];

export const PRODUCTS: Product[] = [
  {
    id: "mittiflow",
    name: "MittiFlow Self-Watering Terracotta Planter",
    brand: "MittiFlow",
    category: "gardening",
    price: 499,
    mrp: 499,
    rating: 4.7,
    reviews: 318,
    badge: "Plant care",
    tagline: "Clay that remembers to water.",
    description:
      "A two-chamber terracotta planter. The lower reservoir wicks moisture up through the unglazed wall so herbs and indoor greens drink slowly instead of drowning. Fill once, then watch the soil stay evenly damp for days — especially useful if you travel or forget the can.",
    highlights: ["Self-watering reservoir", "Breathable terracotta", "18 cm pot", "Indoor / balcony"],
    specs: [
      { label: "Material", value: "Unglazed terracotta, food-safe inner glaze on reservoir" },
      { label: "Size", value: "18 cm diameter, 16 cm height" },
      { label: "Reservoir", value: "About 2–2.5 L (prototype assumption)" },
      { label: "Care", value: "Rinse with water; no detergent. Soak if white salts appear." },
      { label: "Origin", value: "Wheel-thrown in Khurja" },
    ],
    deliveryDays: 4,
    stock: 36,
    hue: "#c45c26",
    glyph: "🪴",
    images: [
      "/products/mittiflow/hero.jpg",
      "/products/mittiflow/lifestyle.jpg",
      "/products/mittiflow/anatomy.jpg",
    ],
    sku: "P01",
    karmaCoins: 50,
  },
  {
    id: "nariglow",
    name: "NariGlow Coconut-Shell + Bamboo Lamp",
    brand: "NariGlow",
    category: "lighting",
    price: 999,
    mrp: 999,
    rating: 4.6,
    reviews: 204,
    badge: "Warm light",
    tagline: "A husk, a stem, a quiet glow.",
    description:
      "A table lamp made from a polished coconut-shell shade and a turned bamboo stem. The warm LED sits inside the shell so light spills through the natural fibre grain rather than a plastic diffuser. Meant for desks, bedside, and corners that should feel like evening on a verandah.",
    highlights: ["Coconut-shell shade", "Bamboo stem", "Warm LED", "USB-C"],
    specs: [
      { label: "Materials", value: "Coconut shell, bamboo, linen cord" },
      { label: "Height", value: "38 cm" },
      { label: "Light", value: "4W warm white LED, 2700K, dimmable" },
      { label: "Power", value: "USB-C, 5V — no hardwiring" },
      { label: "Care", value: "Dust dry. Wipe bamboo with a barely damp cloth." },
    ],
    deliveryDays: 5,
    stock: 22,
    hue: "#8b5a2b",
    glyph: "💡",
    images: ["/products/nariglow/hero.jpg", "/products/nariglow/lifestyle.jpg"],
    sku: "P02",
    karmaCoins: 90,
  },
  {
    id: "mycorise",
    name: "MycoRise Mycelium Laptop Stand",
    brand: "MycoRise",
    category: "workspace",
    price: 899,
    mrp: 899,
    rating: 4.5,
    reviews: 167,
    badge: "Grown, not moulded",
    tagline: "A stand that was farmed, then dried.",
    description:
      "A laptop riser grown from mycelium and agricultural waste, then heat-killed so it stays rigid. It lifts a 13–16 inch laptop to a kinder typing angle, stays light on the desk, and composts at end of life instead of lingering as foam. The surface is sealed against everyday spills but is not a cutting board.",
    highlights: ["Mycelium composite", "13–16 inch laptops", "Compostable at end of life", "Open airflow"],
    specs: [
      { label: "Material", value: "Mycelium + hemp hurd, plant-based sealer" },
      { label: "Load", value: "Up to 4 kg" },
      { label: "Size", value: "28 × 22 × 8 cm rise" },
      { label: "Care", value: "Wipe dry. Keep out of prolonged rain. Do not soak." },
      { label: "End of life", value: "Remove any metal feet, then home-compost the body" },
    ],
    deliveryDays: 5,
    stock: 19,
    hue: "#6b5a3a",
    glyph: "🍄",
    images: ["/products/mycorise/hero.jpg", "/products/mycorise/anatomy.jpg"],
    sku: "P03",
    karmaCoins: 110,
  },
  {
    id: "jalcycle",
    name: "JalCycle Water-Hyacinth Storage Trunk",
    brand: "JalCycle",
    category: "storage",
    price: 1299,
    mrp: 1299,
    rating: 4.8,
    reviews: 141,
    badge: "Weaver-made",
    tagline: "An invasive plant, put to work as a chest.",
    description:
      "A lidded trunk woven from dried water hyacinth — the same weed that chokes lakes — over a cane frame. Use it for blankets, toys, or monsoon clothes. The weave breathes, so linens do not go stale, and the lid sits flush enough for a seat in a pinch. Each trunk is slightly different because the fibre is.",
    highlights: ["Water-hyacinth weave", "Lidded trunk", "Seat-capable lid", "Handwoven"],
    specs: [
      { label: "Material", value: "Water hyacinth, cane frame, cotton lining" },
      { label: "Size", value: "70 × 40 × 40 cm" },
      { label: "Capacity", value: "About 90 L" },
      { label: "Load on lid", value: "Up to 80 kg when placed on a level floor" },
      { label: "Care", value: "Dry wipe. Air in sun if it ever smells damp. No machine wash." },
    ],
    deliveryDays: 6,
    stock: 14,
    hue: "#7a6a3a",
    glyph: "🧺",
    images: ["/products/jalcycle/hero.jpg", "/products/jalcycle/lifestyle.jpg"],
    sku: "P04",
    karmaCoins: 100,
  },
  {
    id: "cocoform",
    name: "CocoForm Modular Coconut-Wood Stool",
    brand: "CocoForm",
    category: "furniture",
    price: 1499,
    mrp: 1499,
    rating: 4.6,
    reviews: 98,
    badge: "Modular",
    tagline: "Coconut timber that stacks into a seat.",
    description:
      "A low stool milled from coconut palm wood — a timber that usually goes to waste when palms are felled. The three-part frame slots together without screws, so you can pack it flat or add a second unit as a side table. Finished in natural oil, not a plastic lacquer, so the grain stays honest.",
    highlights: ["Coconut-wood", "Tool-free assembly", "Flat-pack", "Indoor use"],
    specs: [
      { label: "Material", value: "Coconut palm wood, linseed oil finish" },
      { label: "Height", value: "45 cm seat" },
      { label: "Seat", value: "32 cm diameter" },
      { label: "Load", value: "Up to 110 kg" },
      { label: "Care", value: "Wipe dry. Re-oil yearly if the surface looks thirsty." },
    ],
    deliveryDays: 6,
    stock: 17,
    hue: "#9a6a3a",
    glyph: "🥥",
    images: ["/products/cocoform/hero.jpg", "/products/cocoform/lifestyle.jpg"],
    sku: "P05",
    karmaCoins: 120,
  },
  {
    id: "resaree",
    name: "ReDenim Everyday Utility Bag",
    brand: "ReDenim",
    category: "carry",
    price: 699,
    mrp: 699,
    rating: 4.7,
    reviews: 412,
    badge: "One of a kind",
    tagline: "Used denim, given a second commute.",
    description:
      "A daily utility bag made from recycled denim. Built for market runs, office, and overnight trains. Pattern varies with the source cloth — no two bags are identical.",
    highlights: ["Recycled denim", "Everyday carry", "Inner pocket", "Unique panel"],
    specs: [
      { label: "Material", value: "Recycled denim, cotton lining" },
      { label: "Capacity", value: "14 L" },
      { label: "Strap drop", value: "28 cm" },
      { label: "Care", value: "Spot clean. Do not machine wash or wring." },
      { label: "Note", value: "Pattern varies; no two bags are identical" },
    ],
    deliveryDays: 4,
    stock: 28,
    hue: "#b23a48",
    glyph: "👜",
    images: ["/products/resaree/hero.jpg", "/products/resaree/lifestyle.jpg"],
    sku: "P06",
    karmaCoins: 70,
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function searchProducts(query: string, category?: Product["category"] | "all") {
  const q = query.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const inCat = !category || category === "all" || p.category === category;
    if (!q) return inCat;
    const blob = `${p.name} ${p.brand} ${p.tagline} ${p.description} ${p.category} ${p.highlights.join(" ")}`.toLowerCase();
    return inCat && blob.includes(q);
  });
}

export function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** 1 KarmaCoin reduces ₹1 at guest checkout. */
export const KARMA_TO_INR = 1;

export function karmaToInr(coins: number) {
  return coins * KARMA_TO_INR;
}
