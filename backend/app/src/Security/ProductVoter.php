<?php

namespace App\Security;

use App\Entity\Product;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * Decide cine are voie sa modifice / stearga un produs:
 * proprietarul produsului sau un administrator.
 *
 * Folosire in controller: $this->denyAccessUnlessGranted(ProductVoter::EDIT, $product);
 *
 * @extends Voter<string, Product>
 */
class ProductVoter extends Voter
{
    public const EDIT = 'PRODUCT_EDIT';
    public const DELETE = 'PRODUCT_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::DELETE], true) && $subject instanceof Product;
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

        // comparam id-urile (nu obiectele), ca sa nu depindem de cum a fost incarcat utilizatorul
        return $subject->getOwner()?->getId() === $user->getId();
    }
}
