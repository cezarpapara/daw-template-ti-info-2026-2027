# Securitatea aplicatiei

Acest document descrie amenintarile luate in calcul, cum se apara aplicatia impotriva lor,
unde se afla codul fiecarei masuri si cum poate fi verificata.

## Pe scurt

| Amenintare | Masura | Unde in cod |
|---|---|---|
| Acces fara cont la operatiile de modificare | Autentificare JWT; orice `POST`/`PUT`/`DELETE` pe `/api` cere un utilizator autentificat | `config/packages/security.yaml` |
| Escaladarea drepturilor (un utilizator obisnuit face actiuni de admin) | Roluri `ROLE_USER` / `ROLE_ADMIN`; `#[IsGranted('ROLE_ADMIN')]`; rolul nu se poate trimite la inregistrare | `CategoryController`, `AuthController::register` |
| IDOR (modificarea/stergerea produselor altcuiva schimband id-ul din URL) | Fiecare produs are un proprietar; `ProductVoter` permite modificarea doar proprietarului sau unui admin | `src/Security/ProductVoter.php`, `ProductController` |
| Parole furate din baza de date | Parolele se salveaza doar ca hash (bcrypt/argon2id, algoritmul `auto`), cu rehash automat | `security.yaml`, `UserRepository::upgradePassword` |
| Parole slabe | Minim 8 caractere + `PasswordStrength` (complexitate medie); max 4096 caractere (anti-DoS la hash) | `src/Dto/RegisterInput.php` |
| Ghicirea parolei (brute force) | `login_throttling`: max 5 incercari gresite / 15 minute pentru acelasi email + IP, apoi `429` | `security.yaml` |
| Crearea in masa de conturi | Rate limiter: max 5 conturi / ora / IP | `config/packages/rate_limiter.yaml`, `AuthController::register` |
| Aflarea email-urilor existente (user enumeration) la login | Acelasi mesaj, „Email sau parola gresita”, pentru email inexistent si pentru parola gresita | `src/EventSubscriber/JwtLoginSubscriber.php` |
| Furtul token-ului prin XSS | Token-ul JWT este doar intr-un cookie `httpOnly` (nu e accesibil din JavaScript, nu e in `localStorage`, nu e in corpul raspunsului) | `lexik_jwt_authentication.yaml`, `frontend/app/src/AuthContext.jsx` |
| CSRF (alt site trimite cereri cu cookie-ul utilizatorului) | Cookie `SameSite=Strict`; CORS permite doar originea frontend-ului; API-ul accepta doar `Content-Type: application/json` (altfel `415`) | `lexik_jwt_authentication.yaml`, `nelmio_cors.yaml`, `#[MapRequestPayload]` |
| Token modificat / falsificat / expirat | Token semnat RS256 cu cheie privata; expira dupa 1 ora; token invalid → `401` si cookie-ul este sters | `lexik_jwt_authentication.yaml`, `JwtLoginSubscriber` |
| SQL injection | Doar Doctrine ORM / QueryBuilder cu parametri; id-urile din rute sunt validate cu `\d+` | `src/Repository/`, controllerele |
| XSS | React escapeaza automat textul afisat; nu se foloseste `dangerouslySetInnerHTML`; API-ul trimite `Content-Security-Policy: default-src 'none'` | frontend, `SecurityHeadersSubscriber` |
| Date invalide sau prea mari | Validare cu Symfony Validator pe DTO-uri (lungimi maxime, tipuri, intervale) → `422` cu mesaj pe fiecare camp | `src/Dto/` |
| Scurgerea de informatii tehnice | Erorile `/api` au format unic `{"error": "..."}`; detaliile (SQL, cai, stack trace) apar doar in modul dev; `/api/health` nu mai afiseaza eroarea bazei de date; versiunile Nginx/PHP sunt ascunse | `ApiExceptionSubscriber`, `HealthController`, `php.ini`, `nginx/default.conf` |
| Clickjacking, MIME sniffing | `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` | `SecurityHeadersSubscriber` |
| Date personale in cache | `Cache-Control: no-store` pe `/api/auth/*` | `SecurityHeadersSubscriber` |
| Secrete in Git | Cheile JWT (`config/jwt/*.pem`), `JWT_PASSPHRASE` si `APP_SECRET` reale sunt doar in fisiere ignorate de Git (`.env.local`) | `backend/app/.gitignore`, `.env` |
| Expunerea serviciilor in retea | Porturile Docker sunt legate doar de `127.0.0.1` (baza de date nu e accesibila din reteaua locala) | `backend/compose.yaml`, `frontend/compose.yaml` |
| Cont de admin cu parola cunoscuta | Nu exista cont implicit; admin-ul se creeaza din consola, cu parola citita ascuns | `src/Command/CreateAdminCommand.php` |

