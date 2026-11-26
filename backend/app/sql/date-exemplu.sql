-- Laboratoarele 07 si 12. Rulare DUPA migrari, in baza daw.
-- Se poate executa de mai multe ori: nu sterge si nu suprascrie date existente.
BEGIN;

INSERT INTO category (name)
SELECT 'Demonstratii DAW'
WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = 'Demonstratii DAW');

INSERT INTO product (name, description, price, category_id)
SELECT seed.name, seed.description, seed.price,
       (SELECT MIN(id) FROM category WHERE name = 'Demonstratii DAW')
FROM (VALUES
    ('DAW Demo - Caiet', 'Caiet pentru notitele de laborator.', 19.90),
    ('DAW Demo - Agenda', 'Agenda pentru planificarea proiectului.', 39.90)
) AS seed(name, description, price)
WHERE NOT EXISTS (SELECT 1 FROM product p WHERE p.name = seed.name);

INSERT INTO review (author, rating, comment, created_at, product_id)
SELECT seed.author, seed.rating, seed.comment, NOW(), p.id
FROM (VALUES
    ('DAW Demo - Caiet', 'Ana Demo', 5, 'Hartie buna, usor de folosit.'),
    ('DAW Demo - Caiet', 'Mihai Demo', 3, 'Util, as prefera mai multe pagini.'),
    ('DAW Demo - Caiet', 'Ioana Demo', 4, 'Potrivit pentru laborator.'),
    ('DAW Demo - Agenda', 'Andrei Demo', 5, 'Ma ajuta sa planific sarcinile.'),
    ('DAW Demo - Agenda', 'Elena Demo', 4, 'Format practic si clar.'),
    ('DAW Demo - Agenda', 'Radu Demo', 2, NULL::text)
) AS seed(product_name, author, rating, comment)
JOIN product p ON p.id = (SELECT MIN(p2.id) FROM product p2 WHERE p2.name = seed.product_name)
WHERE NOT EXISTS (
    SELECT 1 FROM review r WHERE r.product_id = p.id AND r.author = seed.author
);

COMMIT;

-- JOIN: fiecare recenzie impreuna cu produsul ei.
SELECT r.id, r.author, r.rating, r.comment, p.name AS produs
FROM review r JOIN product p ON p.id = r.product_id
ORDER BY p.id, r.id;

-- LEFT JOIN pastreaza inclusiv produsele fara recenzii: count=0, average=NULL.
SELECT p.id, p.name, COUNT(r.id) AS numar_recenzii,
       ROUND(AVG(r.rating), 2) AS nota_medie
FROM product p LEFT JOIN review r ON r.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.id;
