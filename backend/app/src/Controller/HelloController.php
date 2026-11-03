<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController extends AbstractController
{
    #[Route(
        '/api/hello/{name}',
        name: 'api_hello',
        requirements: ['name' => '[A-Za-z]+'],
        methods: ['GET']
    )]
    public function hello(string $name): JsonResponse
    {
        return $this->json([
            'message' => "Salut, $name!",
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
        $n = filter_var(
            $request->query->get('n', 5),
            FILTER_VALIDATE_INT,
            [
                'options' => [
                    'min_range' => 1,
                    'max_range' => 100,
                ],
            ]
        );

        if ($n === false) {
            return $this->json(
                [
                    'error' => 'n trebuie să fie un număr întreg între 1 și 100.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Păstrăm doar numerele pare și refacem indicii listei.
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
        // Lipsa parametrului este tratată ca valoare invalidă.
        $a = filter_var(
            $request->query->get('a'),
            FILTER_VALIDATE_INT
        );

        $b = filter_var(
            $request->query->get('b'),
            FILTER_VALIDATE_INT
        );

        // Comparația strictă permite valoarea validă 0.
        if ($a === false || $b === false) {
            return $this->json(
                [
                    'error' => 'Parametrii a și b sunt obligatorii și trebuie să fie numere întregi.',
                ],
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