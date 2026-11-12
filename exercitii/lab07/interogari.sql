-- ==========================================================================
--  Laboratorul 07 – interogările rulate în DBeaver (SQL Editor, Ctrl + Enter)
--  Conexiune: host localhost, port 5432, baza daw, utilizator daw, parolă daw
-- ==========================================================================

-- Pasul 3: produsele și id-urile lor
SELECT id, name FROM product;

-- Pasul 4: două recenzii pentru un produs (aici Laptop, id 1 pe o bază nouă)
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Ana Popescu', 5, 'Foarte mulțumită, recomand.', NOW(), 1),
       ('Mihai Ionescu', 3, NULL, NOW(), 1);

-- Citirea lor: JOIN aduce lângă fiecare recenzie numele produsului
SELECT r.id, r.author, r.rating, r.comment, p.name AS produs
FROM review r
JOIN product p ON p.id = r.product_id
ORDER BY r.id;


-- ==========================================================================
--  Exercițiul 1: încă patru recenzii, pentru cel puțin două produse diferite,
--  cu note diferite. Id-ul produsului se ia după nume, ca să nu depindă de
--  ordinea în care au fost create produsele.
-- ==========================================================================
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Elena Rusu', 4, 'Sunet bun, bateria ține mult.', NOW(),
        (SELECT id FROM product WHERE name = 'Casti wireless')),
       ('Andrei Matei', 2, 'Se deconectează des.', NOW(),
        (SELECT id FROM product WHERE name = 'Casti wireless')),
       ('Ioana Stan', 5, 'Explicații clare, exemple bune.', NOW(),
        (SELECT id FROM product WHERE name = 'Invata PHP')),
       ('Radu Pavel', 1, NULL, NOW(),
        (SELECT id FROM product WHERE name = 'Laptop'));


-- ==========================================================================
--  Exercițiul 2: pentru fiecare produs, numărul de recenzii și nota medie
-- ==========================================================================
SELECT p.id,
       p.name,
       COUNT(r.id)              AS nr_recenzii,
       ROUND(AVG(r.rating), 2)  AS nota_medie
FROM product p
LEFT JOIN review r ON r.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.id;

-- De ce LEFT JOIN și nu JOIN?
-- JOIN (INNER JOIN) păstrează doar rândurile care au pereche în ambele tabele,
-- deci produsele fără nicio recenzie (de ex. „Minge de fotbal”) ar dispărea din
-- rezultat. LEFT JOIN păstrează toate rândurile din tabela din stânga (product);
-- unde nu există recenzii, coloanele din review sunt NULL. De aceea folosim
-- COUNT(r.id), care nu numără valorile NULL și dă 0, nu COUNT(*), care ar da 1.
-- AVG pe un grup fără note întoarce NULL (nu există medie).


-- ==========================================================================
--  Exercițiul 3 (opțional): recenzie pentru un produs inexistent
-- ==========================================================================
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Test', 3, NULL, NOW(), 9999);

-- Mesajul primit (PostgreSQL):
--   ERROR: insert or update on table "review" violates foreign key constraint
--          "fk_794381c64584665a"
--   Detail: Key (product_id)=(9999) is not present in table "product".
-- L-a produs constrângerea FOREIGN KEY (cheia străină) creată de migrare:
-- baza de date verifică singură că product_id indică un rând existent din
-- product și refuză inserarea. Aplicația PHP nici nu a fost implicată.
