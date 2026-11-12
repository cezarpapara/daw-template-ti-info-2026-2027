<?php

namespace App\Security;

use App\Entity\Review;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * Decide cine are voie sa modifice / stearga o recenzie:
 * autorul ei (utilizatorul care a creat-o) sau un administrator.
 * Aceeasi regula ca in ProductVoter.
 *
 * Folosire in controller: $this->denyAccessUnlessGranted(ReviewVoter::EDIT, $review);
 *
 * @extends Voter<string, Review>
 */
class ReviewVoter extends Voter
{
    public const EDIT = 'REVIEW_EDIT';
    public const DELETE = 'REVIEW_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::DELETE], true) && $subject instanceof Review;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false; // utilizator neautentificat
        }

        if ($user->isAdmin()) {
            return true;
        }

        // o recenzie fara proprietar (introdusa direct in baza de date) o poate gestiona doar un admin
        return $subject->getOwner()?->getId() === $user->getId();
    }
}
