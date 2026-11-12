-- Date de exemplu pentru proiect (categorii, produse, recenzii).
-- Rulați după migrări, în DBeaver: Execute SQL Script (Alt + X).
-- Atenție: golește tabelele înainte, ca scriptul să poată fi rulat de mai multe ori.
TRUNCATE review, product, category RESTART IDENTITY CASCADE;

INSERT INTO category (name) VALUES
  ('Electronice'),
  ('Cărți'),
  ('Îmbrăcăminte');

INSERT INTO product (name, description, price, category_id) VALUES
  ('Căști wireless', 'Căști Bluetooth cu anulare activă a zgomotului.', 299.50, 1),
  ('Tastatură mecanică', 'Tastatură cu switch-uri tactile și iluminare RGB.', 349.99, 1),
  ('Mouse ergonomic', 'Mouse vertical, 6 butoane, conexiune USB.', 129.00, 1),
  ('Învață PHP', 'Ghid practic de PHP modern, pentru începători.', 79.90, 2),
  ('React pe înțelesul tuturor', 'Componente, stare și efecte, cu exemple.', 89.00, 2),
  ('Tricou din bumbac', 'Tricou unisex, 100% bumbac organic.', 59.99, 3),
  ('Hanorac cu glugă', 'Hanorac călduros, cu buzunar frontal.', 149.00, 3);

INSERT INTO review (author, rating, comment, created_at, product_id) VALUES
  ('Andrei', 5, 'Sunet foarte bun și baterie care ține mult.', NOW() - INTERVAL '5 days', 1),
  ('Maria', 4, 'Comode, dar puțin cam mari.', NOW() - INTERVAL '3 days', 1),
  ('Ioana', 5, 'Cea mai bună tastatură pe care am avut-o.', NOW() - INTERVAL '2 days', 2),
  ('Vlad', 3, NULL, NOW() - INTERVAL '1 day', 3),
  ('Elena', 5, 'Explicații clare, exemple utile.', NOW() - INTERVAL '4 days', 4),
  ('Radu', 4, 'Bună pentru început.', NOW() - INTERVAL '6 hours', 5),
  ('Cristina', 2, 'Materialul s-a decolorat după câteva spălări.', NOW() - INTERVAL '2 hours', 6);
