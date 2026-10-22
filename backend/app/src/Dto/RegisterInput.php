<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

// Datele trimise la POST /api/auth/register (validate automat de Symfony)
final class RegisterInput
{
    public function __construct(
        #[Assert\NotBlank(message: 'Email-ul este obligatoriu.')]
        #[Assert\Email(message: 'Email-ul nu este valid.')]
        #[Assert\Length(max: 180)]
        public readonly string $email = '',

        // max 4096: hash-uirea unei parole uriase ar bloca serverul (atac DoS)
        #[Assert\NotBlank(message: 'Parola este obligatorie.')]
        #[Assert\Length(min: 8, max: 4096, minMessage: 'Parola trebuie sa aiba cel putin {{ limit }} caractere.')]
        #[Assert\PasswordStrength(
            minScore: Assert\PasswordStrength::STRENGTH_MEDIUM,
            message: 'Parola este prea slaba. Folositi litere mari si mici, cifre si simboluri.',
        )]
        public readonly string $password = '',
    ) {
    }
}
