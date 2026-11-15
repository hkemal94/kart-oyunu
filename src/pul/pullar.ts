// Pul görsellerinin kaydı. Anahtar oyundan bağımsız: "YYYY-AA" aylık pul, "YYYY-Q1".."YYYY-Q4"
// çeyreğin büyük pulu. Değer görselin yolu (public/ altından, ör. "pullar/2026-01.png") ya da null.
// Kayıtta olmayan ya da null olan pul yer tutucu çerçeveyle çizilir (Pul.tsx).
//
// Her pul ayrı tasarlanır (Kemal, 15 Kasım akşam); tasarımlar henüz yok. Bir pulun görseli
// gelince yalnız buraya bir satır eklenir, ör. "2026-01": "pullar/2026-01.png". Görselin kaynağı
// ve lisansı docs/lisanslar.md'ye yazılır.

export const PUL_GORSELLERI: Record<string, string | null> = {};

export const pulGorseli = (anahtar: string): string | null => PUL_GORSELLERI[anahtar] ?? null;
