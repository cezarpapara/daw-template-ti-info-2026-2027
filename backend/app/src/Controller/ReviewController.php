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
    private const EXAMPLE = [
        'author' => 'Ana Popescu',
        'rating' => 5,
        'comment' => 'Recomand!',
        'productId' => 1,
    ];

    public function __construct(
        private EntityManagerInterface $em,
        private ReviewRepository $reviews,
        private ProductRepository $products,
    ) {
    }

    // ---------- Citirea: rute GET ----------

    #[Route('/api/reviews', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    #[Route('/api/reviews/{id<\d+>}', methods: ['GET'])] // {id<\d+>}: doar cifre
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

    // Ex. 2: /api/products/{id}/rating
    #[Route('/api/products/{id<\d+>}/rating', methods: ['GET'])]
    public function rating(int $id): JsonResponse
    {
        $product = $this->products->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }

        $items = $this->reviews->findBy(['product' => $product]);
        $count = count($items);
        $average = null;

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

    // ---------- Scrierea: POST, PUT, PATCH, DELETE ----------

    #[Route('/api/reviews', methods: ['POST'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: self::EXAMPLE))]
    public function create(Request $request): JsonResponse
    {
        $review = new Review();
        $errors = $this->fill($review, $request);

        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }

        $this->em->persist($review); // obiect nou, de salvat
        $this->em->flush();          // trimite INSERT la PostgreSQL

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

    // Ex. 3 (opțional): PATCH modifică doar câmpurile prezente în JSON
    #[Route('/api/reviews/{id<\d+>}', methods: ['PATCH'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: ['rating' => 3]))]
    public function patch(int $id, Request $request): JsonResponse
    {
        $review = $this->reviews->find($id);

        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return $this->json(
                ['errors' => ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.']],
                400
            );
        }

        $errors = [];
        $author = null;
        $rating = null;
        $product = null;
        $comment = null;

        if (array_key_exists('author', $data)) {
            $author = is_string($data['author']) ? trim($data['author']) : '';
            if ($author === '' || mb_strlen($author) > 100) {
                $errors['author'] = 'Autorul este obligatoriu (cel mult 100 de caractere).';
            }
        }

        if (array_key_exists('rating', $data)) {
            $rating = $data['rating'];
            if (!is_int($rating) || $rating < 1 || $rating > 5) {
                $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
            }
        }

        if (array_key_exists('productId', $data)) {
            $productId = $data['productId'];
            $product = is_int($productId) ? $this->products->find($productId) : null;
            if (!$product) {
                $errors['productId'] = 'productId trebuie să fie un număr întreg care identifică un produs existent.';
            }
        }

        if (array_key_exists('comment', $data)) {
            if ($data['comment'] !== null && !is_string($data['comment'])) {
                $errors['comment'] = 'Comentariul trebuie să fie text sau null.';
            } else {
                $comment = is_string($data['comment']) ? trim($data['comment']) : '';
            }
        }

        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }

        if (array_key_exists('author', $data)) {
            $review->setAuthor($author);
        }
        if (array_key_exists('rating', $data)) {
            $review->setRating($rating);
        }
        if (array_key_exists('productId', $data)) {
            $review->setProduct($product);
        }
        if (array_key_exists('comment', $data)) {
            $review->setComment($comment === '' ? null : $comment);
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

    // ---------- Validarea manuală, comună pentru POST și PUT ----------

    // Verifică JSON-ul și completează recenzia; întoarce erorile (câmp => mesaj).
    private function fill(Review $review, Request $request): array
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        $errors = [];

        $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
        if ($author === '' || mb_strlen($author) > 100) {
            $errors['author'] = 'Autorul este obligatoriu (cel mult 100 de caractere).';
        }

        $rating = $data['rating'] ?? null;
        if (!is_int($rating) || $rating < 1 || $rating > 5) {
            $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
        }

        $productId = $data['productId'] ?? null;
        $product = is_int($productId) ? $this->products->find($productId) : null;
        if (!$product) {
            $errors['productId'] = 'productId trebuie să fie un număr întreg care identifică un produs existent.';
        }

        $comment = $data['comment'] ?? null;
        if ($comment !== null && !is_string($comment)) {
            $errors['comment'] = 'Comentariul trebuie să fie text sau null.';
        }

        if ($errors) {
            return $errors;
        }

        $comment = is_string($comment) ? trim($comment) : '';

        $review->setAuthor($author)
            ->setRating($rating)
            ->setComment($comment === '' ? null : $comment)
            ->setProduct($product);

        return [];
    }
}