## Drepturi de acces

| Endpoint | Anonim | `ROLE_USER` | `ROLE_ADMIN` |
|---|---|---|---|
| `GET /api/health`, `GET /api/categories`, `GET /api/products[/{id}]` | da | da | da |
| `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` | da | da | da |
| `GET /api/auth/me` | nu (`401`) | da | da |
| `POST /api/products` | nu (`401`) | da (devine proprietar) | da |
| `PUT` / `DELETE /api/products/{id}` | nu (`401`) | doar produsele proprii (`403` altfel) | toate |
| `POST /api/categories` | nu (`401`) | nu (`403`) | da |

Interfata React ascunde butoanele pe care utilizatorul nu are voie sa le foloseasca, dar **aceasta nu este
o masura de securitate**: toate regulile sunt verificate in backend, unde nu pot fi ocolite.

## Configurare (prima pornire dupa clonare)

```bash
# 1. secretele locale (NU se urca pe GitHub)
docker exec daw-php sh -c 'printf "APP_SECRET=%s\nJWT_PASSPHRASE=%s\n" $(php -r "echo bin2hex(random_bytes(32));") $(php -r "echo bin2hex(random_bytes(32));") > .env.local'

# 2. cheile pentru semnarea token-urilor JWT
docker exec daw-php php bin/console lexik:jwt:generate-keypair

# 3. tabelele (inclusiv app_user)
docker exec daw-php php bin/console doctrine:migrations:migrate -n

# 4. un administrator (parola se cere ascuns, minim 12 caractere)
docker exec -it daw-php php bin/console app:create-admin admin@exemplu.ro
```

## Cum se verifica

```bash
# fara autentificare -> 401
curl -i -X POST http://localhost:8080/api/products -H 'Content-Type: application/json' -d '{"name":"x","price":1,"categoryId":1}'

# rolul trimis la inregistrare este ignorat -> "roles":["ROLE_USER"]
curl -X POST http://localhost:8080/api/auth/register -H 'Content-Type: application/json' -d '{"email":"test@exemplu.ro","password":"Parola-Sigura-2026!","roles":["ROLE_ADMIN"]}'

# login -> token-ul vine doar in cookie (Set-Cookie: BEARER=...; httponly; samesite=strict)
curl -i -c cookies.txt -X POST http://localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{"email":"test@exemplu.ro","password":"Parola-Sigura-2026!"}'

# stergerea unui produs care nu este al vostru -> 403
curl -i -b cookies.txt -X DELETE http://localhost:8080/api/products/1

# a 6-a parola gresita la rand -> 429
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{"email":"test@exemplu.ro","password":"gresit"}'; done
```

In browser (DevTools → Console), dupa login: `document.cookie` este gol si `localStorage` nu contine niciun token.

## Ce mai trebuie facut pentru productie

Proiectul ruleaza in modul **dev**. Inainte de a fi pus pe un server public:

- `APP_ENV=prod` si `display_errors = Off` in `php.ini`;
- HTTPS obligatoriu, `JWT_COOKIE_SECURE=1` si headerul `Strict-Transport-Security`;
- `CORS_ALLOW_ORIGIN` = adresa reala a frontend-ului;
- alta parola pentru PostgreSQL (nu `daw`/`daw`) si portul `5432` nepublicat deloc;
- frontend-ul servit ca fisiere statice (`npm run build`), nu cu serverul de dezvoltare Vite, plus un
  `Content-Security-Policy` pentru pagina React;
- PHP-FPM rulat cu un utilizator fara drepturi (`www-data`), nu `root` (vezi `backend/docker/php/Dockerfile`);
- documentatia Swagger (`/api/doc`) dezactivata sau protejata;
- `composer audit` si `npm audit` rulate periodic pentru dependinte cu vulnerabilitati cunoscute.
