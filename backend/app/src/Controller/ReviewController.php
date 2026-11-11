<?php

namespace App\Controller;

use App\Entity\Review;
use App\Repository\ProductRepository;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[OA\Tag(name: 'Reviews')]
final class ReviewController extends AbstractController
{
    private const EXAMPLE = ['author' => 'Ana Popescu', 'rating' => 5, 'comment' => 'Recomand!', 'productId' => 1];

    public function __construct(
        private EntityManagerInterface $em,
        private ReviewRepository $reviews,
        private ProductRepository $products,
        private ValidatorInterface $validator,
    ) {
    }

    // 1. Citește toate recenziile
    #[Route('/api/reviews', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);
        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    // 2. Citește o singură recenzie după ID (ex: /api/reviews/5)
    #[Route('/api/reviews/{id<\d+>}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }
        return $this->json($review->toArray());
    }

    // 3. Citește recenziile doar pentru un anumit produs
    #[Route('/api/products/{id<\d+>}/reviews', methods: ['GET'])]
    public function byProduct(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }
        $items = $this->reviews->findBy(['product' => $product], ['createdAt' => 'DESC']);
        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    // EXERCIȚIUL 2: Calculează nota medie a unui produs
    #[Route('/api/products/{id<\d+>}/rating', methods: ['GET'])]
    public function averageRating(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }

        $items = $this->reviews->findBy(['product' => $product]);
        $count = count($items);
        
        if ($count === 0) {
            return $this->json(['productId' => $id, 'count' => 0, 'average' => 0]);
        }

        $sum = array_reduce($items, fn($carry, $item) => $carry + $item->getRating(), 0);
        $average = round($sum / $count, 2);

        return $this->json(['productId' => $id, 'count' => $count, 'average' => $average]);
    }

    // 4. Creează o recenzie nouă (POST)
    #[Route('/api/reviews', methods: ['POST'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: self::EXAMPLE))]
    public function create(Request $request): JsonResponse
    {
        $review = new Review();
        $errors = $this->fill($review, $request);
        
        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }
        
        $this->em->persist($review);
        $this->em->flush();
        return $this->json($review->toArray(), 201);
    }

    // 5. Modifică o recenzie existentă (PUT)
    #[Route('/api/reviews/{id<\d+>}', methods: ['PUT'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: self::EXAMPLE))]
    public function update(int $id, Request $request): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }
        
        $errors = $this->fill($review, $request);
        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }
        
        $this->em->flush();
        return $this->json($review->toArray());
    }

    // 6. Șterge o recenzie (DELETE)
    #[Route('/api/reviews/{id<\d+>}', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }
        
        $this->em->remove($review);
        $this->em->flush();
        return new Response(null, 204);
    }

    // Funcție comună pentru validare și completare date (folosită la POST și PUT)
    private function fill(Review $review, Request $request): array
{
    try {
        $data = $request->toArray();
    } catch (JsonException) {
        return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
    }

    $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
    $comment = is_string($data['comment'] ?? null) ? trim($data['comment']) : '';
    $rating = is_int($data['rating'] ?? null) ? $data['rating'] : 0;

    $review->setAuthor($author)
           ->setRating($rating)
           ->setComment($comment === '' ? null : $comment)
           ->setProduct($this->products->find((int) ($data['productId'] ?? 0)));

    $errors = [];
    foreach ($this->validator->validate($review) as $violation) {
        $errors[$violation->getPropertyPath()] = $violation->getMessage();
    }

    return $errors;
}
}