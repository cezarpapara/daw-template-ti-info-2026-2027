# Verificarea cerințelor — laboratoarele 01–12

Data: 26.11.2026. Verificarea urmărește cerințele obligatorii și exercițiile din fișele laboratoarelor. Tema finală este amânată și nu face parte din această etapă.

## Implementare

| Lab. | Cerințe verificate în cod | Rezultat |
| --- | --- | --- |
| 01 | Branch individual, nume pe Acasă, Symfony/React/PostgreSQL funcționale | Implementate. |
| 02 | HTML semantic, Flexbox/Grid, adaptare la ecran, paletă și contrast | Implementate în `exercitii/lab02`; ghid de demonstrație în README-ul laboratorului. |
| 03 | DOM, temă, formular, validarea numelui, fetch meteo, reset și tratarea erorilor | Implementate. Fetch către `/api/products` a fost verificat și în browser pe originea Swagger. |
| 04 | JSX, componente, props, listă de carduri și chei | Implementate în pagina Despre și componentele reutilizabile. |
| 05 | Stare, evenimente, contor, formular controlat și căutare locală | Implementate; formularul Contact simulează trimiterea conform fișei. |
| 06 | Salut, dată/oră, numere pare, sumă, parametri validați, probe de eroare | Implementate. Proba `formatt()` a produs 500 și jurnal, apoi `/api/time` a revenit la 200. |
| 07 | Review, relație cu Product, migrare, minimum șase recenzii pe două produse, JOIN/LEFT JOIN | Implementate; SQL executat, legături și CASCADE verificate; schema curentă validată cu Doctrine. |
| 08 | CRUD JSON, statusuri corecte, recenzii pe produs, media notelor | Implementate și testate; cererile Postman sunt salvate. PATCH este opțional. |
| 09 | GET/POST/DELETE din React, stele, număr/medie, încărcare/erori, succes temporar | Implementate și testate; este disponibilă și editarea prin PUT. |
| 10 | Symfony Validator, erori lângă câmpuri, `aria-invalid`, XSS ca text, hashing, `.env.local` ignorat | Implementate și testate. Exemplul de hashing este arhivat, iar ruta este scoasă din aplicația pregătită pentru lab. 12. |
| 11 | Plan, jurnal, depanare backend/frontend, exercițiu Git | Plan și depanare realizate. Conflictul a fost exersat local; proba cu un coleg rămâne de făcut. |
| 12 | Minimum trei îmbunătățiri, Lighthouse înainte/după, SQL, build, README și capturi | Implementate. Pornirea pe calculatorul unui coleg rămâne de făcut. |

Nu au fost identificate exerciții obligatorii de programare lipsă. Cererile și interogările sunt pregătite pentru demonstrație în Swagger/Postman/DBeaver; testele automate nu înlocuiesc prezentarea lor la laborator.

## Corecții în urma reverificării

- Autorii, numele produselor și categoriilor fără spații nu mai depășesc pagina pe mobil. Probele la 375 px folosesc limitele de 100/150 de caractere și comentarii lungi: [rezultate](dovezi/mobil-texte-lungi.json).
- Pagina Categorii afișează separat încărcarea, eroarea și lista goală.
- Caracterul NUL este respins în autor/comentariu, inclusiv la început și sfârșit. Un PUT invalid nu schimbă recenzia existentă.
- Colecția Postman include și `n=0`, `n=abc` și un POST cu trei erori de validare simultane.

## Dovezi

- [Teste HTTP](dovezi/api-reverificare.txt): 65 verificări trecute; datele temporare au fost eliminate.
- [Browser CRUD și validare](dovezi/browser.json), [mobil și texte lungi](dovezi/mobil-texte-lungi.json).
- [Depanare lab. 06 și fetch lab. 03](dovezi/lab06-depanare.json), [depanare lab. 11](dovezi/depanare.json).
- [Schema Doctrine și build în container](dovezi/docker-student.txt), [build local după corecții](dovezi/build-reverificare.txt).
- [Date, SQL și relații](dovezi/baza-date.json), [rapoarte Lighthouse](lighthouse/), [contrast WebAIM](dovezi/contrast.json).

## Activități rămase pentru laborator

1. **Lab. 11:** exercițiul de conflict cu un coleg real, pe un branch de test. Simularea locală nu îndeplinește partea de colaborare cerută.
2. **Lab. 12:** un coleg din altă echipă clonează și pornește aplicația pe calculatorul lui folosind README-ul. Proba include `doctrine:migrations:migrate` pe baza goală și `doctrine:schema:validate`. Au fost verificate separat SQL-ul pe o bază temporară goală și schema bazei curente, nu acest flux pe un al doilea calculator.
3. Publicarea commiturilor noi prin `git push origin alexandru.anchidin` și verificarea lor pe GitHub.
4. Demonstrația cerută în instrumentele laboratorului: rute și statusuri în Swagger/Postman, interogări în DBeaver și `docker exec daw-php php bin/console debug:router` în terminal. Pașii sunt în [ghidul de prezentare](PREZENTARE-06-12.md).

Factorial, PATCH, filtrul „spam”, Lighthouse Mobile și înregistrarea video sunt opționale. Nu sunt tratate ca lipsuri obligatorii.
