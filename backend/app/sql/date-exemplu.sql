-- Date demonstrative pentru categoria, produs și recenzie.
-- Rulați scriptul într-o bază în care migrațiile au fost deja aplicate.

INSERT INTO category (name)
VALUES ('Electronice'), ('Cărți'), ('Sport')
ON CONFLICT DO NOTHING;

INSERT INTO product (name, description, price, category_id)
SELECT 'Laptop', 'Laptop 15 inch, 16 GB RAM', 3499.99, id
FROM category WHERE name = 'Electronice'
ON CONFLICT DO NOTHING;

INSERT INTO product (name, description, price, category_id)
SELECT 'Căști wireless', 'Căști Bluetooth cu anularea zgomotului', 299.50, id
FROM category WHERE name = 'Electronice'
ON CONFLICT DO NOTHING;

INSERT INTO product (name, description, price, category_id)
SELECT 'Învață PHP', 'Carte pentru începători', 79.90, id
FROM category WHERE name = 'Cărți'
ON CONFLICT DO NOTHING;

INSERT INTO product (name, description, price, category_id)
SELECT 'Minge de fotbal', 'Minge de fotbal pentru antrenament', 120.00, id
FROM category WHERE name = 'Sport'
ON CONFLICT DO NOTHING;
