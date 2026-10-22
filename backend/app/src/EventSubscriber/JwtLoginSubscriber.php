<?php

namespace App\EventSubscriber;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\TooManyLoginAttemptsAuthenticationException;

/**
 * Personalizeaza raspunsurile legate de JWT: login reusit / esuat si token lipsa / invalid / expirat.
 *
 * Token-ul JWT NU este trimis in corpul raspunsului: el ajunge doar intr-un cookie
 * httpOnly (vezi lexik_jwt_authentication.yaml), pe care JavaScript nu il poate citi.
 * Astfel, un eventual atac XSS nu poate fura token-ul.
 */
class JwtLoginSubscriber implements EventSubscriberInterface
{
    public function __construct(
        #[Autowire('%env(bool:JWT_COOKIE_SECURE)%')] private readonly bool $secureCookie,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            Events::AUTHENTICATION_SUCCESS => 'onSuccess',
            Events::AUTHENTICATION_FAILURE => 'onFailure',
            Events::JWT_NOT_FOUND => 'onTokenNotFound',
            Events::JWT_INVALID => 'onTokenInvalid',
            Events::JWT_EXPIRED => 'onTokenInvalid',
        ];
    }

    // la login reusit trimitem datele utilizatorului (fara parola)
    public function onSuccess(AuthenticationSuccessEvent $event): void
    {
        $user = $event->getUser();
        if ($user instanceof User) {
            $event->setData(['user' => $user->toArray()]);
        }
    }

    // acelasi mesaj si pentru email inexistent si pentru parola gresita,
    // ca un atacator sa nu poata afla ce email-uri au cont
    public function onFailure(AuthenticationFailureEvent $event): void
    {
        // limita de incercari (login_throttling din security.yaml) a fost depasita
        if ($event->getException() instanceof TooManyLoginAttemptsAuthenticationException) {
            $event->setResponse(new JsonResponse(
                ['error' => 'Prea multe incercari de autentificare. Incercati din nou peste cateva minute.'],
                Response::HTTP_TOO_MANY_REQUESTS,
            ));

            return;
        }

        $event->setResponse(new JsonResponse(['error' => 'Email sau parola gresita.'], Response::HTTP_UNAUTHORIZED));
    }

    public function onTokenNotFound(JWTNotFoundEvent $event): void
    {
        $event->setResponse(new JsonResponse(['error' => 'Trebuie sa fiti autentificat.'], Response::HTTP_UNAUTHORIZED));
    }

    // token modificat, semnat cu alta cheie sau expirat: il stergem din browser,
    // ca urmatoarele cereri (de ex. lista publica de produse) sa mearga normal
    public function onTokenInvalid(JWTInvalidEvent|JWTExpiredEvent $event): void
    {
        $response = new JsonResponse(['error' => 'Sesiunea nu este valida sau a expirat. Autentificati-va din nou.'], Response::HTTP_UNAUTHORIZED);
        $response->headers->clearCookie('BEARER', '/', null, $this->secureCookie, true, Cookie::SAMESITE_STRICT);
        $event->setResponse($response);
    }
}
