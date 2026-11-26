# Laboratorul 11 — Git și depanare

Procedurile de mai jos acoperă conflictele Git și identificarea erorilor în API. Rezultatele exercițiilor locale sunt în secțiunea 5; exercițiul cu un coleg este în lista de activități rămase.

## 1. Identitatea și modul de lucru

Branch-ul individual folosit pentru laboratoare este `alexandru.anchidin`. Înaintea unei sesiuni, din rădăcina repository-ului:

```powershell
git status
git branch --show-current
git config user.name
git config user.email
git log -5 --format="%h %an <%ae> %s"
```

Autorul commitului vine din identitatea Git; contul autentificat este cel care publică prin push. Nu setați numele unui coleg pentru a simula contribuția lui. Pentru sincronizare, întâi salvați modificările proprii, apoi folosiți `git pull --no-rebase` pe branch-ul corect. Citiți `git diff` înainte de `git add` și creați commituri mici, cu mesajul schimbării concrete.

Pentru un proiect individual se păstrează branch-ul propriu. Pentru o echipă reală de maximum doi, un singur membru creează și publică branch-ul `proiect-nume1-nume2`; celălalt îl preia prin `git fetch` și `git switch`. Numele echipei și împărțirea sarcinilor se completează numai după stabilirea lor cu colegul. Planul de lucru este în [PLAN.md](PLAN.md).

## 2. Conflictul cerut de fișă

În fișa laboratorului, doi colegi modifică același titlu din `frontend/app/src/components/ReviewSection.jsx`, plecând de la același commit. Unul publică „Părerile clienților”; celălalt are local „Ce spun cumpărătorii”. Al doilea push este refuzat, iar `git pull --no-rebase` produce conflictul. Ambii decid textul final, elimină marcajele conflictului, apoi cel care rezolvă face:

```powershell
git add frontend/app/src/components/ReviewSection.jsx
git commit -m "Rezolva conflictul din titlul recenziilor"
git push
git log --oneline --graph -8
```

Celălalt coleg preia rezultatul. Chiar și pentru proiectul individual, fișa cere exercițiul cu un coleg de bancă pe un branch de test. Un exercițiu local cu un singur autor este pregătire tehnică, nu dovada colaborării în doi.

### Repetiție locală izolată, fără publicare

Următorii pași sunt o procedură de exersare, nu un istoric deja realizat. Porniți după ce `ReviewSection.jsx` există într-un commit pe branch-ul individual. Lucrați într-o clonă separată; nu provocați conflictul în copia în care prezentați aplicația.

Din rădăcina repository-ului:

```powershell
# Destinația trebuie să fie nouă. Dacă există, alegeți alt nume.
git clone --no-hardlinks --single-branch --branch alexandru.anchidin . ../lab11-conflict-demo
Set-Location ../lab11-conflict-demo
# Înlătură destinația de push doar din această copie de exercițiu.
git remote remove origin
git switch -c demo/recenzii-a
```

1. În editor, schimbați numai textul titlului în „Părerile clienților”, păstrând expresia care afișează numărul recenziilor.

```powershell
git add frontend/app/src/components/ReviewSection.jsx
git commit -m "Demo local: primul titlu al recenziilor"
git switch -c demo/recenzii-b alexandru.anchidin
```

2. Schimbați același rând în „Ce spun cumpărătorii”.

```powershell
git add frontend/app/src/components/ReviewSection.jsx
git commit -m "Demo local: al doilea titlu al recenziilor"
git merge --no-ff demo/recenzii-a
```

3. Citiți marcajele `<<<<<<<`, `=======`, `>>>>>>>`, alegeți titlul final și ștergeți marcajele. `HEAD` este varianta branch-ului curent; cealaltă este varianta adusă prin merge.

```powershell
git add frontend/app/src/components/ReviewSection.jsx
git commit -m "Demo local: rezolva conflictul din titlu"
git log --oneline --graph -8
git status
```

Nu rulați `git push` în această copie și nu atribuiți cele două variante unor persoane care nu le-au scris. Dacă abandonați exercițiul înaintea commitului de rezolvare, `git merge --abort` revine la starea de dinaintea îmbinării.

