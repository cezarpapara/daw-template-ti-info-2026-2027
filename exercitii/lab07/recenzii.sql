-- Laboratorul 07: date de test si interogari pentru tabela review
-- Se ruleaza in DBeaver (SQL Editor -> New SQL script), cu Ctrl + Enter pe fiecare interogare,
-- sau din terminal: docker exec -i daw-postgres psql -U daw -d daw < exercitii/lab07/recenzii.sql
--
-- Id-urile produselor difera de la o baza de date la alta, asa ca nu le scriem de mana:
-- (SELECT id FROM product WHERE name = '...') gaseste id-ul dupa numele produsului.

-- 0. Produsele existente (notati id-urile)
SELECT id, name FROM product ORDER BY id;

-- 1. Doua recenzii pentru acelasi produs (sectiunea 6, pasul 4)
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Ana Popescu', 5, 'Foarte multumita, recomand.', NOW(), (SELECT id FROM product WHERE name = 'Laptop')),
       ('Mihai Ionescu', 3, NULL, NOW(), (SELECT id FROM product WHERE name = 'Laptop'));

-- 2. Recenziile, cu numele produsului alaturi: JOIN leaga fiecare recenzie de produsul ei
SELECT r.id, r.author, r.rating, r.comment, p.name AS produs
FROM review r
JOIN product p ON p.id = r.product_id
ORDER BY r.id;

-- Exercitiul 1: inca patru recenzii, pentru cel putin doua produse diferite, cu note diferite
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Elena Rusu', 4, 'Suna bine, bateria tine o zi.', NOW(), (SELECT id FROM product WHERE name = 'Casti wireless')),
       ('Andrei Matei', 2, 'Se deconecteaza des.', NOW(), (SELECT id FROM product WHERE name = 'Casti wireless')),
       ('Ioana Stan', 5, 'Explicatii clare pentru incepatori.', NOW(), (SELECT id FROM product WHERE name = 'Invata PHP')),
       ('Radu Dima', 1, NULL, NOW(), (SELECT id FROM product WHERE name = 'Laptop'));

-- Exercitiul 2: pentru fiecare produs, numarul de recenzii si nota medie.
-- De ce LEFT JOIN si nu JOIN: JOIN pastreaza doar produsele care au cel putin o recenzie;
-- LEFT JOIN pastreaza toate produsele, iar cele fara recenzii apar cu 0 recenzii si media NULL.
-- COUNT(r.id) numara doar valorile nenule, deci da 0 (nu 1) pentru un produs fara recenzii.
SELECT p.id, p.name, COUNT(r.id) AS numar_recenzii, ROUND(AVG(r.rating), 2) AS nota_medie
FROM product p
LEFT JOIN review r ON r.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.id;

-- Exercitiul 3 (optional): o recenzie pentru un produs inexistent.
-- Raspuns: PostgreSQL refuza INSERT-ul cu
--   ERROR: insert or update on table "review" violates foreign key constraint "fk_794381c64584665a"
--   DETAIL: Key (product_id)=(9999) is not present in table "product".
-- Mesajul vine de la constrangerea FOREIGN KEY creata de migrare: baza de date verifica singura
-- ca product_id sa existe in tabela product, chiar daca aplicatia PHP nu ar verifica.
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Test', 3, 'Produs inexistent', NOW(), 9999);
