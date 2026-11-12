<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController
{
    #[Route('/api/hello/{name}', name: 'api_hello', requirements: ['name' => '[A-Za-z]+'], methods: ['GET'])]
    public function hello(string $name): JsonResponse
    {
        return new JsonResponse(['message' => "Salut, {$name}!"]);
    }

    #[Route('/api/time', name: 'api_time', methods: ['GET'])]
    public function time(): JsonResponse
    {
        $now = new \DateTimeImmutable();

        return new JsonResponse([
            'date' => $now->format('Y-m-d'),
            'time' => $now->format('H:i:s'),
            'timezone' => $now->getTimezone()->getName(),
        ]);
    }

    #[Route('/api/numbers', name: 'api_numbers', methods: ['GET'])]
    public function numbers(Request $request): JsonResponse
    {
        $n = filter_var($request->query->get('n'), FILTER_VALIDATE_INT);
        if ($n === false || $n < 1 || $n > 1000) {
            return new JsonResponse([
                'error' => 'Parametrul n trebuie să fie un număr întreg între 1 și 1000.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $numbers = array_values(array_filter(
            range(1, $n),
            static fn (int $number): bool => $number % 2 === 0,
        ));

        return new JsonResponse([
            'numbers' => $numbers,
            'sum' => array_sum($numbers),
            'squares' => array_map(static fn (int $number): int => $number ** 2, $numbers),
        ]);
    }

    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    public function sum(Request $request): JsonResponse
    {
        $a = filter_var($request->query->get('a'), FILTER_VALIDATE_INT);
        $b = filter_var($request->query->get('b'), FILTER_VALIDATE_INT);
        if ($a === false || $b === false) {
            return new JsonResponse([
                'error' => 'Parametrii a și b sunt obligatorii și trebuie să fie numere întregi.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'a' => $a,
            'b' => $b,
            'sum' => $a + $b,
        ]);
    }

    #[Route('/api/factorial/{n}', name: 'api_factorial', methods: ['GET'])]
    public function factorial(string $n): JsonResponse
    {
        $number = filter_var($n, FILTER_VALIDATE_INT);
        if ($number === false || $number < 0 || $number > 20) {
            return new JsonResponse([
                'error' => 'n trebuie să fie un număr întreg între 0 și 20.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $factorial = 1;
        for ($i = 2; $i <= $number; $i++) {
            $factorial *= $i;
        }

        return new JsonResponse([
            'n' => $number,
            'factorial' => $factorial,
        ]);
    }
}