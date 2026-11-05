<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository pentru tabela "product".
 *
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * Exemplu de interogare proprie: toate produsele, ordonate dupa nume,
     * impreuna cu categoria lor (JOIN), intr-o singura interogare SQL.
     *
     * @return Product[]
     */
    public function findAllWithCategory(): array
    {
        return $this->createQueryBuilder('p')
            ->addSelect('c')
            ->join('p.category', 'c')
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
