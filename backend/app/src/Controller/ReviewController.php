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
        'productId' => 1
    ];
    public function __construct(
        private EntityManagerInterface $em,
        private ReviewRepository $reviews,
        private ProductRepository $products,
        private ValidatorInterface $validator
    ) {}
    #[Route('/api/reviews', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);
        return $this->json(array_map(fn(Review $r) => $r->toArray(), $items));
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
        return $this->json(array_map(fn(Review $r) => $r->toArray(), $items));
    }
    #[route('/api/products/{id<\d+>}/rating', methods: ['GET'])]
    public function rating(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }
        $reviews = $this->reviews->findBy(['product' => $product]);
        $count = count($reviews);
        $average = $count > 0
            ? round(array_sum(array_map(
                fn(Review $review): int => $review->getRating() ?? 0,
                $reviews
            )) / $count, 2)
            : 0;

        return $this->json([
            'productId' => $product->getId(),
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
        $this->em->persist($review); // obiect nou, de salvat
        $this->em->flush(); // trimite INSERT la PostgreSQL
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
    public function patch(int $id, Request $request): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }
        $errors = $this->patchFields($review, $request);
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
        $errors = [];
        foreach ($this->validator->validate($review) as $violation) {
            $errors[$violation->getPropertyPath()] = $violation->getMessage();
        }
        return $errors;
    }
    // Verifică JSON-ul și completează recenzia; întoarce erorile (câmp => mesaj).
    // private function fill(Review $review, Request $request): array
    // {
    //     try {
    //         $data = $request->toArray();
    //     } catch (JsonException) {
    //         return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
    //     }
    //     $errors = [];
    //     $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
    //     if ($author === '' || mb_strlen($author) > 100) {
    //         $errors['author'] = 'Autorul este obligatoriu (cel mult 100 de caractere).';
    //     }
    //     $rating = $data['rating'] ?? null;
    //     if (!is_int($rating) || $rating < 1 || $rating > 5) {
    //         $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
    //     }
    //     $product = $this->products->find((int) ($data['productId'] ?? 0));
    //     if (!$product) {
    //         $errors['productId'] = 'Produsul indicat nu există.';
    //     }
    //     if ($errors) {
    //         return $errors;
    //     }
    //     $comment = is_string($data['comment'] ?? null) ? trim($data['comment']) : '';
    //     $review->setAuthor($author)
    //         ->setRating($rating)
    //         ->setComment($comment === '' ? null : $comment)
    //         ->setProduct($product);
    //     return [];
    // }

    private function patchFields(Review $review, Request $request): array
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        $errors = [];
        $author = null;
        if (array_key_exists('author', $data)) {
            $author = is_string($data['author']) ? trim($data['author']) : '';
            if ($author === '' || mb_strlen($author) > 100) {
                $errors['author'] = 'Autorul este obligatoriu (cel mult 100 de caractere).';
            }
        }

        $rating = null;
        if (array_key_exists('rating', $data)) {
            $rating = $data['rating'];
            if (!is_int($rating) || $rating < 1 || $rating > 5) {
                $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
            }
        }

        $product = null;
        if (array_key_exists('productId', $data)) {
            if (!is_int($data['productId']) || $data['productId'] < 1) {
                $errors['productId'] = 'Produsul indicat nu există.';
            } else {
                $product = $this->products->find($data['productId']);
                if (!$product) {
                    $errors['productId'] = 'Produsul indicat nu există.';
                }
            }
        }

        $comment = null;
        if (array_key_exists('comment', $data)) {
            if ($data['comment'] !== null && !is_string($data['comment'])) {
                $errors['comment'] = 'Comentariul trebuie să fie un șir de caractere sau null.';
            } else {
                $comment = $data['comment'] === null ? null : trim($data['comment']);
            }
        }

        if ($errors) {
            return $errors;
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
            $review->setComment($comment);
        }

        return [];
    }
}
