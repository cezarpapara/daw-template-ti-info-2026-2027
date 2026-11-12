<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migrare generata cu: php bin/console doctrine:migrations:diff (laboratorul 08)
 * Adauga coloana review.owner_id: utilizatorul care a scris recenzia, singurul (alaturi de admin)
 * care o poate modifica sau sterge. ON DELETE SET NULL: recenzia ramane daca se sterge contul.
 */
final class Version20261112153829 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adauga proprietarul recenziei (review.owner_id)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE review ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C67E3C61F9 FOREIGN KEY (owner_id) REFERENCES app_user (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_794381C67E3C61F9 ON review (owner_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C67E3C61F9');
        $this->addSql('DROP INDEX IDX_794381C67E3C61F9');
        $this->addSql('ALTER TABLE review DROP owner_id');
    }
}
