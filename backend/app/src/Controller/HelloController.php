<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController extends AbstractController
{
    // Exercițiul 2: Restricționare {name} doar la litere ([A-Za-z]+)
    #[Route('/api/hello/{name}', name: 'api_hello', methods: ['GET'], requirements: ['name' => '[A-Za-z]+'])]
    public function hello(string $name): JsonResponse
    {
        return $this->json(['message' => "Salut, $name!"]);
    }

    #[Route('/api/time', name: 'api_time', methods: ['GET'])]
    public function time(): JsonResponse
    {
        $now = new \DateTimeImmutable();
        return $this->json([
            'date' => $now->format('Y-m-d'),
            'time' => $now->format('H:i:s'),
            'timezone' => $now->getTimezone()->getName(),
        ]);
    }

    // Exercițiul 3: Returnează doar numerele pare de la 1 la n
    #[Route('/api/numbers', name: 'api_numbers', methods: ['GET'])]
    public function numbers(Request $request): JsonResponse
    {
        $n = filter_var($request->query->get('n', 5), FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 100],
        ]);

        if ($n === false) {
            return $this->json(
                ['error' => 'n trebuie să fie un număr întreg între 1 și 100.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $allNumbers = range(1, $n);
        // Filtrăm doar numerele pare
        $evenNumbers = array_values(array_filter($allNumbers, fn($x) => $x % 2 === 0));

        return $this->json([
            'n' => $n,
            'numbers' => $evenNumbers,
            'sum' => array_sum($evenNumbers),
            'squares' => array_map(fn (int $x) => $x * $x, $evenNumbers),
        ]);
    }

    // Exercițiul 1: Endpoint GET /api/sum?a=3&b=4
    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    public function sum(Request $request): JsonResponse
    {
        $a = filter_var($request->query->get('a'), FILTER_VALIDATE_INT);
        $b = filter_var($request->query->get('b'), FILTER_VALIDATE_INT);

        if ($a === false || $b === false) {
            return $this->json(
                ['error' => 'Parametrii a și b sunt obligatorii și trebuie să fie numere întregi.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $this->json([
            'a' => $a,
            'b' => $b,
            'sum' => $a + $b,
        ]);
    }
}
