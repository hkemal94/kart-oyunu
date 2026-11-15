// Geri al hakkı bitince reklamla bir hak daha alınacak yer (belge 1.3 ve 5; Kemal, 15 Kasım soru
// turu: her elde birkaç ücretsiz hak, fazlası telefon uygulamasında reklamla). Web deneme
// sürümünde reklam yok: ekranda "[YER TUTUCU: burada reklam olacak]" kutusu çıkar, düğmeye
// dokununca bu işlev true döner ve bir hak gelir. Telefon uygulaması adımında yalnız bu dosya
// değişir: reklam gösterilir, izlenince true döner. Reklam sağlayıcısı [Kemal]; burada hiçbir
// reklam kodu yok.

export async function geriAlHakkiAl(): Promise<boolean> {
  return true;
}
