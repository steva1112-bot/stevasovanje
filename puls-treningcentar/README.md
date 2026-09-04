# Puls — Raspored treninga (GitHub Pages izdanje, sa automatskom sinhronizacijom)

## Kako da postaviš

1. U svom GitHub repozitorijumu (isti gde ti je i Stevasovanje/SP2026) napravi folder, npr. `puls/`.
2. Ubaci **oba fajla** iz ovog zip-a u taj folder: `index.html` i `data.json`.
3. Uključi GitHub Pages za taj repo (Settings → Pages), ili ako je Pages već uključen, stranica će biti dostupna na
   `https://<tvoj-github>.github.io/<repo>/puls/`.
4. Otvori link, uloguj se kao Rodja ili Boki (iste privremene lozinke kao i do sada) i promeni lozinku u Podešavanjima.

## Automatska sinhronizacija između Rodje i Bokija

Da bi obojica odmah videli iste podatke (bez ručnog kopiranja), aplikacija ume sama da upisuje izmene direktno u
`data.json` u tvom GitHub repozitorijumu, preko GitHub-ovog API-ja. Za to je potreban GitHub token — **svaki trener
ga unosi jednom, na svom uređaju**, u Podešavanja → GitHub sinhronizacija.

### Kako da napraviš token (radi to ti, kao administrator, pa prosledi token Rodji i Bokiju — ili neka svako napravi svoj)

1. Na GitHub-u idi na **Settings → Developer settings → Personal access tokens → Fine-grained tokens** →
   "Generate new token".
2. Daj mu ime, npr. "Puls sync", i postavi rok trajanja (npr. 90 dana — kad istekne, treba napraviti novi i uneti
   ga ponovo u aplikaciju).
3. Pod "Repository access" izaberi **"Only select repositories"** i odaberi TAČNO taj jedan repozitorijum
   (npr. `stevasovanje`) — ne daj pristup svim repozitorijumima.
4. Pod "Permissions" → "Repository permissions" → **Contents** → postavi na **"Read and write"**. Ništa drugo nije
   potrebno.
5. Klikni "Generate token" i kopiraj ga (počinje sa `github_pat_...`) — GitHub ga prikazuje samo jednom.
6. U Puls aplikaciji: Podešavanja → GitHub sinhronizacija → unesi:
   - Repozitorijum: `tvoj-github-nalog/naziv-repozitorijuma` (npr. `steva1112-bot/stevasovanje`)
   - Grana: `main`
   - Putanja do fajla: `puls/data.json`
   - GitHub token: nalepi token iz koraka 5
   - Klikni "Sačuvaj i poveži".

Od tog trenutka, svaka izmena (klijent, termin, uplata) se automatski šalje na GitHub. Druga osoba treba samo da
otvori/osveži stranicu da bi videla najnovije podatke.

## Bezbednost — pažljivo pročitaj

- **GitHub Pages sajtovi su javni** (svako sa linkom ih može otvoriti), osim ako platiš GitHub Enterprise za
  privatne Pages. Prijava lozinkom u aplikaciji je zaštita od slučajnog ulaska, **ne prava bezbednosna zaštita** —
  podaci klijenata (imena, telefoni) učitavaju se u pregledač već pri otvaranju stranice, pre unosa lozinke, i mogu
  se videti kroz "View Source"/DevTools bez ikakve lozinke.
- **GitHub token koji uneseš ostaje sačuvan u tom pregledaču** (localStorage) i nikad se ne upisuje u sam
  `index.html` fajl — ali je i dalje vidljiv bilo kome ko ima fizički/daljinski pristup tom uređaju/pregledaču
  (npr. preko DevTools). Zato:
  - koristi **fine-grained token ograničen samo na taj jedan repozitorijum**, sa dozvolom samo za
    "Contents: Read and write" — ne "classic" token sa punim pristupom svim repozitorijumima,
  - postavi rok trajanja tokenu, i osveži ga povremeno,
  - ako posumnjaš da je token kompromitovan, odmah ga obriši na GitHub-u (Settings → Developer settings →
    Personal access tokens) — to odmah onemogućava dalje korišćenje, bez obzira gde je token sačuvan.
- Ako ti je bitno da podaci klijenata uopšte ne budu dostupni bilo kome ko naiđe na link, razmisli o:
  - ostanku na dosadašnjem Claude linku (privatan po podrazumevanom podešavanju, deliš ga samo kome odlučiš), ili
  - pravoj bazi/serveru u pozadini sa stvarnom kontrolom pristupa (veći posao, ali stvarna zaštita) — javi ako
    želiš da to pripremim kad budeš zakupio domen.

## Ručni izvoz/uvoz (rezerva)

U Podešavanjima postoji i "Ručni izvoz/uvoz" — korisno kao rezervna kopija, ili ako GitHub sinhronizacija
privremeno ne radi (npr. token je istekao). Radi na isti način kao ranije: kopiraš tekst i nalepiš ga drugde da
uvezeš.
