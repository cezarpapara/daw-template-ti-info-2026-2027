-- Laboratorul 07: tabela review
-- Se deschide in DBeaver (SQL Editor) si se ruleaza interogarile pe rand, cu Ctrl + Enter.
-- Conexiune: localhost:5433 (in acest proiect portul este 5433, vezi backend/compose.yaml),
-- baza daw, utilizator daw, parola daw.

-- 1. Produsele existente (id-ul este folosit in product_id)
SELECT id, name FROM product ORDER BY id;

-- 2. Doua recenzii pentru produsul 1 (sectiunea 6)
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Ana Popescu', 5, 'Foarte mulțumită, recomand.', NOW(), 1),
       ('Mihai Ionescu', 3, NULL, NOW(), 1);

-- 3. Exercitiul 1: inca patru recenzii, pentru produse diferite, cu note diferite
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Elena Rusu', 4, 'Sunet bun, bateria ține mult.', NOW(), 2),
       ('Andrei Ciobanu', 2, 'Se deconectează des de la telefon.', NOW(), 2),
       ('Maria Lungu', 5, 'Explicații clare, ideală pentru începători.', NOW(), 3),
       ('Ion Rotaru', 1, NULL, NOW(), 1);

-- 4. Recenziile, fiecare cu numele produsului (JOIN)
SELECT r.id, r.author, r.rating, r.comment, p.name AS produs
FROM review r
JOIN product p ON p.id = r.product_id
ORDER BY r.id;

-- 5. Exercitiul 2: numarul de recenzii si nota medie pentru fiecare produs
-- LEFT JOIN pastreaza si produsele fara nicio recenzie (numar 0, medie NULL).
-- Cu JOIN simplu, un produs fara recenzii nu are pereche in review si ar disparea din rezultat.
SELECT p.id, p.name,
       COUNT(r.id) AS numar_recenzii,
       ROUND(AVG(r.rating), 2) AS nota_medie
FROM product p
LEFT JOIN review r ON r.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.id;

-- 6. Exercitiul 3 (optional): recenzie pentru un produs inexistent => EROARE (intentionat)
-- Mesajul vine de la constrangerea FOREIGN KEY (FK_794381C64584665A) din PostgreSQL:
-- nu exista niciun rand in product cu id = 9999, deci insertul este respins.
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Test', 5, NULL, NOW(), 9999);
