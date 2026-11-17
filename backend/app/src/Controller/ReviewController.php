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

// API REST pentru recenzii: GET, POST, PUT, PATCH, DELETE
#[OA\Tag(name: 'Reviews')]
final class ReviewController extends AbstractController
{
    // Exemplu de corp JSON, afisat in Swagger la POST si PUT
    private const EXAMPLE = ['author' => 'Ana Popescu', 'rating' => 5,
        'comment' => 'Recomand!', 'productId' => 1];

    public function __construct(
        private EntityManagerInterface $em,
        private ReviewRepository $reviews,
        private ProductRepository $products,
        private ValidatorInterface $validator,
    ) {
    }

    // GET /api/reviews -> toate recenziile, cele mai noi primele
    #[Route('/api/reviews', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    // GET /api/reviews/7 -> o singura recenzie
    // {id<\d+>}: doar cifre. /api/reviews/abc nu se potriveste cu nicio ruta => 404 inainte de show()
    #[Route('/api/reviews/{id<\d+>}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        return $this->json($review->toArray());
    }

    // GET /api/products/1/reviews -> recenziile unui produs
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

    // Ex. 2: GET /api/products/1/rating -> numarul de recenzii si nota medie
    #[Route('/api/products/{id<\d+>}/rating', methods: ['GET'])]
    public function rating(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }

        $items = $this->reviews->findBy(['product' => $product]);
        $ratings = array_map(fn (Review $r) => $r->getRating(), $items);
        $count = count($ratings);

        return $this->json([
            'productId' => $product->getId(),
            'count' => $count,
            // fara recenzii nu exista medie (si nu impartim la 0)
            'average' => $count > 0 ? round(array_sum($ratings) / $count, 2) : null,
        ]);
    }

    // POST /api/reviews -> creeaza o recenzie
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

    // PUT /api/reviews/7 -> inlocuieste toate campurile recenziei
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

        $this->em->flush(); // obiectul exista deja: flush() trimite UPDATE

        return $this->json($review->toArray());
    }

    // Ex. 3: PATCH /api/reviews/7 -> modifica doar campurile trimise
    // Diferenta fata de PUT: cu {"rating": 3}, PUT raspunde 400 (lipsesc author si productId),
    // iar PATCH schimba doar nota si pastreaza restul campurilor.
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
            return $this->json(['errors' => ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.']], 400);
        }

        // Campurile care lipsesc din JSON pastreaza valorile actuale ale recenziei
        // (operatorul + adauga doar cheile care nu exista deja in $data)
        $data += [
            'author' => $review->getAuthor(),
            'rating' => $review->getRating(),
            'comment' => $review->getComment(),
            'productId' => $review->getProduct()?->getId(),
        ];

        $errors = $this->apply($review, $data);
        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }

        $this->em->flush();

        return $this->json($review->toArray());
    }

    // DELETE /api/reviews/7 -> sterge recenzia
    #[Route('/api/reviews/{id<\d+>}', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        $this->em->remove($review);
        $this->em->flush();

        return new Response(null, 204); // 204 No Content: fara corp
    }

    // Citeste JSON-ul cererii, completeaza recenzia si o valideaza (POST si PUT).
    // Intoarce erorile (camp => mesaj); lista goala inseamna ca totul e in regula.
    private function fill(Review $review, Request $request): array
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        return $this->apply($review, $data);
    }

    // Completează recenzia din date și o validează cu regulile #[Assert\...] din entitate.
    // Comuna pentru POST, PUT si PATCH (laboratorul 10: verificarile scrise de mana au disparut).
    private function apply(Review $review, array $data): array
    {
        $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
        $comment = is_string($data['comment'] ?? null) ? trim($data['comment']) : '';
        $rating = is_int($data['rating'] ?? null) ? $data['rating'] : 0; // 0 = invalid ("4" text nu e acceptat)

        $review->setAuthor($author)
            ->setRating($rating)
            ->setComment($comment === '' ? null : $comment)
            ->setProduct($this->products->find((int) ($data['productId'] ?? 0)));

        $errors = [];
        foreach ($this->validator->validate($review) as $violation) {
            // ??= pastreaza PRIMA eroare a fiecarui camp: pentru autorul gol ramane
            // "Autorul este obligatoriu." (NotBlank), nu si mesajul de lungime minima.
            $errors[$violation->getPropertyPath()] ??= $violation->getMessage();
        }

        return $errors;
    }
}
