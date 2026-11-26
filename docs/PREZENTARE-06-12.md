# Ce arăți la laboratoarele 06–12

Deschide Docker Desktop și așteaptă „Engine running”. Pornește backend-ul și frontend-ul cu comenzile din [README](../README.md). Deschide [aplicația](http://localhost:5173/), [Swagger](http://localhost:8080/api/doc), VS Code în folderul proiectului și branch-ul `alexandru.anchidin` pe GitHub după publicarea commiturilor.

## 06 — Rute și JSON

În browser arată `/api/hello/Alexandru`, `/api/time`, `/api/numbers?n=10`, `/api/sum?a=7&b=5`. Pentru `n=10` rezultă `[2,4,6,8,10]`, suma `30`, pătratele `[4,16,36,64,100]`. `n=101` și lipsa lui `b` dau 400; `/api/hello/Alex2` dă 404 deoarece parametrul din rută acceptă numai litere.

În `HelloController.php`, explică: atributul `Route` leagă URL-ul de metodă, `Request` citește query parameters, iar `$this->json()` produce răspunsul JSON și statusul HTTP.

Pentru lista rutelor, rulează `docker exec daw-php php bin/console debug:router` și `docker exec daw-php php bin/console debug:router api_numbers`. Proba de depanare `formatt()` → 500 → jurnal → corectare este consemnată în [dovezi/lab06-depanare.json](dovezi/lab06-depanare.json).

## 07 — Baza de date

Arată `Review.php` și migrarea `Version20261126090000.php`. O recenzie aparține unui produs: relație ManyToOne; `product_id` este cheia străină. `ON DELETE CASCADE` șterge recenziile când este șters produsul. `createdAt` este completat în constructor.

În DBeaver rulează interogările de la sfârșitul `backend/app/sql/date-exemplu.sql`. JOIN arată fiecare recenzie cu numele produsului; LEFT JOIN păstrează și produsele fără recenzii, cu `count=0`, `average=NULL`. Produsele demonstrative au câte trei recenzii și medii 4.00, respectiv 3.67.

O migrare descrie o schimbare reproductibilă a schemei; nu este o copie a bazei și nu se înlocuiește cu modificări manuale făcute numai pe calculatorul tău.

## 08 — API CRUD

În Swagger deschide secțiunea Reviews, apoi GET pentru recenziile unui produs. În Postman importă colecția din `postman/` și folosește folderul „Laboratoarele 08-10” în ordine.

Arată POST valid → 201, autor gol → 400, notă `"4"` ca text → 400, PUT complet → 200, DELETE → 204 și GET după ștergere → 404. Cererea validă salvează automat `reviewId`; șterge numai recenzia creată pentru demonstrație. `/api/reviews/abc` nu ajunge în `show()` deoarece ruta cere cifre.

GET citește; POST creează; PUT înlocuiește câmpurile modificabile ale unei resurse existente; DELETE șterge. În controller, `persist()` înregistrează obiectul nou, iar `flush()` trimite modificările la baza de date. Ruta `/api/products/{id}/rating` calculează media cu două zecimale; fără recenzii întoarce `null`.

## 09 — React conectat la API

În Produse deschide „DAW Demo - Caiet”. Adaugă o recenzie proprie cu nume, notă și comentariu. Arată că numărul și media se actualizează, formularul se golește, iar mesajul de succes dispare după aproximativ trei secunde. Reîncarcă pagina pentru a demonstra persistența. Editează recenzia, apoi șterge-o cu confirmare.

În `ReviewSection.jsx`, explică `useEffect` pentru încărcarea inițială și `useState` pentru listă/formular/stări de încărcare. `api.js` centralizează fetch. Actualizarea stării redesenează lista fără reîncărcarea întregii pagini. Media din interfață are o zecimală.

## 10 — Validare și securitate de bază

Trimite autorul `A`: trebuie să apară eroarea lângă câmp. O notă în afara intervalului sau trimisă ca text este respinsă în Postman. Un comentariu de peste 1000 de caractere este respins de server. `noValidate` permite demonstrarea validării serverului; `aria-invalid` indică accesibil câmpul greșit.

Arată atributele Symfony Validator din `Review.php`. Validarea numai în browser nu este suficientă, deoarece API-ul poate fi apelat direct. Pentru XSS, un comentariu `<img src=x onerror=alert(1)>` este afișat ca text, fără imagine sau alertă; React face escaparea când textul este pus în `{review.comment}`. Nu folosi `dangerouslySetInnerHTML` pentru comentarii.

Proba de hashing executată este în `dovezi/parola-demo.json`: aceeași parolă demonstrativă a produs hash-uri diferite, iar verificarea corectă/greșită a întors true/false. Hash-ul nu este criptare reversibilă; verificarea folosește `password_verify()`. Exemplul PHP este în `examples/PasswordDemoController.php.example`. Controllerul nu mai este în rutele active, conform curățeniei cerute la lab. 12. Dacă profesorul cere repetarea, copiază temporar exemplul în `backend/app/src/Controller/PasswordDemoController.php`, apelează **POST `/api/demo/parola`** cu `{"password":"parola123"}`, apoi elimină acea copie. Nu folosi o parolă reală.

## 11 — Git și depanare

Arată [dovada conflictului local](dovezi/lab11-conflict-local.txt) și [ghidul](lab11-git-depanare.md). Au fost folosite două clone locale și aceeași identitate: acesta este un exercițiu de pregătire, nu colaborare realizată cu alt student. Repetă cerința cu un coleg de bancă pe un branch de test. Nu rezolva conflictul prin ștergerea arbitrară a variantei colegului: comparați cele două schimbări și alegeți împreună textul final.

În `dovezi/depanare.json`, arată traseul simptom → Network → status/Response → jurnal → corectare. Greșeala `toArrray()` produce 500 și un mesaj real în `dev.log`; ruta frontend greșită produce 404. După restaurare, ambele revin la funcționarea normală. Nu lăsa greșelile demonstrative în codul publicat.

## 12 — Calitate și pregătire

Arată cele șase rapoarte HTML din `lighthouse/`, tabelul înainte/după din README și trei schimbări concrete: titluri/descriere, etichete asociate câmpurilor, contrast/focus. Explică limitele comparației Performance pe serverele de dezvoltare; nu afirma că toate scorurile au crescut.

Arată `frontend/app/dist` după build, SQL-ul de exemplu, capturile din README și [lista de verificare](lab12-calitate-predare.md). Verificarea pe calculatorul unui coleg trebuie efectuată efectiv. Pentru proiectul final trebuie completate tema aprobată și echipa; aplicația de laborator nu înlocuiește automat proiectul cerut de metodologie.

## Înainte să mergi la laborator

1. Exersează singur fluxul adăugare → reîncărcare → editare → ștergere → eroare de validare.
2. Citește fișierele principale și explică drumul unei cereri în propriile cuvinte.
3. Verifică `git status -sb` și publică pe branch-ul personal, apoi deschide commiturile pe GitHub.
4. Nu apăsa „Compare & pull request” pentru a uni laboratoarele în `main` fără indicația profesorului; lucrul individual se prezintă pe branch-ul tău.
