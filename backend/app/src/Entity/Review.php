<?php

namespace App\Entity;

use App\Repository\ReviewRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ReviewRepository::class)]
class Review
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Autorul este obligatoriu.')]
    #[Assert\Length(min: 2, max: 100, minMessage: 'Numele trebuie să aibă minim {{ limit }} caractere.', maxMessage: 'Cel mult {{ limit }} caractere.')]
    private ?string $author = null;

    #[ORM\Column]
    #[Assert\Range(min: 1, max: 5, notInRangeMessage: 'Nota trebuie să fie între {{ min }} și {{ max }}.')]
    private ?int $rating = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\Length(max: 1000, maxMessage: 'Comentariul are cel mult {{ limit }} caractere.')]
    #[Assert\Regex(pattern: '/spam/i', match: false, message: 'Comentariul nu poate conține cuvântul "spam".')]
    private ?string $comment = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Assert\NotNull(message: 'Produsul indicat nu există.')]
    private ?Product $product = null;

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