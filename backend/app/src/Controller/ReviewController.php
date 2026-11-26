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

    #[Route('/api/reviews', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);

        return $this->json(
            array_map(fn (Review $r) => $r->toArray(), $items)
        );
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

        $items = $this->reviews->findBy(
            ['product' => $product],
            ['createdAt' => 'DESC']
        );

        return $this->json(
            array_map(fn (Review $r) => $r->toArray(), $items)
        );
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

    #[Route('/api/reviews/{id<\d+>}', methods: ['PATCH'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: ['rating' => 5]))]
    public function patch(int $id, Request $request): JsonResponse
    {
        $review = $this->reviews->find($id);

        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return $this->json([
                'error' => 'Corpul cererii trebuie să fie un obiect JSON valid.',
            ], 400);
        }

        if (!$data) {
            return $this->json([
                'error' => 'Trebuie să transmiți cel puțin un câmp.',
            ], 400);
        }

        $errors = [];

        if (array_key_exists('author', $data)) {
            $author = is_string($data['author'])
                ? trim($data['author'])
                : '';

            if ($author === '' || mb_strlen($author) < 2 || mb_strlen($author) > 100) {
                $errors['author'] = 'Numele trebuie să aibă între 2 și 100 de caractere.';
            } else {
                $review->setAuthor($author);
            }
        }

        if (array_key_exists('rating', $data)) {
            $rating = $data['rating'];

            if (!is_int($rating) || $rating < 1 || $rating > 5) {
                $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
            } else {
                $review->setRating($rating);
            }
        }

        if (array_key_exists('comment', $data)) {
            $comment = $data['comment'];

            if ($comment !== null && !is_string($comment)) {
                $errors['comment'] = 'Comentariul trebuie să fie text sau null.';
            } elseif (is_string($comment) && mb_strlen(trim($comment)) > 1000) {
                $errors['comment'] = 'Comentariul poate avea cel mult 1000 de caractere.';
            } else {
                $review->setComment(
                    $comment === null || trim($comment) === ''
                        ? null
                        : trim($comment)
                );
            }
        }

        if (array_key_exists('productId', $data)) {
            $productId = $data['productId'];

            if (!is_int($productId) || $productId < 1) {
                $errors['productId'] = 'ID-ul produsului trebuie să fie un număr întreg pozitiv.';
            } else {
                $product = $this->products->find($productId);

                if (!$product) {
                    $errors['productId'] = 'Produsul indicat nu există.';
                } else {
                    $review->setProduct($product);
                }
            }
        }

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

    private function fill(Review $review, Request $request): array
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return [
                'body' => 'Corpul cererii trebuie să fie un obiect JSON valid.',
            ];
        }

        $author = is_string($data['author'] ?? null)
            ? trim($data['author'])
            : '';

        $comment = is_string($data['comment'] ?? null)
            ? trim($data['comment'])
            : '';

        $rating = is_int($data['rating'] ?? null)
            ? $data['rating']
            : 0;

        $product = $this->products->find(
            (int) ($data['productId'] ?? 0)
        );

        $review
            ->setAuthor($author)
            ->setRating($rating)
            ->setComment($comment === '' ? null : $comment)
            ->setProduct($product);

        $errors = [];

        foreach ($this->validator->validate($review) as $violation) {
            $field = $violation->getPropertyPath();
            $errors[$field] = $violation->getMessage();
        }

        return $errors;
    }
}
