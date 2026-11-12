<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController extends AbstractController
{
    #[Route('/api/hello/{name}', name: 'api_hello', methods: ['GET'],requirements: ['name' => '[A-Za-z]+'])]
    public function hello(string $name): JsonResponse{
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
    public function numbers(Request $request): JsonResponse{
        // ?n=5 ; dacă lipsește, folosim 5
        $n = filter_var($request->query->get('n', 5), FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 100],
        ]);
        if ($n === false) {
            return $this->json(
                ['error' => 'n trebuie să fie un număr întreg între 1 și 100.'],
                Response::HTTP_BAD_REQUEST
            );
        }
        // $numbers = numbers(1, $n) 
        $numbers = array_values(array_filter(
            range(1, $n),
            fn(int $number): bool => $number % 2 === 0
        ));
        return $this->json([
            'n' => $n,
            'numbers' => $numbers,
            'sum' => array_sum($numbers),
            'squares' => array_map(fn(int $x) => $x * $x, $numbers),
        ]);
    }
    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    public function sum(Request $request): JsonResponse{
        $a = filter_var($request->query->get('a'), FILTER_VALIDATE_INT);
        $b = filter_var($request->query->get('b'), FILTER_VALIDATE_INT);

        if ($a === false || $b === false) {
            return $this->json(
                ['error' => 'Parametrii a și b trebuie să fie numere întregi.'],
                Response::HTTP_BAD_REQUEST
            );
        }
        return $this->json([
            'a' => $a,
            'b' => $b,
            'sum' => $a + $b,
        ]);
    }
    #[Route('/api/factorial', name: 'api_factorial', methods: ['GET'])]
    public function factorial(Request $request): JsonResponse
    {
        $n = filter_var($request->query->get('n'), FILTER_VALIDATE_INT);

        if ($n === false) {
            return $this->json(
                ['error' => 'Parametrul n trebuie să fie un număr întreg.'],
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
