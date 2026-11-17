<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

// Doar pentru demonstrație la laborator. Nu îl păstrați în proiectul final.
final class PasswordDemoController extends AbstractController
{
    // POST /api/demo/parola cu {"password": "parola123"}
    // Parola nu se pastreaza niciodata in clar: doar hash-ul (cu o "sare" aleatoare inclusa).
    #[Route('/api/demo/parola', methods: ['POST'])]
    public function hash(Request $request): JsonResponse
    {
        $password = (string) ($request->toArray()['password'] ?? '');
        $hash = password_hash($password, PASSWORD_DEFAULT);

        return $this->json([
            'hash' => $hash,
            'parolaCorecta' => password_verify($password, $hash),
            'parolaGresita' => password_verify($password . 'x', $hash),
        ]);
    }
}
