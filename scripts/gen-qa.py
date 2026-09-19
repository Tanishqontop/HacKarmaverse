import json
from pathlib import Path

data = json.loads(Path(r"d:\New folder (3)\tmp-qa.json").read_text(encoding="utf-8"))
id_map = {
    "P01": "mittiflow",
    "P02": "nariglow",
    "P03": "mycorise",
    "P04": "jalcycle",
    "P05": "cocoform",
    "P06": "resaree",
}
lines = [
    "export type QaAudience = \"customer\" | \"judge\";",
    "",
    "export interface ProductQa {",
    "  question: string;",
    "  answer: string;",
    "  audience: QaAudience;",
    "}",
    "",
    "export const PRODUCT_QA: Record<string, ProductQa[]> = {",
]
for pid, items in data.items():
    slug = id_map[pid]
    lines.append(f"  {json.dumps(slug)}: [")
    for it in items:
        aud = "customer" if it["type"].startswith("User") else "judge"
        q = json.dumps(it["q"], ensure_ascii=False)
        a = json.dumps(it["a"], ensure_ascii=False)
        lines.append(f"    {{ audience: \"{aud}\", question: {q}, answer: {a} }},")
    lines.append("  ],")
lines.extend(
    [
        "};",
        "",
        "export function customerQuestions(productId: string) {",
        "  return (PRODUCT_QA[productId] ?? []).filter((q) => q.audience === \"customer\");",
        "}",
        "",
    ]
)
Path(r"d:\New folder (3)\src\data\qa.ts").write_text("\n".join(lines), encoding="utf-8")
print("ok", sum(len(v) for v in data.values()))
