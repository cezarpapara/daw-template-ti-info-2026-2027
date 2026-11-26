<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\Review;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Review> */
class ReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Review::class);
    }

    /** @return Review[] */
    public function findNewestWithProduct(?Product $product = null): array
    {
        // JOIN încarcă și produsul, fără câte o interogare pentru fiecare recenzie.
        $query = $this->createQueryBuilder('r')
            ->addSelect('p')
            ->join('r.product', 'p')
            ->orderBy('r.createdAt', 'DESC')
            ->addOrderBy('r.id', 'DESC');

        if ($product !== null) {
            $query->andWhere('r.product = :product')->setParameter('product', $product);
        }

        return $query->getQuery()->getResult();
    }
}
