<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migrare scrisa de mana: adauga cateva date de exemplu,
 * ca aplicatia sa nu fie goala la prima pornire.
 */
final class Version20261003120100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Date de exemplu: categorii si produse';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO category (name) VALUES ('Electronice'), ('Carti'), ('Sport')");

        $this->addSql("INSERT INTO product (name, description, price, category_id) VALUES
            ('Laptop', 'Laptop 15 inch, 16 GB RAM', 3499.99, (SELECT id FROM category WHERE name = 'Electronice')),
            ('Casti wireless', 'Casti Bluetooth cu anularea zgomotului', 299.50, (SELECT id FROM category WHERE name = 'Electronice')),
            ('Invata PHP', 'Carte pentru incepatori', 79.90, (SELECT id FROM category WHERE name = 'Carti')),
            ('Minge de fotbal', NULL, 120.00, (SELECT id FROM category WHERE name = 'Sport'))
        ");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM product WHERE name IN ('Laptop', 'Casti wireless', 'Invata PHP', 'Minge de fotbal')");
        $this->addSql("DELETE FROM category WHERE name IN ('Electronice', 'Carti', 'Sport')");
    }
}
