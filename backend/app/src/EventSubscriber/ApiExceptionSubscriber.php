<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;

/** Rutele API greșite răspund tot în JSON, inclusiv înainte de controller. */
final class ApiExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::EXCEPTION => ['onException', 10]];
    }

    public function onException(ExceptionEvent $event): void
    {
        if (!str_starts_with($event->getRequest()->getPathInfo(), '/api/')) {
            return;
        }

        $exception = $event->getThrowable();
        if (!$exception instanceof HttpExceptionInterface) {
            return;
        }

        $status = $exception->getStatusCode();
        $message = match ($status) {
            400 => 'Cererea nu este validă.',
            404 => 'Resursa cerută nu există.',
            405 => 'Metoda HTTP nu este permisă pentru această adresă.',
            default => null,
        };
        if ($message !== null) {
            // La 405 păstrăm și antetul Allow stabilit de router.
            $event->setResponse(new JsonResponse(['error' => $message], $status, $exception->getHeaders()));
        }
    }
}
