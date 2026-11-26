<?php

namespace App\Controller;

use App\Entity\Product;
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

    #[Route('/api/reviews', name: 'review_list', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Toate recenziile, cele mai noi primele')]
    public function list(): JsonResponse
    {
        return $this->json(array_map(fn (Review $review) => $review->toArray(), $this->reviews->findNewestWithProduct()));
    }

    #[Route('/api/reviews/{id<\d+>}', name: 'review_show', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Recenzia cerută')]
    #[OA\Response(response: 404, description: 'Recenzia nu există')]
    public function show(string $id): JsonResponse
    {
        $review = $this->findReview($id);
        if ($review === null) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        return $this->json($review->toArray());
    }

    #[Route('/api/products/{id<\d+>}/reviews', name: 'review_by_product', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista recenziilor produsului, posibil goală')]
    #[OA\Response(response: 404, description: 'Produsul nu există')]
    public function byProduct(string $id): JsonResponse
    {
        $product = $this->findProduct($id);
        if ($product === null) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }

        $items = $this->reviews->findNewestWithProduct($product);
        return $this->json(array_map(fn (Review $review) => $review->toArray(), $items));
    }

    #[Route('/api/products/{id<\d+>}/rating', name: 'review_product_rating', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Numărul recenziilor și media rotunjită la două zecimale; null dacă nu există recenzii')]
    #[OA\Response(response: 404, description: 'Produsul nu există')]
    public function rating(string $id): JsonResponse
    {
        $product = $this->findProduct($id);
        if ($product === null) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }

        $items = $this->reviews->findBy(['product' => $product]);
        $count = count($items);
        $sum = array_sum(array_map(fn (Review $review) => $review->getRating(), $items));

        return $this->json([
            'productId' => $product->getId(),
            'count' => $count,
            'average' => $count === 0 ? null : round($sum / $count, 2),
        ]);
    }

    #[Route('/api/reviews', name: 'review_create', methods: ['POST'])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(example: self::EXAMPLE))]
    #[OA\Response(response: 201, description: 'Recenzia creată; Location indică adresa ei')]
    #[OA\Response(response: 400, description: 'Obiect JSON invalid sau errors cu mesaje pe câmpuri')]
    public function create(Request $request): JsonResponse
    {
        $review = new Review();
        $errors = $this->fill($review, $request);
        if ($errors !== []) {
            return $this->json(['errors' => $errors], 400);
        }

        $this->em->persist($review);
        $this->em->flush();

        return $this->json($review->toArray(), 201, [
            'Location' => $this->generateUrl('review_show', ['id' => $review->getId()]),
        ]);
    }

    #[Route('/api/reviews/{id<\d+>}', name: 'review_update', methods: ['PUT'])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(example: self::EXAMPLE))]
    #[OA\Response(response: 200, description: 'Recenzia înlocuită; data inițială rămâne aceeași')]
    #[OA\Response(response: 400, description: 'Date invalide; recenzia existentă rămâne neschimbată')]
    #[OA\Response(response: 404, description: 'Recenzia nu există')]
    public function update(string $id, Request $request): JsonResponse
    {
        $review = $this->findReview($id);
        if ($review === null) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        // Validăm separat înainte să schimbăm obiectul urmărit de Doctrine.
        $replacement = new Review();
        $errors = $this->fill($replacement, $request);
        if ($errors !== []) {
            return $this->json(['errors' => $errors], 400);
        }

        $review->setAuthor($replacement->getAuthor())
            ->setRating($replacement->getRating())
            ->setComment($replacement->getComment())
            ->setProduct($replacement->getProduct());
        $this->em->flush();

        return $this->json($review->toArray());
    }

    #[Route('/api/reviews/{id<\d+>}', name: 'review_delete', methods: ['DELETE'])]
    #[OA\Response(response: 204, description: 'Recenzia a fost ștearsă; răspuns fără corp')]
    #[OA\Response(response: 404, description: 'Recenzia nu există')]
    public function delete(string $id): Response
    {
        $review = $this->findReview($id);
        if ($review === null) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        $this->em->remove($review);
        $this->em->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    /** Întoarce erorile ca perechi câmp => mesaj, pentru formularul React. */
    private function fill(Review $review, Request $request): array
    {
        try {
            $data = json_decode($request->getContent(), false, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }
        if (!$data instanceof \stdClass) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        $data = get_object_vars($data);
        $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
        $rating = is_int($data['rating'] ?? null) ? $data['rating'] : 0;
        $comment = is_string($data['comment'] ?? null) ? trim($data['comment']) : null;
        $productId = $data['productId'] ?? null;
        $product = is_int($productId) && $productId > 0 && $productId <= 2147483647
            ? $this->products->find($productId) : null;

        $review->setAuthor($author)
            ->setRating($rating)
            ->setComment($comment === '' ? null : $comment)
            ->setProduct($product);

        $errors = [];
        if (array_key_exists('comment', $data) && $data['comment'] !== null && !is_string($data['comment'])) {
            $errors['comment'] = 'Comentariul trebuie să fie text sau null.';
        }
        foreach ($this->validator->validate($review) as $violation) {
            // Păstrăm primul mesaj, de exemplu NotBlank înaintea Length.
            $errors[$violation->getPropertyPath()] ??= $violation->getMessage();
        }

        return $errors;
    }

    private function findReview(string $id): ?Review
    {
        $value = $this->databaseId($id);
        return $value === false ? null : $this->reviews->find($value);
    }

    private function findProduct(string $id): ?Product
    {
        $value = $this->databaseId($id);
        return $value === false ? null : $this->products->find($value);
    }

    private function databaseId(string $id): int|false
    {
        return filter_var($id, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 2147483647]]);
    }
}
