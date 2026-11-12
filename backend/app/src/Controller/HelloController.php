<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController extends AbstractController
{
    #[Route('/api/hello/{name}', name: 'api_hello', methods: ['GET'], requirements: ['name' => '[A-Za-z]+'])]
    public function hello(string $name): JsonResponse
    {
        return $this->json([
            'message' => "Salut, $name!"
        ]);
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
        // Daca parametrul n lipseste, folosim valoarea 5
        $n = filter_var(
            $request->query->get('n', 5),
            FILTER_VALIDATE_INT,
            [
                'options' => [
                    'min_range' => 1,
                    'max_range' => 100
                ]
            ]
        );

        if ($n === false) {
            return $this->json(
                ['error' => 'n trebuie sa fie un numar intreg intre 1 si 100.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Pastram doar numerele pare
        $numbers = array_values(
            array_filter(
                range(1, $n),
                fn (int $x) => $x % 2 === 0
            )
        );

        return $this->json([
            'n' => $n,
            'numbers' => $numbers,
            'sum' => array_sum($numbers),
            'squares' => array_map(
                fn (int $x) => $x * $x,
                $numbers
            ),
        ]);
    }

    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    public function sum(Request $request): JsonResponse
    {
        $a = filter_var(
            $request->query->get('a'),
            FILTER_VALIDATE_INT
        );

        $b = filter_var(
            $request->query->get('b'),
            FILTER_VALIDATE_INT
        );

        if ($a === false || $b === false) {
            return $this->json(
                ['error' => 'a si b trebuie sa fie numere intregi.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $this->json([
            'a' => $a,
            'b' => $b,
            'sum' => $a + $b,
        ]);
    }

    // Exercitiul 4 - Factorial
    #[Route('/api/factorial/{n}', name: 'api_factorial', methods: ['GET'])]
    public function factorial(string $n): JsonResponse
    {
        $number = filter_var(
            $n,
            FILTER_VALIDATE_INT,
            [
                'options' => [
                    'min_range' => 0,
                    'max_range' => 20
                ]
            ]
        );

        if ($number === false) {
            return $this->json(
                ['error' => 'n trebuie sa fie un numar intreg intre 0 si 20.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $result = 1;

        for ($i = 1; $i <= $number; $i++) {
            $result *= $i;
        }

        return $this->json([
            'n' => $number,
            'factorial' => $result
        ]);
    }
}