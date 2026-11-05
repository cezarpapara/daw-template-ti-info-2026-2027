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

#[OA\Tag(name: 'Reviews')]
final class ReviewController extends AbstractController
{
    private const EXAMPLE = ['author' => 'Ana Popescu', 'rating' => 5, 'comment' => 'Recomand!', 'productId' => 1];

    public function __construct(
        private EntityManagerInterface $em,
        private ReviewRepository $reviews,
        private ProductRepository $products,
    ) {
    }

    #[Route('/api/reviews', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);
        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    #[Route('/api/reviews/{id<\d+>}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }
        return $this->json($review->toArray());
    }

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

    // Exercițiul 2: Adăugarea rutei GET /api/products/{id}/rating care calculează media notelor
    #[Route('/api/products/{id<\d+>}/rating', methods: ['GET'])]
    public function getRatingForProduct(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }

        $items = $this->reviews->findBy(['product' => $product]);
        $count = count($items);
        $average = 0;

        if ($count > 0) {
            $sum = array_sum(array_map(fn (Review $r) => $r->getRating(), $items));
            $average = round($sum / $count, 2);
        }

        return $this->json([
            'productId' => $id,
            'count' => $count,
            'average' => $average,
        ]);
    }

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

    // Exercițiul 3 (Opțional): PATCH /api/reviews/{id} pentru modificări parțiale
    #[Route('/api/reviews/{id<\d+>}', methods: ['PATCH'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: ['rating' => 3]))]
    public function patch(int $id, Request $request): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        $errors = $this->fill($review, $request, true); // Trimitem flag-ul $isPatch = true
        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }

        $this->em->flush();
        return $this->json($review->toArray());
    }

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

    // Am adăugat $isPatch pentru a trata Exercițiul 3 (PATCH = nu e nevoie să trimitem toate field-urile)
    private function fill(Review $review, Request $request, bool $isPatch = false): array
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        $errors = [];

        // Dacă nu e PATCH sau dacă e PATCH dar câmpul este prezent, validăm și populăm Author
        if (!$isPatch || array_key_exists('author', $data)) {
            $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
            if ($author === '' || mb_strlen($author) > 100) {
                $errors['author'] = 'Autorul este obligatoriu (cel mult 100 de caractere).';
            } else {
                $review->setAuthor($author);
            }
        }

        // Rating
        if (!$isPatch || array_key_exists('rating', $data)) {
            $rating = $data['rating'] ?? null;
            if (!is_int($rating) || $rating < 1 || $rating > 5) {
                $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
            } else {
                $review->setRating($rating);
            }
        }

        // ProductId
        if (!$isPatch || array_key_exists('productId', $data)) {
            $product = $this->products->find((int) ($data['productId'] ?? 0));
            if (!$product) {
                $errors['productId'] = 'Produsul indicat nu există.';
            } else {
                $review->setProduct($product);
            }
        }

        // Comment
        if (!$isPatch || array_key_exists('comment', $data)) {
            $comment = is_string($data['comment'] ?? null) ? trim($data['comment']) : '';
            $review->setComment($comment === '' ? null : $comment);
        }

        return $errors;
    }
}