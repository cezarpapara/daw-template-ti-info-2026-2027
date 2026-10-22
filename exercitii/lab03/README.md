# Laboratorul 03 — JavaScript, DOM, evenimente și fetch

Deschide `index.html` cu Live Server în VS Code sau cu serverul integrat din PhpStorm/WebStorm. Pagina este statică și nu are nevoie de Docker. Pentru datele reale de vreme ai nevoie de internet.

## Ce verifici și arăți

1. **Schimbă tema:** fundalul și culorile se modifică prin clasa `intunecat` de pe `body`.
2. **Previzualizare:** tastează în câmp; textul apare imediat lângă „Salut”. Se folosește `textContent`, deci textul introdus nu devine HTML.
3. **Validare:** trimite gol, doar spații sau `Al`: apare mesajul pentru minimum 3 caractere și câmpul primește focus. Trimite `Ana2`: apare mesajul pentru cifre. `  Ana  ` este valid; spațiile de la capete sunt eliminate. Numele cu diacritice, spații sau cratimă sunt acceptate, conform regulilor cerute.
4. **Succes:** cu `Ana`, titlul devine „Bine ai venit, Ana!”, formularul se golește, iar previzualizarea revine la `...`. Pagina nu se reîncarcă.
5. **Vreme:** apasă „Afișează vremea”. Vezi mesajul „Se încarcă…”, butonul dezactivat, apoi temperatura, vântul și ora în GMT pentru Bacău. Datele provin din API, nu sunt valori fixe.
6. **Temperatură:** sub 10 °C este „rece”, de la 10 la 25 inclusiv este „plăcut”, peste 25 este „cald”.
7. **Eroare:** în F12 → Network selectează „Offline”, apasă butonul meteo și verifică mesajul prietenos. Detaliile tehnice apar în Console, iar butonul devine din nou disponibil. Revino la „No throttling” după probă.
8. **Resetează:** titlul, formularul, mesajele și lista meteo revin la început. Tema aleasă rămâne aceeași. Dacă resetezi în timpul încărcării, cererea este anulată și nu repopulează ulterior lista.

Cererea are o limită de 15 secunde. O eroare HTTP, un răspuns invalid sau o conexiune blocată afișează același mesaj prietenos și permite reîncercarea.

## Partea care așteaptă pornirea backend-ului

Fișa mai cere pornirea backend-ului din template și rularea, în consola paginii `http://localhost:8080/api/doc`, a codului:

```js
fetch('/api/products').then(r => r.json()).then(console.log)
```

Acest apel verifică produsele din backend-ul cursului. Nu a fost înlocuit cu date simulate în pagina acestui laborator și nu se poate demonstra doar din această pagină statică. Îl faci după instalarea Docker și pornirea template-ului. Datele meteo din pagina laboratorului sunt cerute separat, de la Open-Meteo.

Repository-ul public al cursului este deja clonat în folderul `proiect` al pachetului, iar acest laborator este inclus în `proiect/exercitii/lab03/`. Lucrează în acea copie, pe branch-ul `alexandru.anchidin`; nu trebuie să clonezi din nou sau să copiezi fișierele încă o dată. Copia `exercitii/lab03/` din rădăcina pachetului servește previzualizării locale.

Containerele și backend-ul nu au fost pornite. Modificările se salvează în istoricul Git local; push-ul către repository-ul cursului se face după acordarea dreptului de scriere pe GitHub. Urmează `GHID.md` din rădăcina pachetului.
