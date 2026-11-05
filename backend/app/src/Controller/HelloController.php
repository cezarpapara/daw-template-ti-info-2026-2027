<?php

namespace App\Controller;

use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController extends AbstractController
{
    #[Route('/api/hello/{name}', name: 'api_hello', methods: ['GET'])]
    public function hello(string $name): JsonResponse
    {
        requirements:
        ['name' => '[a-zA-Z]+'];
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
    #[Route('/api/numbers', name: 'api_numbers', methods: ['GET'])]
    public function numbers(Request $request): JsonResponse
    {
        $n = filter_var($request->query->get('n', 99), FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 100],
        ]);
        if ($n === false) {
            return $this->json(
                ['error' => 'n trebuie să fie un număr întreg între 1 și 100.'],
                Response::HTTP_BAD_REQUEST
            );
        }
        $numbers = array_filter(range(1, $n), fn(int $x) => $x % 2 === 0);
        $numbersarray = array_values($numbers); // Reindex the array to have sequential keys
        return $this->json([
            'n' => $n,
            'numbers' => $numbersarray,
        ]);
    }
    #[Route('/api/sum/a={a}&b={b}', name: 'api_sum', methods: ['GET'])]
    public function sum(string $a, string $b): JsonResponse
    {
        $a = filter_var($a, FILTER_VALIDATE_INT);
        $b = filter_var($b, FILTER_VALIDATE_INT);
        if ($a === false || $b === false) {
            return $this->json(
                ['error' => 'a și b sunt obligatorii și trebuie să fie numere întregi.'],
                Response::HTTP_BAD_REQUEST
            );
        }
        return $this->json([
            'a' => $a,
            'b' => $b,
            'sum' => $a + $b,
        ]);
    }
    #[Route('/api/factorial/{n}', name: 'api_factorial', methods: ['GET'])]
    public function factorial(int $n): JsonResponse
    {
        if ($n < 0 && $n > 20 && !is_int($n)) {
            return $this->json(
                ['error' => 'n trebuie să fie un număr întreg intre 0 și 20.'],
                Response::HTTP_BAD_REQUEST
            );
        }
        $factorial = 1;
        for ($i = 1; $i <= $n; $i++) {
            $factorial *= $i;
        }
        return $this->json([
            'n' => $n,
            'factorial' => $factorial,
        ]);
    }
}
