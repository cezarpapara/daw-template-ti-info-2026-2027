# Template de proiect – Programare Web / Dezvoltarea Aplicațiilor Web

Proiect de pornire pentru laboratorul disciplinelor **Programare Web** (Tehnologia Informației, anul IV) și **Dezvoltarea Aplicațiilor Web** (Informatică, anul II, învățământ cu frecvență), Universitatea „Vasile Alecsandri” din Bacău, anul universitar 2026–2027.

Titular: Ș.l. dr. ing. Eusebiu Pruteanu · Laborator: Asist. univ. drd. asoc. Cezar-Marian Papară

Proiectul este format din două aplicații separate, care comunică prin API:

- **backend** – PHP Symfony, cu bază de date PostgreSQL;
- **frontend** – React.

Totul rulează în containere Docker; nu este nevoie să instalați PHP, Node.js sau PostgreSQL pe calculator.

## Pornire rapidă

```bash
git clone https://github.com/cezarpapara/daw-template-ti-info-2026-2027.git
cd daw-template-ti-info-2026-2027
git checkout -b nume.prenume
git push -u origin nume.prenume
```

Pașii pentru prima pornire a containerelor, modul de lucru cu Git și structura proiectului sunt descriși în documentul **Metodologie de lucru și template de proiect** și în îndrumarele de laborator, disponibile pe platforma disciplinei ([examene.pe.ub.ro](http://examene.pe.ub.ro/)) și pe grupul Microsoft Teams al disciplinei.

## Securitate

Aplicatia are autentificare (JWT in cookie `httpOnly`), roluri (`ROLE_USER` / `ROLE_ADMIN`), verificarea proprietarului
pentru produse, validarea datelor, limitarea incercarilor de login si headere HTTP de securitate.
Detalii, pasii de configurare dupa clonare (secrete, chei JWT, cont de admin) si cum se verifica fiecare masura:
[SECURITY.md](SECURITY.md).
