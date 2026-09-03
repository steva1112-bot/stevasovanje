# Minea Beauty Studio — Sistem za zakazivanje

Moderna PWA web aplikacija za zakazivanje klijenata u frizerskom salonu Minea. Radi na svim uređajima — računar, Android, iPhone.

## Funkcionalnosti

- **3 frizerska naloga** sa različitim bojama (Crveni, Plavi, Crni)
- **Nedeljni kalendar** sa vremenskim slotovima (09:00–18:00)
- **Svi termini vidljivi svima**, ali svaki frizer može da menja **samo svoje**
- **Pregled klijenata** — pretraga, istorija poseta, usluge
- **Statistika** — broj termina, sati rada, prihod
- **PWA (Progressive Web App)** — možeš je instalirati na telefon kao pravu aplikaciju
- **Offline podrška** — radi čak i bez interneta (keširana)
- **Moderan, elegantan dizajn** u stilu salona (crna + rose gold)

## Demo podaci

Aplikacija dolazi sa 8 demo zakazanih termina da biste odmah videli kako izgleda.

## Šifre za prijavu

| Nalog | Šifra |
|-------|-------|
| **Frizer 1** (Crveni) | `frizer1` |
| **Frizer 2** (Plavi) | `frizer2` |
| **Frizer 3** (Crni) | `frizer3` |

---

## 🚀 Kako postaviti na GitHub Pages (besplatno hosting)

### 1. Napravi GitHub repozitorijum

1. Otvori [github.com](https://github.com) i uloguj se
2. Klikni **New repository** (zeleno dugme)
3. Daj ime: `minea-salon` (ili kako god želiš)
4. Ostavi **Public** i klikni **Create repository**

### 2. Uploaduj fajlove

1. U repozitorijumu klikni **Add file** → **Upload files**
2. Preuzmi ZIP sa aplikacijom i raspakuj ga
3. Prevuci SVE fajlove (index.html, css/, js/, assets/, manifest.json, sw.js) u upload polje
4. Klikni **Commit changes**

### 3. Uključi GitHub Pages

1. U repozitorijumu idi na **Settings** (tab)
2. U levom meniju idi na **Pages** (pod "Code and automation")
3. Pod "Build and deployment" → **Source**: izaberi **Deploy from a branch**
4. Izaberi **Branch: main** i folder **/ (root)**
5. Klikni **Save**

### 4. Sajt je live! 🎉

- Posle 1-2 minuta, tvoj sajt će biti dostupan na:
  `https://tvoj-username.github.io/minea-salon/`
- Link će biti prikazan na istom GitHub Pages ekranu

---

## 📱 Kako instalirati na telefon

### iPhone (Safari)

1. Otvori sajt u **Safari** pregledaču
2. Dodir **Share** dugme (□ sa strelicom na dnu)
3. Pomeraj na dole i dodir **"Add to Home Screen"** (Dodaj na početni ekran)
4. Dodir **Add** — ikonica Minea će se pojaviti na početnom ekranu
5. Otvaraj kao pravu aplikaciju, bez adresne trake!

### Android (Chrome)

1. Otvori sajt u **Chrome** pregledaču
2. Dodir **⋮** (tri tačke) u gornjem desnom uglu
3. Izaberi **"Add to Home screen"** (Dodaj na početni ekran)
4. Potvrdi — ikonica će se pojaviti
5. Otvaraj kao pravu aplikaciju!

---

## 📁 Struktura projekta

```
minea-salon/
├── index.html          # Glavna stranica
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (offline)
├── css/
│   └── style.css       # Stilovi i dizajn
├── js/
│   └── app.js          # JavaScript logika
└── assets/
    ├── logo.jpeg       # Logo salona Minea
    ├── icon-72.png     # PWA ikonica (72x72)
    ├── icon-96.png     # PWA ikonica (96x96)
    ├── icon-128.png    # PWA ikonica (128x128)
    ├── icon-144.png    # PWA ikonica (144x144)
    ├── icon-152.png    # PWA ikonica (152x152)
    ├── icon-192.png    # PWA ikonica (192x192)
    ├── icon-384.png    # PWA ikonica (384x384)
    └── icon-512.png    # PWA ikonica (512x512)
```

---

## 🛠️ Lokalno pokretanje (za test)

Ako želiš da testiraš pre postavljanja na GitHub:

### Opcija 1: Direktno otvori fajl
- Dvoklik na `index.html` — radi, ali PWA funkcije (instalacija, offline) neće raditi

### Opcija 2: Lokalni server (preporučeno)
```bash
# Ako imaš Python instaliran:
cd minea-salon
python -m http.server 8000

# Otvori u pregledaču: http://localhost:8000
```

### Opcija 3: VS Code + Live Server
- Instaliraj ekstenziju "Live Server" u VS Code
- Desni klik na `index.html` → "Open with Live Server"

---

## 🔄 Ažuriranje aplikacije

Kad god promeniš kod i push-uješ na GitHub, GitHub Pages će automatski ažurirati sajt (traje ~1 minut).

Ako klijenti ne vide promene odmah:
- **iPhone**: Settings → Safari → Clear History and Website Data
- **Android**: Chrome → Settings → Privacy → Clear browsing data → Cached images and files

---

## 📝 Napomena

Ova verzija čuva podatke u **pregledaču** (localStorage). To znači:
- Podaci ostaju sačuvani dok ne obrišeš keš
- **Svaki telefon/računar ima SVOJE podatke** — nema sinhronizacije između uređaja
- Za pravi salon sa više uređaja, potreban je backend server + baza

Ako želiš punu verziju sa backendom (Node.js + MongoDB/Firebase), javi se! 🚀

---

## 💅 Dizajn

- **Tema**: Tamna (crna pozadina)
- **Akcenti**: Rose gold (#B76E79) + Copper (#C9A87C)
- **Fontovi**: Playfair Display (naslovi) + Inter (tekst)
- **Logo**: Minea Beauty Studio originalni logo
