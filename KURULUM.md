# Cebimdeki Eskişehir — Kurulum (v25)

## Ne bu?

Statik bir Progressive Web App (PWA). Sunucu tarafı kod yok, veritabanı yok, API yok.
Tüm içerik tarayıcıda çalışır; ilerleme ve fotoğraflar yalnızca kullanıcının cihazında saklanır.

## Gereksinimler

- **HTTPS zorunlu** — GPS, kamera ve Service Worker yalnızca güvenli bağlamda (HTTPS veya localhost) çalışır.
- Modern tarayıcı (Chrome / Safari / Edge / Firefox güncel sürümler).
- Apache, Nginx, IIS veya herhangi bir statik dosya sunucusu yeterlidir.

## Kurulum

1. `Cebimdeki-Eskisehir-v25-web.zip` dosyasını açın.
2. İçindeki dosyaları web root’a **veya** alt klasöre kopyalayın, örneğin:
   - `https://ornek.bel.tr/` (kök)
   - `https://ornek.bel.tr/cebimdeki-eskisehir/` (alt klasör — önerilir)
3. `start_url` ve Service Worker kapsamı göreli (`./`) olduğu için alt klasörde de çalışır.
4. Tarayıcıda HTTPS adresini açın ve test checklist’ini uygulayın.

**Uyarı:** loca.lt / localtunnel **KULLANILMASIN**. Kalıcı belediye HTTPS sunucusu kullanın.

## Apache

- Bu paketteki `.htaccess` örnek ayarları içerir (HTTPS yönlendirme, MIME, `sw.js` cache).
- `AllowOverride` ile `.htaccess` etkin olmalı; değilse aynı kuralları sanal host yapılandırmasına ekleyin.
- MIME: `manifest.json` → `application/manifest+json` (veya `application/json`).

## Nginx

Örnek:

```nginx
location /cebimdeki-eskisehir/ {
  alias /var/www/cebimdeki-eskisehir/;
  try_files $uri $uri/ /cebimdeki-eskisehir/index.html;
}

location = /cebimdeki-eskisehir/manifest.json {
  default_type application/manifest+json;
  add_header Cache-Control "no-cache";
}

location = /cebimdeki-eskisehir/sw.js {
  add_header Cache-Control "no-cache";
  default_type application/javascript;
}
```

## IIS

- Paketteki `web.config` örneğini site veya uygulama köküne koyun.
- Statik içerik MIME eşlemesi: `.json` / manifest için `application/manifest+json` veya `application/json`.
- HTTPS bağlayıcısı (binding) tanımlı olmalıdır.

## Test checklist

- [ ] Ana sayfa HTTPS üzerinden açılır
- [ ] “Ana Ekrana Ekle” / Add to Home Screen çalışır (PWA)
- [ ] Konum (GPS) izni istenir ve durak yakınlığı algılanır
- [ ] Kamera veya galeri ile görev fotoğrafı alınabilir
- [ ] Ağ kesildiğinde (uçak modu) daha önce açılmış sayfa çevrimdışı çalışır
- [ ] `file://` ile açıldığında uyarı gösterir; kamera/GPS beklenmez

## Güncelleme

1. Yeni sürüm dosyalarını mevcut klasörün üzerine yazın.
2. `sw.js` içindeki cache adı (ör. `cebimdeki-esk-v25`) değiştiğinde eski önbellek otomatik temizlenir.
3. Kullanıcılar uygulamayı bir kez yenilediğinde güncellemeyi alır.

## İletişim

Özel Atayurt Okulları · Asım Akçay (TÜBİTAK 2204-B kültürel miras)

## Paket içeriği

- `index.html` — uygulama
- `sw.js` — Service Worker (çevrimdışı)
- `manifest.json` — PWA bildirimi
- `icons/icon-192.png`, `icons/icon-512.png`
- `assets/eskisehir-yili-2026.png`
- `.htaccess` — Apache ipuçları (opsiyonel)
- `web.config` — IIS örneği (opsiyonel)
