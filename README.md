# Magazinul meu - Proiect PW/DAW 2026-2027

Aplicație web demonstrativă tip magazin online, incluzând gestionarea produselor, a categoriilor și un sistem de recenzii.

## Tehnologii
Symfony 8 (PHP 8.5), PostgreSQL 18, Doctrine ORM, React 19 + Vite, Docker Compose.

## Rulare
1. `git clone https://github.com/UTILIZATORUL_TAU/daw-template-ti-info-2026-2027.git`
2. `git checkout ramura-ta`
3. `docker compose -f backend/compose.yaml up -d --build`
4. `docker compose -f frontend/compose.yaml up -d --build`
5. `docker exec -it daw-php composer install`
6. `docker exec -it daw-php php bin/console doctrine:migrations:migrate`
7. Datele de exemplu: `backend/app/sql/date-exemplu.sql` (rulate în DBeaver)
8. Interfața: http://localhost:5173 | API: http://localhost:8080/api/doc

## Performanță (Lighthouse)
- **Scoruri inițiale:** Performance: 35, Accessibility: 100, Best Practices: 100, SEO: 82.
- **Îmbunătățiri:** Scorul SEO a crescut la maxim (100) după adăugarea tag-urilor meta și title.