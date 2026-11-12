<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
final class HealthController extends AbstractController
{
 #[Route('/api/hello/{name}', name: 'api_hello', methods: ['GET'], requirements: ['name' => '[A-Za-z]+'])]
public function hello(string $name): JsonResponse
{
    return new JsonResponse(['message' => 'Salut, ' . $name . '!']);
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

    $numbers = range(1, $n);

    // Nou: păstrăm doar numerele pare
    $numbers = array_filter($numbers, fn (int $x) => $x % 2 === 0);

    // Nou: reindexăm array-ul de la 0, ca JSON-ul să fie un array curat [2,4,...]
    $numbers = array_values($numbers);

    return $this->json([
        'n' => $n,
        'numbers' => $numbers,
        'sum' => array_sum($numbers),
        'squares' => array_map(fn (int $x) => $x * $x, $numbers),
    ]);
}

#[Route('/api/factorial/{n}', name: 'api_factorial', methods: ['GET'], requirements: ['n' => '\d+'])]
public function factorial(int $n): JsonResponse
{
    if ($n < 0 || $n > 20) {
        return new JsonResponse(['error' => 'n trebuie să fie între 0 și 20.'], 400);
    }

    $factorial = 1;
    for ($i = 2; $i <= $n; $i++) {
        $factorial *= $i;
    }

    return new JsonResponse(['n' => $n, 'factorial' => $factorial]);
}
}