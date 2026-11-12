<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261112184500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adauga stergerea in cascada a recenziilor la stergerea produsului';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C64584665A');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C64584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C64584665A');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C64584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE');
    }
}
