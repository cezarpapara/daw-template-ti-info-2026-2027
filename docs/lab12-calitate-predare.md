# Laboratorul 12 — Calitate și pregătirea prezentării

Rezultate din **26 noiembrie 2026**.

## Audit înainte și după

Cele șase rapoarte HTML sunt în [lighthouse](lighthouse/), iar scorurile în [README](../README.md#lighthouse-desktop). Sunt audituri Lighthouse 13.6.0, Desktop Navigation, patru categorii, Chrome 158 într-un profil nou, 1350×940, CPU ×1 și RTT simulat 40 ms.

Referința „înainte” este codul commitului `72e27f9` dintr-o copie separată, servit de Vite pe 5177. „După” este aplicația extinsă, pe Vite în Docker, port 5173. Ambele folosesc același API, aceleași rute `/`, `/produse`, `/produse/1` și aceleași setări de audit. Deoarece mediul de servire diferă și s-au adăugat funcții, Performance nu este o comparație izolată a optimizărilor; scorurile Acasă și Produse au scăzut ușor. Nu sunt rezultate de producție.

| Pagina | Performance înainte → după | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Acasă | 100 → 95 | 100 → 100 | 100 → 100 | 82 → 100 |
| Produse | 100 → 98 | 94 → 100 | 100 → 100 | 82 → 100 |
| Detalii | 72 → 74 | 100 → 100 | 100 → 100 | 82 → 100 |

## Îmbunătățiri aplicate

1. `<title>` distinct pe pagini, `lang="ro"` și meta description. Titlurile se actualizează la navigare în React 19.
2. Etichete `<label>` asociate controalelor, antete `<th>` pentru tabele, mesaje de eroare cu `aria-describedby`/`aria-invalid`; problema selectului fără etichetă din Produse a fost corectată.
3. Contrast mai bun pentru butoane și stele, focus vizibil și „Sari la conținut”. Legătura poate fi activată de la tastatură și focalizează `<main>`. WebAIM a confirmat pe alb: buton `#2F5FD0` 5,72:1, stele `#815300` 6,62:1 și text secundar `#52606D` 6,45:1; toate depășesc pragul AA 4,5:1 pentru text normal. URL-urile și rezultatele sunt în [contrast.json](dovezi/contrast.json).
4. `robots.txt` valid, în locul răspunsului HTML al aplicației pentru o adresă inexistentă; ilustrația SVG are dimensiuni explicite și text alternativ. SVG-ul existent nu a fost transformat inutil în imagine raster.

Scorul Lighthouse 100 la accesibilitate acoperă verificările automate disponibile, nu certifică accesibilitatea completă. Probele de tastatură și mobil sunt consemnate separat în [depanare.json](dovezi/depanare.json).

## Build și verificări efectuate

- **65 verificări HTTP trecute** pe Symfony/PostgreSQL reale: [api-reverificare.txt](dovezi/api-reverificare.txt). Se pot repeta cu `node tests/api.mjs`.
- **Browser:** creare, validare pe câmpuri, XSS afișat ca text, mesaj de succes 3 secunde, persistență după reload, editare și ștergere, mobil: [browser.json](dovezi/browser.json). Înregistrările temporare au fost eliminate.
- **SQL:** instrucțiunile `up()` ale celor trei migrări au rulat într-o bază temporară goală; relația și CASCADE au fost verificate. Seed-ul a fost rulat de două ori fără dubluri: [baza-date.json](dovezi/baza-date.json). Baza de probă a fost eliminată. Aceasta este o probă SQL, nu o execuție a comenzii Doctrine într-un mediu nou.
- **Build inițial Vite 8.3.2 local și în container; lint oxlint local:** [build.txt](dovezi/build.txt). 103 module, JS 278,70 kB / gzip 87,40 kB, CSS 4,83 kB / gzip 1,63 kB. Build-urile inițiale au produs același SHA-256 pentru fișierul JavaScript.
- **Build local după reverificare:** [build-reverificare.txt](dovezi/build-reverificare.txt). Include corecțiile pentru texte lungi și starea de încărcare: JS 278,95 kB / gzip 87,46 kB, CSS 4,85 kB / gzip 1,63 kB. `dist` a fost actualizat și este ignorat de Git.
- **Doctrine pe baza curentă:** ambele mesaje `[OK]`: mapping corect și schemă sincronizată; [ieșirea terminalului](dovezi/docker-student.txt).
- **Depanare:** 500 și 404 provocate intenționat, apoi revenire la funcționare normală; probă de conexiune refuzată și reîncercare: [depanare.json](dovezi/depanare.json).
- **Curățenie:** `PasswordDemoController` este scos din `src/Controller`; rămâne numai exemplul `.php.example` pentru explicații. Nu au rămas greșelile deliberate. `.env.local`, `vendor`, `node_modules`, `dist` și datele PostgreSQL sunt ignorate.

Din rădăcina repository-ului, cu containerele pornite:

```powershell
docker exec daw-php php bin/console doctrine:schema:validate
docker exec daw-react npm run build
```

Rezultatele comenzilor din container sunt în `dovezi/docker-student.txt`. Verificările HTTP, PostgreSQL, Chrome și build-ul local sunt consemnate separat în fișierele de mai sus.

`VITE_API_URL` se fixează în cod la build; pentru un server real, construiți cu adresa API potrivită. `dist` nu se publică în Git. Aplicația curentă este pentru laborator, cu CRUD local fără autentificare.

## Lista pentru predare

- [x] Minimum trei îmbunătățiri concrete, rapoarte înainte/după și scoruri în README.
- [x] Build local reușit și `dist` ignorat.
- [x] Script SQL cu categorii/produse/recenzii, executat și repetat fără dubluri.
- [x] SQL-ul migrărilor verificat pe o bază temporară goală.
- [x] Scenarii CRUD/validare și capturi reale în `capturi/`.
- [x] README cu pornire, arhitectură, rezultate și contribuții.
- [x] Controller demonstrativ și greșeli intenționate eliminate din aplicație.
- [x] Ieșire `doctrine:schema:validate` confirmată pe baza curentă.
- [x] Build executat și în containerul React.
- [ ] Migratorul Doctrine verificat cap-coadă într-un mediu nou, la proba de pe calculatorul colegului.
- [ ] Un coleg din altă echipă clonează și pornește aplicația pe calculatorul lui folosind numai README-ul.
- [ ] Verificarea publicării ultimului commit pe branch-ul `alexandru.anchidin`.

Pentru proba cu un coleg notați numele, data, sistemul și problemele găsite. Nu înlocuiți această cerință printr-o clonă pe același calculator. Opriți containerele `daw-*` existente pe calculatorul colegului înainte de pornirea noii copii.

## Proiectul final

Laboratoarele extind template-ul. Proiectul final cere o temă din lista disciplinei sau aprobată, minimum două entități proprii legate, CRUD validat, interfață React și documentație conform îndrumarului „template PSW + PWEB”. Entitățile preexistente din template nu se prezintă automat ca entități proprii.

Tema finală este amânată. Pentru etapa curentă folosiți [PLAN.md](PLAN.md), [verificarea cerințelor](VERIFICARE-CERINTE.md) și [ghidul de prezentare](PREZENTARE-06-12.md).

Sursă a cerințelor: fișa DAW — Laboratorul 12 și metodologia disciplinei. Dovezile de execuție sunt fișierele legate mai sus.
