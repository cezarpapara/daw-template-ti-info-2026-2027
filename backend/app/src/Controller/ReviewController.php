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
        private ValidatorInterface $validator,
    ) {
    }

    // ---------- Citirea: rute GET ----------

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

        // Modificăm doar câmpurile prezente în JSON
        if (array_key_exists('author', $data)) {
            $review->setAuthor(is_string($data['author']) ? trim($data['author']) : '');
        }
        if (array_key_exists('rating', $data)) {
            $review->setRating(is_int($data['rating']) ? $data['rating'] : 0);
        }
        if (array_key_exists('comment', $data)) {
            $comment = is_string($data['comment']) ? trim($data['comment']) : '';
            $review->setComment($comment === '' ? null : $comment);
        }
        if (array_key_exists('productId', $data)) {
            $review->setProduct($this->products->find((int) $data['productId']));
        }

        $errors = $this->validate($review);

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

    // ---------- Validarea, pe baza regulilor din entitate ----------

    // Completează recenzia din JSON și o validează; întoarce erorile (câmp => mesaj).
    private function fill(Review $review, Request $request): array
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
        $comment = is_string($data['comment'] ?? null) ? trim($data['comment']) : '';
        $rating = is_int($data['rating'] ?? null) ? $data['rating'] : 0; // 0 = invalid

        $review->setAuthor($author)
            ->setRating($rating)
            ->setComment($comment === '' ? null : $comment)
            ->setProduct($this->products->find((int) ($data['productId'] ?? 0)));

        return $this->validate($review);
    }

    // Rulează Validator-ul; păstrează primul mesaj pentru fiecare câmp.
    private function validate(Review $review): array
    {
        $errors = [];

        foreach ($this->validator->validate($review) as $violation) {
            $errors[$violation->getPropertyPath()] ??= $violation->getMessage();
        }

        return $errors;
    }
}