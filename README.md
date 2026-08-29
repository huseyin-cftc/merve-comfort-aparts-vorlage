# Merve Comfort Aparts — Website

Eine statische Website (HTML, CSS, JavaScript – kein Framework, keine Build-Schritte).
Ziel der Seite: Besucher stellen eine **direkte Anfrage**, statt über Booking.com oder Airbnb zu buchen.

```
merve-comfort-aparts/
├── index.html              ← der gesamte Seiteninhalt
├── assets/
│   ├── css/styles.css      ← Design (Farben, Schriften, Layout)
│   ├── js/main.js          ← Funktionen + CONFIG (WhatsApp, E-Mail, Formular)
│   └── img/                ← hier kommen die echten Fotos hinein
└── README.md               ← diese Datei
```

---

## 1. Zuerst: die drei wichtigsten Einstellungen

Öffnen Sie `assets/js/main.js`. Ganz oben steht der Block `CONFIG`:

| Feld | Was eintragen |
|---|---|
| `whatsappNumber` | Nummer international, **ohne** `+` und ohne Leerzeichen, z. B. `'4917012345678'` |
| `email` | E-Mail-Adresse für Anfragen |
| `formEndpoint` | Adresse, an die das Formular sendet (siehe Abschnitt 4) |

Solange `whatsappNumber` leer ist, zeigen die WhatsApp-Buttons nur einen Hinweis an.
Solange `formEndpoint` leer ist, öffnet das Formular stattdessen WhatsApp mit einer
fertig ausgefüllten Nachricht – das funktioniert sofort und ohne Server.

---

## 2. Platzhalter-Checkliste

**Alle offenen Stellen sind mit `TODO` markiert** und auf der Seite gelb hinterlegt.
Suchen Sie im Projekt einfach nach `TODO` (in fast jedem Editor `Strg`+`Umschalt`+`F`).

Stand jetzt: **124 Markierungen in `index.html`**, 5 in `assets/js/main.js`.

> Wichtig: Diese Seite enthält bewusst **keine erfundenen Angaben**.
> Keine Preise, keine Bewertungen, keine Ausstattung, keine Telefonnummern, keine Adresse.
> Alles, was dort steht, muss vor dem Livegang durch echte Informationen ersetzt werden.

### 2.1 Kopfbereich / SEO (`index.html`, oben)
- [ ] `<title>` – Ortsnamen einsetzen, z. B. „Merve Comfort Aparts – Ferienwohnungen in Didim“
- [ ] `<meta name="description">` – Ortsnamen einsetzen, 150–160 Zeichen
- [ ] `<link rel="canonical">` – echte Domain
- [ ] `og:url` und `og:image` – echte Domain, Vorschaubild unter `assets/img/og-image.jpg`

### 2.2 Inhalte
- [ ] **Hero** – Ort (2×) und ein Satz über das Haus
- [ ] **Über uns** – 3–4 Sätze über die Vermietung; Anzahl Apartments, max. Belegung, Check-in, Mindestaufenthalt
- [ ] **Apartments** – pro Wohnung: Name, Beschreibung, Wohnfläche, Schlafzimmer, Gäste, Ausblick
      (Wohnungen hinzufügen/löschen: einen kompletten `<article class="apt">` kopieren bzw. entfernen –
      danach die Nummern `01 / 02 / 03` und die Auswahlliste im Formular anpassen)
- [ ] **Ausstattung** – die Beispielzeilen durch die tatsächliche Ausstattung ersetzen, den gelben
      Platzhalter-Hinweis (`<p class="notice">`) danach **löschen**
- [ ] **Lage** – Beschreibung der Umgebung, Entfernungen; nicht zutreffende Zeilen löschen
- [ ] **Lage: Karte** – bei Google Maps auf *Teilen → Karte einbetten*, das `<iframe>` kopieren und
      damit den grauen Kasten `<div class="mapbox">` ersetzen
- [ ] **Warum direkt bei uns** – Antwortzeit eintragen (z. B. „meist innerhalb von 24 Stunden“)
- [ ] **Gästestimmen** – siehe Abschnitt 3
- [ ] **FAQ** – alle acht Antworten schreiben; nicht passende Fragen löschen
- [ ] **Kontakt** – Telefon, E-Mail, Adresse (auch in `href="tel:…"` und `href="mailto:…"`!)
- [ ] **Footer** – Adresse, Telefon, E-Mail
- [ ] **Impressum, Datenschutzerklärung, AGB** – anlegen und verlinken (in Deutschland Pflicht)

