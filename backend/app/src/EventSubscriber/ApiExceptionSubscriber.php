<?php

namespace App\EventSubscriber;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Validator\Exception\ValidationFailedException;

/**
 * Transforma orice eroare de pe rutele /api intr-un raspuns JSON de forma {"error": "..."}.
 *
 * In productie nu trimitem niciodata catre client detaliile interne ale erorii
 * (mesaje SQL, cai de fisiere, stack trace) - ele ajung doar in log.
 */
class ApiExceptionSubscriber implements EventSubscriberInterface
{
    private const MESSAGES = [
        Response::HTTP_BAD_REQUEST => 'Cerere invalida.',
        Response::HTTP_UNAUTHORIZED => 'Trebuie sa fiti autentificat.',
        Response::HTTP_FORBIDDEN => 'Nu aveti dreptul sa faceti aceasta operatie.',
        Response::HTTP_NOT_FOUND => 'Resursa nu exista.',
        Response::HTTP_METHOD_NOT_ALLOWED => 'Metoda HTTP nu este permisa.',
        Response::HTTP_UNSUPPORTED_MEDIA_TYPE => 'Cererea trebuie trimisa ca JSON (Content-Type: application/json).',
        Response::HTTP_UNPROCESSABLE_ENTITY => 'Date invalide.',
        Response::HTTP_TOO_MANY_REQUESTS => 'Prea multe incercari. Incercati din nou mai tarziu.',
    ];

    public function __construct(
        private readonly LoggerInterface $logger,
        #[Autowire('%kernel.debug%')] private readonly bool $debug,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::EXCEPTION => 'onKernelException'];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        if (!str_starts_with($event->getRequest()->getPathInfo(), '/api')) {
            return;
        }

        $exception = $event->getThrowable();
        $status = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : Response::HTTP_INTERNAL_SERVER_ERROR;
        $headers = $exception instanceof HttpExceptionInterface ? $exception->getHeaders() : [];

        $data = ['error' => self::MESSAGES[$status] ?? 'Eroare interna a serverului.'];

        // erori de validare (#[MapRequestPayload]): trimitem mesajul fiecarui camp
        $previous = $exception->getPrevious();
        if ($previous instanceof ValidationFailedException) {
            $violations = [];
            foreach ($previous->getViolations() as $violation) {
                $violations[$violation->getPropertyPath()] ??= $violation->getMessage();
            }
            $data['error'] = reset($violations) ?: $data['error'];
            $data['violations'] = $violations;
        }

        if ($status >= 500) {
            $this->logger->error($exception->getMessage(), ['exception' => $exception]);
        }

        // doar in modul dev: detaliile tehnice, ca sa puteti depana mai usor
        if ($this->debug) {
            $data['debug'] = $exception->getMessage();
        }

        $event->setResponse(new JsonResponse($data, $status, $headers));
    }
}
