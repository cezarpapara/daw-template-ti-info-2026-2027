# Magazin PW / DAW – proiect 2026–2027

Aplicație web demonstrativă pentru gestionarea produselor, categorii și recenziilor. Aplicația permite vizualizarea și administrarea unui catalog, adăugarea și editarea recenziilor, căutarea produselor și verificarea stării backend-ului.

## Tehnologii

- Symfony 8 și PHP 8.5
- PostgreSQL 18 și Doctrine ORM
- React 19 și Vite
- Docker Compose
- Symfony Validator

## Rulare

1. Clonați repository-ul:
   ```bash
   git clone https://github.com/cezarpapara/daw-template-ti-info-2026-2027.git
   cd daw-template-ti-info-2026-2027
   git checkout tufa-rares
   ```
2. Porniți serviciile:
   ```bash
   docker compose -f backend/compose.yaml up -d --build
   docker compose -f frontend/compose.yaml up -d --build
   ```
3. Instalați dependențele și aplicați migrarea:
   ```bash
   docker exec -it daw-php composer install
   docker exec -it daw-php php bin/console doctrine:migrations:migrate --no-interaction
   ```
4. Deschideți interfața la http://localhost:5173, API-ul la http://localhost:8080 și Swagger la http://localhost:8080/api/doc.

Datele de exemplu sunt disponibile în `backend/app/sql/date-exemplu.sql` și migrarea Symfony din `backend/app/migrations/`.

## Verificări

```bash
docker exec -it daw-php php bin/console doctrine:schema:validate
docker exec -it daw-react npm run build
```

Folderul `frontend/app/dist` este rezultatul versiunea de producție și nu se păstrează în Git.

## Îmbunătățiri Lighthouse

- Titluri distincte și descriere meta pentru pagini și SEO.
- Etichete asociate câmpurilor din formulare și valori `aria-invalid` pentru erori.
- Imaginea cardului „Echipa” are dimensiuni explicite, text alternativ și încărcare `lazy`.
- Datele de contact nu se mai afișează în consolă.

Raportele Lighthouse HTML se păstrează în `docs/capturi/` după auditul din Chrome.

## Capturi de ecran

Capturile aplicației se adaugă în `docs/capturi/`.

## Contribuția

- Tufa Rares-Mihaita: backend Symfony, Doctrine, React, validare, autentificare Git și pregătirea aplicației pentru laboratorul final.