### 2.3 Zum Schluss
- [ ] Strukturierte Daten aktivieren (Abschnitt 5)
- [ ] Nach `TODO` suchen – es darf keine Fundstelle übrig bleiben
- [ ] Nach `.todo` und `.notice` in `index.html` suchen: übrig gebliebene gelbe Kästen entfernen

---

## 3. Gästestimmen — bitte nur echte Zitate

Der Abschnitt „Was Gäste sagen“ ist absichtlich leer.
Erfundene Bewertungen sind rechtlich angreifbar und Gäste erkennen sie ohnehin.

Der einfachste ehrliche Weg: vorhandene Bewertungen von Booking.com oder Airbnb übernehmen
– mit Vorname, Monat/Jahr und einem Hinweis, woher das Zitat stammt.
Dasselbe gilt für Sterne-Bewertungen und Auszeichnungen: nur zeigen, was wirklich vergeben wurde.

---

## 4. Das Anfrageformular scharf schalten

Die Seite ist statisch und kann selbst keine E-Mails versenden. Drei Möglichkeiten:

**a) Nur WhatsApp (sofort einsatzbereit)**
Nur `CONFIG.whatsappNumber` eintragen, `formEndpoint` leer lassen. Beim Absenden öffnet sich
WhatsApp mit allen Angaben als fertige Nachricht. Der Gast muss dort nur noch auf „Senden“ tippen.

**b) Formulardienst (empfohlen)**
Bei einem Dienst wie Formspree ein Formular anlegen und die erhaltene Adresse in
`CONFIG.formEndpoint` eintragen. Die Anfrage kommt dann als E-Mail an.
Das Formular sendet die Felder als JSON:
`anreise, abreise, gaeste, apartment, name, email, telefon, nachricht`.
Klappt der Versand nicht, fällt die Seite automatisch auf WhatsApp zurück.

**c) Eigener Server**
`CONFIG.formEndpoint` auf ein eigenes Skript zeigen lassen, das JSON per `POST` annimmt.

Gegen Spam ist ein unsichtbares Feld (`website`) eingebaut – von Bots ausgefüllte Anfragen
werden verworfen. Ein Captcha ist nicht nötig.

---

## 5. Strukturierte Daten (Google)

Ganz unten in `index.html` steht ein auskommentierter Block `LodgingBusiness`.
Er hilft Google, Adresse, Kontakt und Zimmerzahl zu verstehen.

1. Alle `TODO`-Werte im Block durch echte Daten ersetzen
2. Die Kommentarzeichen `<!--` und `-->` um den `<script>`-Block entfernen
3. Mit dem Google-Test für Rich-Suchergebnisse prüfen

**Nicht mit Platzhaltern online stellen** – falsche Angaben schaden mehr, als sie nutzen.

---

## 6. Fotos austauschen

Aktuell sind Platzhalterfotos von Unsplash eingebunden (externe Adressen, beginnend mit
`https://images.unsplash.com/`). Sie sind nur zum Anschauen gedacht.

So ersetzen Sie ein Bild:

1. Foto in `assets/img/` ablegen, z. B. `hero.jpg`
2. In `index.html` die lange Unsplash-Adresse durch `assets/img/hero.jpg` ersetzen
3. Das `srcset="…"` daneben ersatzlos löschen (es verweist auf mehrere Unsplash-Größen)
4. `width` und `height` auf die echten Pixelmaße setzen – sonst springt das Layout beim Laden
5. Den `alt`-Text anpassen: beschreiben, was zu sehen ist
   (gut: „Schlafzimmer von Apartment 2 mit Doppelbett und Meerblick“ – schlecht: „Bild1“)

Vor dem Hochladen jedes Foto auf ca. 2000 px Breite verkleinern und als JPG oder WebP
speichern, Zielgröße unter 300 KB. Das ist der größte Hebel für die Ladezeit.

Reihenfolge der Galerie: Die Klassen `g1` bis `g8` bestimmen die Größe der Kacheln.
`g1` und `g8` sind die breiten, `g2` die hohe Kachel.

---

## 7. Design ändern

