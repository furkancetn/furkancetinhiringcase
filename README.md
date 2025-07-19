# furkancetinhiringcase
Furkan Çetin Hiring Case

## Nasıl Kullanılır?

1. [https://www.e-bebek.com/](https://www.e-bebek.com/) adresine gidin.
2. Klavyenizden `F12` tuşuna basarak veya sağ tıklayıp "İncele" diyerek geliştirici araçlarını açın.
3. Üstteki sekmelerden "Console" (Konsol) sekmesine geçin.
4. `FURKAN_ÇETİN.js` dosyasının tamamını kopyalayın.
5. Konsola yapıştırıp `Enter` tuşuna basın.
6. Carousel, stories bölümünün hemen altında otomatik olarak görünecektir.

> Not: Sadece e-bebek ana sayfasında çalışır. Başka bir sayfada çalışmaz.

Herhangi bir sorun yaşarsanız sayfayı yenileyip tekrar deneyebilirsiniz.

Not: API da mevcut olmayan rating, rating count vb. gibi değerler için math random aracılığı ile rastgele değerler ürettim.

## Kod Dokümantasyonu

### Ana Fonksiyonlar

#### `targetUrlCheck()`

- **Amaç:** Mevcut URL'nin hedef URL (e-bebek.com) ile eşleşip eşleşmediğini kontrol eder
- **Döndürür:** Boolean (true/false)
- **Not:** Güvenlik için sadece belirli sitede çalışmasını sağlar

#### `fetchProducts()`

- **Amaç:** GitHub Gist API'sinden ürün verilerini çeker
- **Döndürür:** Promise Array - Ürün listesi
- **Hata Yönetimi:** Network hatalarını yakalar ve boş array döndürür

#### `loadProductsFromStorage()`

- **Amaç:** LocalStorage'dan önceden kaydedilmiş ürünleri yükler
- **Döndürür:** Boolean - Başarılı yükleme durumu
- **Avantaj:** Tekrar API çağrısı yapmayı önler

#### `saveFavoritesToStorage()`

- **Amaç:** Favori ürünleri LocalStorage'a kaydeder
- **Kullanım:** Her favori ekleme/çıkarma işleminde otomatik çalışır

#### `addProductToFavorites(productId)`

- **Amaç:** Belirtilen ID'li ürünü favorilere ekler
- **Parametre:** `productId` (Number) - Ürün ID'si
- **Davranış:** Zaten favorilerde varsa çıkarır (toggle)

#### `removeProductFromFavorites(productId)`

- **Amaç:** Belirtilen ürünü favorilerden kaldırır
- **Parametre:** `productId` (Number) - Ürün ID'si

### UI Fonksiyonları

#### `createCarousel()`

- **Amaç:** Ana carousel container'ını ve tüm interaktif özelliklerini oluşturur
- **Döndürür:** HTML Element (DOM node)

#### `createProductCard(product)`

- **Amaç:** Tek bir ürün kartı oluşturur
- **Parametre:** `product` (Object) - Ürün bilgileri
- **Döndürür:** HTML Element (DOM node)

#### `createStyles()`

- **Amaç:** Tüm CSS stillerini dinamik olarak sayfaya ekler

### Yardımcı Fonksiyonlar

#### `getItemsPerView()`

- **Amaç:** Ekran boyutuna göre görünecek ürün sayısını belirler
- **Breakpoint'ler:**
  - ≥1480px: 5 ürün
  - ≥1200px: 4 ürün
  - ≥980px: 3 ürün
  - <980px: 2 ürün

#### `updateSlider()`

- **Amaç:** Slider pozisyonunu günceller ve buton durumlarını ayarlar

#### `init()`

- **Amaç:** Modülü başlatır ve tüm kontrolleri yapar
- **Akış:**
  1. URL kontrolü
  2. Ürün yükleme (LocalStorage → API)
  3. Favori yükleme
  4. Stories bölümü bulma
  5. Carousel enjekte etme


## İletişim

**GitHub:** @furkancetn  
**Email:** <furkncetn@outlook.com>