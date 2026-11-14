<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class PasswordDemoController extends AbstractController
{
    #[Route('/api/demo/parola', name: 'api_demo_parola', methods: ['POST'])]
    public function demo(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $password = $data['password'] ?? null;

        if (!is_string($password) || trim($password) === '') {
            return $this->json(['error' => 'Introduceți o parolă fictivă.'], 400);
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);

        return $this->json([
            'hash' => $hash,
            'verified' => password_verify($password, $hash),
        ]);
    }
}