Alle Farben, Schriftgrößen und Abstände stehen ganz oben in `assets/css/styles.css`
im Block `:root`. Eine Änderung dort wirkt auf der gesamten Seite.

| Variable | Bedeutung |
|---|---|
| `--paper` | Grundfarbe der Seite (warmes Off-White) |
| `--ink` | Textfarbe und dunkle Abschnitte |
| `--accent` | Dunkelgrün: Buttons, Links, Anfrage-Abschnitt |
| `--pad-section` | Höhe der Abstände zwischen den Abschnitten |

Schriften: **Fraunces** für Überschriften, **Karla** für Fließtext (beide über Google Fonts).

---

## 8. Veröffentlichen

Der Ordner enthält nur statische Dateien – er läuft auf jedem Webspace.
Den kompletten Inhalt von `merve-comfort-aparts/` in das Web-Verzeichnis hochladen
(bei klassischem Hosting meist `httpdocs/` oder `public_html/`).
Bei Netlify, Vercel oder Cloudflare Pages den Ordner einfach als Projekt verbinden;
ein Build-Befehl ist nicht nötig.

Danach:
- [ ] HTTPS aktivieren
- [ ] `robots.txt` und `sitemap.xml` mit der echten Domain anlegen
- [ ] Google-Unternehmensprofil anlegen bzw. verknüpfen – für lokale Suche der wichtigste Hebel
- [ ] Website-Adresse bei Booking.com und Airbnb im Profil hinterlegen, soweit dort erlaubt

---

## 9. Was schon eingebaut ist

- Mobile first, getestet in 390 px, 834 px und 1440 px Breite
- Feste Anfrage-Leiste am unteren Bildschirmrand auf Mobilgeräten
- Schnellanfrage direkt unter dem Titelbild; die Eingaben werden in das große Formular übernommen
- „Diese Wohnung anfragen“ wählt das Apartment im Formular vor
- Formularprüfung auf Deutsch: Pflichtfelder, Datum in der Vergangenheit, Abreise vor Anreise,
  mindestens eine Kontaktmöglichkeit
- Galerie mit Lightbox, bedienbar per Maus, Tastatur (Pfeiltasten, Esc) und Screenreader
- Semantisches HTML, ein `<h1>`, `<h2>` je Abschnitt, `alt`-Texte, Sprungmarke zum Inhalt,
  sichtbare Fokus-Rahmen
- Animationen werden bei aktivierter Systemeinstellung „Bewegung reduzieren“ abgeschaltet
- Keine externen Bibliotheken, kein Cookie-Banner nötig (es werden keine Cookies gesetzt)

> Hinweis zum Datenschutz: Schriften und Platzhalterfotos werden derzeit von Google Fonts
> bzw. Unsplash geladen. Wenn Sie das vermeiden wollen, laden Sie die Schriftdateien herunter
> und binden Sie sie lokal ein – die Fotos ersetzen Sie ohnehin durch eigene.

---

## 10. Hinweis zur Projekt-Historie

Dieser Ordner wurde am 27.08.2026 kurzzeitig mit dem Inhalt einer echten
Hannover-Version (realer Standort, Kontaktdaten, mehrseitige Struktur) überschrieben,
weil eine andere, parallel laufende Chat-Session versehentlich hier statt in
`merve-redesign/` gearbeitet hat. Diese Datei-Gruppe (`index.html`, `styles.css`,
`main.js`, `README.md`) ist die wiederhergestellte ursprüngliche Platzhalter-Version.
Die echte Hannover-Version liegt vollständig in `merve-redesign/`.

Im Ordner liegen noch einige Dateien aus dieser Überschneidung (`messe.html`,
`anfrage.php`, `impressum.html`, `datenschutz.html`, `robots.txt`, `sitemap.xml`,
echte Fotos unter `assets/img/`), die nicht Teil dieser Platzhalter-Version sind.
Sie sind unschädlich, gehören aber eigentlich nicht hierher – bei Gelegenheit
können sie gelöscht werden, ihr vollständiger Inhalt ist bereits sicher in
`merve-redesign/` vorhanden. Der versteckte `.git`-Ordner in diesem Verzeichnis
gehört ebenfalls zu jener anderen Session (verbunden mit
`github.com/huseyin-cftc/merve-comfort-aparts`) und wurde hier nicht angerührt.
