<?php

namespace App\Controller;

use App\Entity\Review;
use App\Repository\ProductRepository;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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

    #[Route('/api/reviews', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map(
            fn (Review $review) => $review->toArray(),
            $items,
        ));
    }

    #[Route('/api/reviews/{id<\d+>}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $review = $this->reviews->find($id);

        if ($review === null) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        return $this->json($review->toArray());
    }

    #[Route('/api/products/{id<\d+>}/reviews', methods: ['GET'])]
    public function byProduct(int $id): JsonResponse
    {
        $product = $this->products->find($id);

        if ($product === null) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }

        $items = $this->reviews->findBy(
            ['product' => $product],
            ['createdAt' => 'DESC'],
        );

        return $this->json(array_map(
            fn (Review $review) => $review->toArray(),
            $items,
        ));
    }

    #[Route('/api/products/{id<\d+>}/rating', methods: ['GET'])]
    public function rating(int $id): JsonResponse
    {
        $product = $this->products->find($id);

        if ($product === null) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }

        $items = $this->reviews->findBy(['product' => $product]);
        $count = count($items);
        $sum = 0;

        foreach ($items as $review) {
            $sum += $review->getRating();
        }

        return $this->json([
            'productId' => $id,
            'count' => $count,
            'average' => $count > 0 ? round($sum / $count, 2) : null,
        ]);
    }

    #[Route('/api/reviews', methods: ['POST'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: self::EXAMPLE))]
    public function create(Request $request): JsonResponse
    {
        $review = new Review();
        $errors = $this->fill($review, $request);

        if ($errors !== []) {
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

        if ($review === null) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        $errors = $this->fill($review, $request);

        if ($errors !== []) {
            return $this->json(['errors' => $errors], 400);
        }

        $this->em->flush();

        return $this->json($review->toArray());
    }

    #[Route('/api/reviews/{id<\d+>}', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $review = $this->reviews->find($id);

        if ($review === null) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        $this->em->remove($review);
        $this->em->flush();

        return new Response(null, 204);
    }

    private function fill(Review $review, Request $request): array
    {
        try {
            $data = json_decode($request->getContent(), flags: JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        if (!$data instanceof \stdClass) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        $errors = [];

        $author = is_string($data->author ?? null) ? trim($data->author) : '';
        if ($author === '' || mb_strlen($author) > 100) {
            $errors['author'] = 'Autorul este obligatoriu și poate avea cel mult 100 de caractere.';
        }

        $rating = $data->rating ?? null;
        if (!is_int($rating) || $rating < 1 || $rating > 5) {
            $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
        }

        $productId = $data->productId ?? null;
        $product = is_int($productId) && $productId > 0
            ? $this->products->find($productId)
            : null;

        if ($product === null) {
            $errors['productId'] = 'Produsul indicat nu există sau ID-ul este invalid.';
        }

        $comment = $data->comment ?? null;
        if ($comment !== null && !is_string($comment)) {
            $errors['comment'] = 'Comentariul trebuie să fie text sau null.';
        }

        if ($errors !== []) {
            return $errors;
        }

        $comment = trim($comment ?? '');

        $review->setAuthor($author)
            ->setRating($rating)
            ->setComment($comment === '' ? null : $comment)
            ->setProduct($product);

        return [];
    }
}