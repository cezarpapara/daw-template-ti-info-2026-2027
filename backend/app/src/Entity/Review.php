<?php

namespace App\Entity;

use App\Repository\ReviewRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

// Tabela "review": recenziile produselor.
// Un produs are mai multe recenzii, o recenzie apartine unui singur produs (relatie 1 - N).
// Cheia straina sta pe partea "multi": coloana review.product_id.
#[ORM\Entity(repositoryClass: ReviewRepository::class)]
class Review
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $author = null;

    // nota, de la 1 la 5 (verificata in controller)
    #[ORM\Column]
    private ?int $rating = null;

    // comentariul este optional, deci coloana accepta NULL
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $comment = null;

    // proprietatea createdAt devine coloana created_at
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    // ManyToOne: multe recenzii -> un produs. Orice recenzie are un produs (nullable: false).
    // onDelete: 'CASCADE' -> cand se sterge un produs, baza de date ii sterge si recenziile.
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Product $product = null;

    // data se completeaza automat, in momentul in care se creeaza obiectul
    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getAuthor(): ?string { return $this->author; }
    public function getRating(): ?int { return $this->rating; }
    public function getComment(): ?string { return $this->comment; }
    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    public function getProduct(): ?Product { return $this->product; }

    public function setAuthor(string $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function setRating(int $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function setComment(?string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

        return $this;
    }

    // Datele trimise ca JSON catre frontend; operatorul ?-> intoarce null daca obiectul lipseste
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'author' => $this->author,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'createdAt' => $this->createdAt?->format('Y-m-d H:i'),
            'productId' => $this->product?->getId(),
            'productName' => $this->product?->getName(),
        ];
    }
}
