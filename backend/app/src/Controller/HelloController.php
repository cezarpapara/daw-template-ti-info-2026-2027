<?php

namespace App\Controller;

use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[OA\Tag(name: 'Laboratorul 06')]
final class HelloController extends AbstractController
{
    #[Route('/api/hello/{name}', name: 'api_hello', methods: ['GET'], requirements: ['name' => '[A-Za-z]+'])]
    #[OA\Response(response: 200, description: 'Salut pentru numele primit în cale')]
    public function hello(string $name): JsonResponse
    {
        return $this->json(['message' => "Salut, $name!"]);
    }

    #[Route('/api/time', name: 'api_time', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Data, ora și fusul orar al serverului')]
    public function time(): JsonResponse
    {
        $now = new \DateTimeImmutable();

        return $this->json([
            'date' => $now->format('Y-m-d'),
            'time' => $now->format('H:i:s'),
            'timezone' => $now->getTimezone()->getName(),
        ]);
    }

    #[Route('/api/numbers', name: 'api_numbers', methods: ['GET'])]
    #[OA\Parameter(name: 'n', in: 'query', description: 'Limita inclusivă; implicit 5', schema: new OA\Schema(type: 'integer', minimum: 1, maximum: 100))]
    #[OA\Response(response: 200, description: 'Numerele pare de la 1 la n, suma și pătratele lor')]
    #[OA\Response(response: 400, description: 'n invalid')]
    public function numbers(Request $request): JsonResponse
    {
        $query = $request->query->all();
        $n = $this->integer($query['n'] ?? 5);
        if ($n === false || $n < 1 || $n > 100) {
            return $this->json(['error' => 'n trebuie să fie un număr întreg între 1 și 100.'], 400);
        }

        // Exercițiul 3: păstrăm numai numerele pare și refacem indicii listei.
        $numbers = array_values(array_filter(range(1, $n), fn (int $number) => $number % 2 === 0));

        return $this->json([
            'n' => $n,
            'numbers' => $numbers,
            'sum' => array_sum($numbers),
            'squares' => array_map(fn (int $number) => $number * $number, $numbers),
        ]);
    }

    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    #[OA\Parameter(name: 'a', in: 'query', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'b', in: 'query', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Cele două numere întregi și suma lor')]
    #[OA\Response(response: 400, description: 'Parametri lipsă, invalizi sau sumă prea mare')]
    public function sum(Request $request): JsonResponse
    {
        $query = $request->query->all();
        $a = $this->integer($query['a'] ?? null);
        $b = $this->integer($query['b'] ?? null);
        if ($a === false || $b === false) {
            return $this->json(['error' => 'a și b sunt obligatorii și trebuie să fie numere întregi.'], 400);
        }

        $sum = $a + $b;
        if (!is_int($sum)) {
            return $this->json(['error' => 'Suma depășește intervalul numerelor întregi acceptate.'], 400);
        }

        return $this->json(['a' => $a, 'b' => $b, 'sum' => $sum]);
    }

    private function integer(mixed $value): int|false
    {
        if (!is_string($value) && !is_int($value)) {
            return false;
        }

        return filter_var($value, FILTER_VALIDATE_INT);
    }
}
