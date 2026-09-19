import { customerQuestions, PRODUCT_QA } from "../data/qa";
import { formatInr } from "../data/products";
import type { Product } from "../types";

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "what",
  "how",
  "can",
  "will",
  "does",
  "from",
  "your",
  "you",
  "are",
  "is",
  "it",
  "in",
  "on",
  "of",
  "to",
  "a",
  "an",
  "i",
  "my",
  "me",
  "do",
  "if",
  "or",
  "be",
  "not",
  "about",
  "please",
]);

function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function productLabel(product: Product) {
  return product.brand || product.name;
}

/** Excel answers say “prototype”; speak the actual stall name instead. */
function speakAsProduct(text: string, product: Product) {
  const name = productLabel(product);
  return text
    .replace(/\bthis prototype\b/gi, `this ${name}`)
    .replace(/\bthe current prototype\b/gi, `the current ${name}`)
    .replace(/\bthe prototype\b/gi, `the ${name}`)
    .replace(/\ba prototype\b/gi, `a ${name}`)
    .replace(/\bprototype\b/gi, name);
}

export function answerAboutProduct(product: Product, question: string): string {
  const q = question.trim();
  if (!q) {
    return "Ask a listed question about this product — materials, care, use, or KarmaCoins. I do not invent specs.";
  }

  const ql = q.toLowerCase();
  if (/\b(karma\s*coins?|karmacoins?|coins?)\b/.test(ql)) {
    return `${product.name} is ${formatInr(product.price)}. A guest purchase credits ${product.karmaCoins} KarmaCoins per unit to this device. No account is created.`;
  }
  if (/\b(price|cost|mrp|₹|\brs\b)\b/.test(ql) || /\bhow much (does it cost|is it|for this|do i pay)\b/.test(ql)) {
    return `${product.name} is ${formatInr(product.price)} (${productLabel(product)} list price). You also receive ${product.karmaCoins} KarmaCoins per unit after checkout.`;
  }

  const bank = PRODUCT_QA[product.id] ?? [];
  const qt = tokens(q);
  let bestScore = 0;
  let bestAnswer = "";

  for (const item of bank) {
    const qtok = tokens(item.question);
    const overlapQ = qt.filter((t) => qtok.includes(t)).length;
    const overlapText = qt.filter(
      (t) => item.question.toLowerCase().includes(t) || item.answer.toLowerCase().includes(t),
    ).length;
    const audienceBoost = item.audience === "customer" ? 0.5 : 0;
    const score = overlapQ * 3 + overlapText * 0.35 + audienceBoost;
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  const min = qt.length <= 3 ? 2.8 : 4;
  if (bestAnswer && bestScore >= min) return speakAsProduct(bestAnswer, product);

  const suggestions = customerQuestions(product.id)
    .slice(0, 4)
    .map((x) => `“${x.question}”`)
    .join(" ");
  return `I only answer from this product’s question matrix. Try ${suggestions}`;
}
