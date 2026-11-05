<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Attribute\Route;

class HealthController extends AbstractController
{
    // http://localhost:8080/ duce direct la documentatia API (Swagger)
    #[Route('/', name: 'home', methods: ['GET'])]
    public function home(): RedirectResponse
    {
        return $this->redirect('/api/doc');
    }

    // Verifica daca backend-ul si baza de date functioneaza
    #[Route('/api/health', name: 'api_health', methods: ['GET'])]
    #[OA\Tag(name: 'Stare')]
    #[OA\Response(response: 200, description: 'Backend-ul functioneaza')]
    public function health(Connection $connection): JsonResponse
    {
        try {
            $connection->executeQuery('SELECT 1');
            $database = 'conectata';
        } catch (\Throwable $e) {
            $database = 'eroare: '.$e->getMessage();
        }

        return $this->json([
            'status' => 'ok',
            'message' => 'Salut din Symfony!',
            'database' => $database,
            'time' => (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);
    }
}
