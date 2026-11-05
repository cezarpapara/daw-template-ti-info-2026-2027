<?php

namespace App\Controller;

use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Laboratorul 06: endpoint-uri simple, publice, care intorc JSON.
// O ruta leaga o adresa de o functie PHP (actiune), iar $this->json(...) transforma un
// tablou PHP in JSON. Al doilea argument este codul de stare; implicit este 200.
#[OA\Tag(name: 'Laborator 06')]
final class HelloController extends AbstractController
{
    // GET /api/hello/Ana -> {name} este un parametru de cale si ajunge in variabila $name.
    // Exercitiul 2: requirements accepta doar litere, deci /api/hello/123 primeste 404:
    // nicio ruta nu se potriveste cu adresa, asa ca actiunea nici nu se mai executa.
    #[Route('/api/hello/{name}', name: 'api_hello', methods: ['GET'], requirements: ['name' => '[A-Za-z]+'])]
    #[OA\Response(response: 200, description: 'Mesajul de salut')]
    #[OA\Response(response: 404, description: 'Numele contine altceva decat litere')]
    public function hello(string $name): JsonResponse
    {
        return $this->json(['message' => "Salut, $name!"]);
    }

    // GET /api/time -> data, ora si fusul orar ale serverului
    #[Route('/api/time', name: 'api_time', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Data, ora si fusul orar')]
    public function time(): JsonResponse
    {
        $now = new \DateTimeImmutable();

        return $this->json([
            'date' => $now->format('Y-m-d'),
            'time' => $now->format('H:i:s'),
            'timezone' => $now->getTimezone()->getName(),
        ]);
    }

    // GET /api/numbers?n=10 -> numerele pare de la 1 la n (exercitiul 3), suma si patratele lor
    #[Route('/api/numbers', name: 'api_numbers', methods: ['GET'])]
    #[OA\Parameter(name: 'n', in: 'query', schema: new OA\Schema(type: 'integer', default: 5, minimum: 1, maximum: 100))]
    #[OA\Response(response: 200, description: 'Numerele pare, suma si patratele')]
    #[OA\Response(response: 400, description: 'n nu este un numar intreg intre 1 si 100')]
    public function numbers(Request $request): JsonResponse
    {
        // Nu avem incredere in datele primite de la client: le verificam inainte sa le folosim.
        // filter_var intoarce numarul daca textul este un intreg intre 1 si 100, altfel false.
        // ?n=5 ; daca lipseste, folosim 5
        $n = filter_var($request->query->get('n', 5), FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 100],
        ]);

        if ($n === false) {
            return $this->json(
                ['error' => 'n trebuie sa fie un numar intreg intre 1 si 100.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // array_filter pastreaza cheile initiale (1, 3, 5...); array_values le renumeroteaza
        // de la 0, altfel in JSON am obtine un obiect in loc de o lista
        $numbers = array_values(array_filter(range(1, $n), fn (int $x) => $x % 2 === 0));

        return $this->json([
            'n' => $n,
            'numbers' => $numbers,
            'sum' => array_sum($numbers),
            'squares' => array_map(fn (int $x) => $x * $x, $numbers),
        ]);
    }

    // Exercitiul 1: GET /api/sum?a=3&b=4 -> {"a": 3, "b": 4, "sum": 7}
    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    #[OA\Parameter(name: 'a', in: 'query', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'b', in: 'query', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Suma celor doua numere')]
    #[OA\Response(response: 400, description: 'a sau b lipseste ori nu este numar intreg')]
    public function sum(Request $request): JsonResponse
    {
        // un parametru lipsa vine ca null, iar filter_var intoarce false
        $a = filter_var($request->query->get('a'), FILTER_VALIDATE_INT);
        $b = filter_var($request->query->get('b'), FILTER_VALIDATE_INT);

        // comparam strict cu false: 0 este un numar valid, chiar daca in PHP 0 == false
        if ($a === false || $b === false) {
            return $this->json(
                ['error' => 'a si b sunt obligatorii si trebuie sa fie numere intregi.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $this->json(['a' => $a, 'b' => $b, 'sum' => $a + $b]);
    }

    // Exercitiul 4: GET /api/factorial/5 -> {"n": 5, "factorial": 120}
    // Limita este 20 pentru ca 21! nu mai incape intr-un intreg PHP (64 de biti).
    #[Route('/api/factorial/{n}', name: 'api_factorial', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Factorialul lui n')]
    #[OA\Response(response: 400, description: 'n nu este un numar intreg intre 0 si 20')]
    public function factorial(string $n): JsonResponse
    {
        $number = filter_var($n, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 0, 'max_range' => 20],
        ]);

        if ($number === false) {
            return $this->json(
                ['error' => 'n trebuie sa fie un numar intreg intre 0 si 20.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // pentru n = 0 si n = 1 bucla nu se executa, iar rezultatul ramane 1
        $factorial = 1;
        for ($i = 2; $i <= $number; ++$i) {
            $factorial *= $i;
        }

        return $this->json(['n' => $number, 'factorial' => $factorial]);
    }
}
