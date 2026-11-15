// Spider ve klasik solitaire'in ortak kural parçaları: karıştırma ve geri al (belge 1.3).
// Ekrandan ayrı; bu dosya hiçbir şey içe almaz. Testleri: testler/spider.test.ts,
// testler/yardimcilar.test.ts, testler/klondike.test.ts.

export function karistir<T>(dizi: T[], rastgele: () => number = Math.random): T[] {
  const sonuc = [...dizi];
  for (let i = sonuc.length - 1; i > 0; i--) {
    const j = Math.floor(rastgele() * (i + 1));
    [sonuc[i], sonuc[j]] = [sonuc[j], sonuc[i]];
  }
  return sonuc;
}

// Geri al: her hamleden önceki masa saklanır; geri alınca bir öncekine dönülür. Geri almak da bir
// hamle sayılır (Kemal, 15 Kasım soru turu). Hak sınırı burada değil, src/kart/geriAlHakki.ts'te.
export interface GeriAlSonucu<T> {
  masa: T;
  gecmis: T[];
}

export function geriAl<T extends { hamle: number }>(masa: T, gecmis: T[]): GeriAlSonucu<T> | null {
  if (gecmis.length === 0) return null;
  const onceki = gecmis[gecmis.length - 1];
  return { masa: { ...onceki, hamle: masa.hamle + 1 }, gecmis: gecmis.slice(0, -1) };
}
