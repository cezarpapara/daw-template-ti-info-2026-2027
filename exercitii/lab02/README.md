# Laboratorul 02 — HTML5 și CSS3

Deschide `index.html` cu Live Server în VS Code sau cu serverul integrat din PhpStorm/WebStorm. Merge și cu dublu-click, fără reîncărcare automată. Nu ai nevoie de Docker pentru această pagină.

## Ce arăți la laborator

1. În F12 → modul telefon/tabletă, verifică pagina la 375px, 768px și 1200px: cardurile au una, două și trei coloane. De la 900px, „Despre noi” este în dreapta, iar newsletter-ul ocupă toată lățimea.
2. Arată în HTML elementele `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` și legătura dintre `label for="email"` și `input id="email"`.
3. Apasă Tab pentru a parcurge legăturile și câmpurile. Trimite formularul gol, apoi cu o adresă invalidă: browserul îl respinge datorită `required` și `type="email"`.
4. Arată cele șase carduri (două din exemplu, patru adăugate), paleta din `:root` și cele două paragrafe ale subsolului. Sub 600px, paragrafele sunt unul sub altul; de la 600px, sunt alăturate prin Flexbox.

## Paleta și contrastul

Paleta exemplului a fost schimbată în verde închis și cărămiziu numai prin variabilele din `:root`. Raporturile calculate pentru text alb sunt:

| Fundal | Raport cu `#ffffff` |
| --- | --- |
| Principal `#164e3e` | 9,57:1 |
| Buton `#9a3412` | 7,31:1 |
| Buton la hover/focus `#7c2d12` | 9,37:1 |

Poți reproduce verificarea cerută în fișă în [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/), introducând albul și fiecare culoare de fundal. Valorile de mai sus sunt calculate local, nu reprezintă o verificare efectuată în site.

## Comportament intenționat

Acesta este un exercițiu de structură și stil: butoanele „Adaugă în coș” nu modifică un coș. Formularul verifică adresa în browser; cu o adresă validă reîncarcă pagina locală, fără înregistrarea unei abonări. Nu există serviciu de newsletter sau bază de date. Cărțile și prețurile sunt date demonstrative.
