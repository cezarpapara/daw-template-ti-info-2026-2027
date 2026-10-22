<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Adauga headerele HTTP de securitate la fiecare raspuns.
 * Verificare: https://securityheaders.com sau DevTools -> Network -> Headers.
 */
class SecurityHeadersSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::RESPONSE => 'onKernelResponse'];
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $headers = $event->getResponse()->headers;
        $path = $event->getRequest()->getPathInfo();

        // browserul nu "ghiceste" tipul fisierului (ex: un JSON tratat ca HTML)
        $headers->set('X-Content-Type-Options', 'nosniff');
        // pagina nu poate fi incarcata intr-un <iframe> pe alt site (clickjacking)
        $headers->set('X-Frame-Options', 'DENY');
        $headers->set('Referrer-Policy', 'no-referrer');
        $headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if (str_starts_with($path, '/api/doc')) {
            // interfata Swagger are nevoie de propriile scripturi si stiluri
            $headers->set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'");
        } else {
            // API-ul intoarce doar JSON: nu are voie sa incarce nimic
            $headers->set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
        }

        // raspunsurile cu date personale nu se pastreaza in cache-ul browserului
        if (str_starts_with($path, '/api/auth')) {
            $headers->set('Cache-Control', 'no-store');
        }
    }
}