## 3. Depanarea backend-ului: simptom → cerere → jurnal

Condiții: laboratoarele despre recenzii funcționează, produsul ales are cel puțin o recenzie, iar jurnalul Symfony este configurat. Fără o recenzie, callback-ul care conține greșeala poate să nu fie executat. Folosiți o copie locală de exercițiu; nu publicați greșeala intenționată.

1. Deschideți pagina produsului și F12 → Network. Identificați cererea de recenzii și notați URL-ul și codul normal.
2. În `backend/app/src/Controller/ReviewController.php`, metoda de listare pentru produs (`byProduct` în fișă), schimbați temporar un apel `toArray()` în `toArrray()`.
3. Reîncărcați pagina. Notați mesajul vizibil, codul HTTP al cererii și textul real din Response. Nu presupuneți că toate implementările afișează exact textul „Eroare 500”.
4. Citiți jurnalul aplicației și corelați ora, clasa excepției, numele metodei și fișierul/rândul:

```powershell
docker exec daw-php tail -n 40 var/log/dev.log
docker compose -f backend/compose.yaml logs --tail 60 daw-php
```

5. Dacă `dev.log` nu există, verificați mai întâi configurarea jurnalizării. Ieșirea containerului poate ajuta diagnosticul, dar nu înlocuiți cu text inventat rândul din `dev.log` cerut de fișă. Symfony Profiler este opțional, numai dacă este instalat.
6. Restabiliți `toArray()`, reîncărcați și verificați răspunsul 200 și lista de recenzii. Confirmați prin `git diff` că greșeala nu a rămas în cod.

## 4. Eroarea de frontend cerută la exercițiul 2

Schimbați temporar, în `frontend/app/src/api.js`, numai URL-ul funcției care citește recenziile într-o rută inexistentă, păstrând serverul corect. Reîncărcați detaliile produsului și diagnosticați doar în DevTools: Console și Network → URL, metodă, Status, Response, Initiator. Notați codul efectiv observat; pentru o rută inexistentă pe un server funcțional se așteaptă 404, dar o problemă de conectare nu are același rezultat. Restabiliți URL-ul și verificați revenirea la 200.

## 5. Dovezi executate la 26 noiembrie 2026

- [Conflict local](dovezi/lab11-conflict-local.txt): două clone ale unui repository bare local, aceeași identitate reală. Al doilea push a fost refuzat; pull a produs conflictul; rezolvarea a creat merge-ul `211de0b`. Acesta este un exercițiu local, nu o colaborare cu un coleg.
- [Depanare](dovezi/depanare.json): `GET /api/products/9/reviews` cu greșeala temporară `toArrray()` a dat 500. `dev.log` a consemnat `Call to undefined method App\Entity\Review::toArrray()` în `ReviewController.php:62`. După restaurare: 200.
- În browser, URL-ul temporar `/api/products/9/reviews-inexistent` a dat 404 și mesajul „Resursa cerută nu există.”. URL-ul corect a fost restaurat și recenziile au reapărut. Codurile/mesajele sunt capturate în aceeași dovadă JSON.

## 6. Ce mai trebuie făcut cu un coleg

- [ ] Modul de lucru: individual / echipă confirmată; colegul și branch-ul, dacă există.
- [x] Repetiție locală etichetată corect; fișierul, titlul final și hash-ul merge-ului.
- [x] `git log --oneline --graph` și autorul real al repetiției, în dovada salvată.
- [ ] Conflictul cerut cu un coleg de bancă, pe branch de test.
- [ ] Pentru echipă, lista commiturilor branch-ului comun pe GitHub; `Insights → Contributors` pentru `main` nu demonstrează contribuția de pe alt branch.
- [x] Eroare backend: URL, status, fragmentul real din `dev.log`, explicație și verificare 200 după corectare.
- [x] Eroare frontend: URL greșit, status observat, cauza și verificare după corectare.
- [x] Nicio greșeală intenționată rămasă în fișierele pregătite pentru commit.

Surse ale cerințelor: îndrumarul „DAW — Laboratorul 11”, secțiunile 4–10, și metodologia disciplinei, secțiunea 9. Rezultatele de execuție sunt legate în secțiunea 5.
