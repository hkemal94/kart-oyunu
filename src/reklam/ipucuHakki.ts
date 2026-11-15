// İpucunun reklamla alınacağı yer (belge 1.3 ve 5; Kemal, 15 Kasım: telefon uygulamasında ipucu
// reklam izleyerek alınır). Web deneme sürümünde reklam yok: ipucu her zaman serbest.
// Telefon uygulaması adımında yalnız bu dosya değişir: reklam gösterilir, izlenince true döner.
// Reklam sıklığı ve sağlayıcı [Kemal]; burada hiçbir reklam kodu yok.

export async function ipucuHakkiAl(): Promise<boolean> {
  return true;
}
