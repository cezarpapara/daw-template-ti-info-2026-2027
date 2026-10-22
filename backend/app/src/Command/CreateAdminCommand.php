<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\Argument;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Creeaza un administrator (sau face admin un cont existent).
 * Nu exista niciun cont de admin cu parola scrisa in cod sau in migrari.
 *
 * Rulare: docker exec -it daw-php php bin/console app:create-admin admin@exemplu.ro
 */
#[AsCommand(name: 'app:create-admin', description: 'Creeaza un cont de administrator')]
class CreateAdminCommand
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(SymfonyStyle $io, #[Argument('Email-ul administratorului')] string $email): int
    {
        $user = $this->userRepository->findOneBy(['email' => mb_strtolower($email)]);

        if ($user === null) {
            // parola se citeste ascuns din terminal (nu apare pe ecran si nici in istoricul comenzilor)
            $password = $io->askHidden('Parola (minim 12 caractere)');
            if ($password === null || mb_strlen($password) < 12) {
                $io->error('Parola trebuie sa aiba cel putin 12 caractere.');

                return Command::FAILURE;
            }

            $user = new User();
            $user->setEmail($email);
            $user->setPassword($this->passwordHasher->hashPassword($user, $password));
            $this->entityManager->persist($user);
        }

        $user->setRoles(['ROLE_ADMIN']);
        $this->entityManager->flush();

        $io->success(sprintf('%s este administrator.', $user->getEmail()));

        return Command::SUCCESS;
    }
}
