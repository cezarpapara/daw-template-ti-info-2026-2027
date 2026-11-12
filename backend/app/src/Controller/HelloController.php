<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class HelloController extends AbstractController
{
    #[Route('/api/hello/{name}', name: 'api_hello_name', methods: ['GET'], requirements: ['name' => '[A-Za-z]+'])]
    public function hello(string $name): JsonResponse
    {
        return $this->json([
            'message' => sprintf('Salut, %s!', $name),
        ]);
    }

    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    public function sum(Request $request): JsonResponse
    {
        $a = $request->query->get('a');
        $b = $request->query->get('b');

        if (!is_string($a) || !preg_match('/^-?\d+$/', $a) || !is_string($b) || !preg_match('/^-?\d+$/', $b)) {
            return $this->json([
                'error' => "Parametrii 'a' și 'b' trebuie să fie numere întregi.",
            ], 400);
        }

        $resultA = (int) $a;
        $resultB = (int) $b;

        return $this->json([
            'a' => $resultA,
            'b' => $resultB,
            'sum' => $resultA + $resultB,
        ]);
    }

    #[Route('/api/time', name: 'api_time', methods: ['GET'])]
    public function time(): JsonResponse
    {
        $timezone = date_default_timezone_get();
        $now = new \DateTimeImmutable('now', new \DateTimeZone($timezone));

        return $this->json([
            'date' => $now->format('Y-m-d'),
            'time' => $now->format('H:i:s'),
            'timezone' => $timezone,
        ]);
    }

    #[Route('/api/numbers', name: 'api_numbers', methods: ['GET'])]
    public function numbers(Request $request): JsonResponse
    {
        $value = $request->query->get('n');

        if (!is_string($value) || $value === '' || !preg_match('/^\d+$/', $value)) {
            return $this->json([
                'error' => "Parametrul 'n' trebuie să fie un număr întreg pozitiv.",
            ], 400);
        }

        $n = (int) $value;
        $numbers = array_values(array_filter(range(1, $n), static fn (int $item): bool => $item % 2 === 0));
        $sum = array_sum($numbers);
        $squares = array_map(static fn (int $item): int => $item * $item, $numbers);

        return $this->json([
            'numbers' => $numbers,
            'sum' => $sum,
            'squares' => $squares,
        ]);
    }

    #[Route('/api/factorial/{n}', name: 'api_factorial', methods: ['GET'], requirements: ['n' => '\\d+'])]
    public function factorial(int $n): JsonResponse
    {
        if ($n < 0 || $n > 20) {
            return $this->json([
                'error' => "Parametrul 'n' trebuie să fie între 0 și 20.",
            ], 400);
        }

        $factorial = 1;
        for ($i = 2; $i <= $n; $i++) {
            $factorial *= $i;
        }

        return $this->json([
            'n' => $n,
            'factorial' => $factorial,
        ]);
    }
}
