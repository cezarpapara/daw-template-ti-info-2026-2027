<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

// Datele trimise la POST /api/categories (validate automat de Symfony)
final class CategoryInput
{
    public function __construct(
        #[Assert\NotBlank(message: 'Numele categoriei este obligatoriu.', normalizer: 'trim')]
        #[Assert\Length(max: 100, maxMessage: 'Numele poate avea cel mult {{ limit }} caractere.')]
        public readonly string $name = '',
    ) {
    }
}
