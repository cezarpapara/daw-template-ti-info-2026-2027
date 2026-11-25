INSERT INTO category (name)
SELECT 'Electronice'
WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = 'Electronice');

INSERT INTO category (name)
SELECT 'Cărți'
WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = 'Cărți');

INSERT INTO product (name, description, price, category_id)
SELECT 'Mouse wireless', 'Mouse optic wireless pentru birou', '59.90', id
FROM category
WHERE name = 'Electronice'
AND NOT EXISTS (
    SELECT 1 FROM product
    WHERE name = 'Mouse wireless'
);

INSERT INTO product (name, description, price, category_id)
SELECT 'Tastatură mecanică', 'Tastatură mecanică compactă', '249.90', id
FROM category
WHERE name = 'Electronice'
AND NOT EXISTS (
    SELECT 1 FROM product
    WHERE name = 'Tastatură mecanică'
);

INSERT INTO product (name, description, price, category_id)
SELECT 'Introducere în PHP', 'Carte demonstrativă pentru PHP și Symfony', '89.90', id
FROM category
WHERE name = 'Cărți'
AND NOT EXISTS (
    SELECT 1 FROM product
    WHERE name = 'Introducere în PHP'
);

INSERT INTO review (author, rating, comment, created_at, product_id)
SELECT 'Ana Popescu', 5, 'Foarte bună, recomand.', NOW(), p.id
FROM product p
WHERE p.name = 'Mouse wireless'
AND NOT EXISTS (
    SELECT 1 FROM review
    WHERE author = 'Ana Popescu'
      AND comment = 'Foarte bună, recomand.'
);

INSERT INTO review (author, rating, comment, created_at, product_id)
SELECT 'Mihai Ionescu', 4, NULL, NOW(), p.id
FROM product p
WHERE p.name = 'Mouse wireless'
AND NOT EXISTS (
    SELECT 1 FROM review
    WHERE author = 'Mihai Ionescu'
);

INSERT INTO review (author, rating, comment, created_at, product_id)
SELECT 'Elena Radu', 5, 'Livrare rapidă și produs exact.', NOW(), p.id
FROM product p
WHERE p.name = 'Tastatură mecanică'
AND NOT EXISTS (
    SELECT 1 FROM review
    WHERE author = 'Elena Radu'
);
