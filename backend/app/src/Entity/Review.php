<?php

namespace App\Entity;

use App\Repository\ReviewRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

// Tabela "review": recenziile produselor
#[ORM\Entity(repositoryClass: ReviewRepository::class)]
class Review
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Regulile de validare (laboratorul 10) stau pe entitate, intr-un singur loc;
    // ReviewController le verifica cu ValidatorInterface. Tabela nu se schimba, deci nu e nevoie de migrare.
    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Autorul este obligatoriu.')]
    // Ex. 1: cel putin 2 caractere
    #[Assert\Length(min: 2, max: 100,
        minMessage: 'Numele trebuie să aibă cel puțin {{ limit }} caractere.',
        maxMessage: 'Cel mult {{ limit }} caractere.')]
    private ?string $author = null;

    #[ORM\Column]
    #[Assert\Range(min: 1, max: 5,
        notInRangeMessage: 'Nota trebuie să fie între {{ min }} și {{ max }}.')]
    private ?int $rating = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\Length(max: 1000,
        maxMessage: 'Comentariul are cel mult {{ limit }} caractere.')]
    // Ex. 3: match: false => eroare cand textul SE POTRIVESTE cu modelul (contine cuvantul "spam")
    #[Assert\Regex(pattern: '/\bspam\b/iu', match: false,
        message: 'Comentariul nu poate conține cuvântul „spam”.')]
    private ?string $comment = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    // Multe recenzii apartin unui produs (relatie N - 1); cheia straina este review.product_id.
    // onDelete: 'CASCADE' => stergerea unui produs ii sterge si recenziile.
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

    // Datele trimise ca JSON catre frontend
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
