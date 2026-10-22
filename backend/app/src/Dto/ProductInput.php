<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

// Datele trimise la POST/PUT /api/products (validate automat de Symfony)
final class ProductInput
{
    public function __construct(
        #[Assert\NotBlank(message: 'Numele produsului este obligatoriu.', normalizer: 'trim')]
        #[Assert\Length(max: 150, maxMessage: 'Numele poate avea cel mult {{ limit }} caractere.')]
        public readonly string $name = '',

        #[Assert\Length(max: 2000, maxMessage: 'Descrierea poate avea cel mult {{ limit }} caractere.')]
        public readonly ?string $description = null,

        // pretul poate veni ca numar (59.9) sau ca text ("59.90")
        #[Assert\NotBlank(message: 'Pretul este obligatoriu.')]
        #[Assert\Type(type: 'numeric', message: 'Pretul trebuie sa fie un numar.')]
        #[Assert\Range(min: 0, max: 99999999.99, notInRangeMessage: 'Pretul trebuie sa fie intre {{ min }} si {{ max }}.')]
        public readonly int|float|string|null $price = null,

        #[Assert\NotBlank(message: 'Categoria este obligatorie.')]
        #[Assert\Positive]
        public readonly ?int $categoryId = null,
    ) {
    }
}
