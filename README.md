# KLÜP Dış Ticaret — Web Sitesi

Çin → Türkiye nakliye hizmeti için sunucusuz (statik) tanıtım sitesi.
HTML + CSS + JavaScript. GitHub Pages ile yayınlanabilir.

## Dosyalar
- `index.html` — sayfa içeriği
- `styles.css` — tasarım
- `script.js` — WhatsApp linkleri, mobil menü, animasyonlar
- `assets/` — görseller

## ⚙️ Yayınlamadan önce yapılacak TEK ayar
`script.js` dosyasının başındaki numarayı kendi WhatsApp numaranızla değiştirin:

```js
const WHATSAPP_NUMBER = "905555555555";
```
Format: ülke kodu + numara, başında `+` veya `0` **olmadan**. Örn: `905321234567`.

(İsteğe bağlı) `index.html` içindeki e-posta adresini de güncelleyin: `info@klupdisticaret.com`.

## 🚀 GitHub Pages ile yayınlama
1. Bu klasörü bir GitHub deposuna yükleyin (dosyalar kök dizinde olsun).
2. Depoda **Settings → Pages**.
3. **Source**: `Deploy from a branch`, **Branch**: `main` / `(root)` seçin, **Save**.
4. Birkaç dakika sonra siteniz `https://kullaniciadi.github.io/depo-adi/` adresinde yayında olur.

## Yerelde görüntüleme
`index.html` dosyasına çift tıklamanız yeterli — kurulum gerekmez.
