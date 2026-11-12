<?php

namespace App\Controller;

use App\Entity\Review;
use App\Entity\User;
use App\Repository\ProductRepository;
use App\Repository\ReviewRepository;
use App\Security\ReviewVoter;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Laboratorul 08: API REST (CRUD) pentru recenzii.
 *
 * Resursa este /api/reviews (colectia) si /api/reviews/{id} (o recenzie); metoda HTTP spune ce facem:
 * GET citeste (200), POST creeaza (201), PUT inlocuieste, PATCH modifica partial (200), DELETE sterge (204).
 * La date gresite raspundem 400 cu un mesaj clar, iar la o resursa inexistenta 404.
 *
 * Securitate: citirea este publica. Scrierea cere un utilizator autentificat (access_control din
 * security.yaml), iar modificarea si stergerea sunt permise doar autorului sau unui admin (ReviewVoter).
 */
#[OA\Tag(name: 'Reviews')]
final class ReviewController extends AbstractController
{
    // exemplul de corp JSON pe care Swagger il completeaza la "Try it out"
    private const EXAMPLE = ['author' => 'Ana Popescu', 'rating' => 5, 'comment' => 'Recomand!', 'productId' => 1];

    // dependentele vin prin constructor (autowiring): repository-urile citesc, EntityManager scrie
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ReviewRepository $reviews,
        private readonly ProductRepository $products,
    ) {
    }

    // GET /api/reviews -> toate recenziile, cele mai noi primele
    #[Route('/api/reviews', name: 'review_list', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista recenziilor')]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    // GET /api/reviews/7 -> o singura recenzie.
    // {id<\d+>}: doar cifre. Exercitiul 1: la /api/reviews/abc ruta nu se potriveste, deci Symfony
    // raspunde 404 inainte sa ajunga in show(); nici nu ar avea ce face cu "abc" in loc de un int.
    #[Route('/api/reviews/{id<\d+>}', name: 'review_show', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Recenzia ceruta')]
    #[OA\Response(response: 404, description: 'Recenzia nu exista')]
    public function show(int $id): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu exista.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($review->toArray());
    }

    // GET /api/products/1/reviews -> recenziile unui produs
    #[Route('/api/products/{id<\d+>}/reviews', name: 'review_by_product', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Recenziile produsului')]
    #[OA\Response(response: 404, description: 'Produsul nu exista')]
    public function byProduct(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu exista.'], Response::HTTP_NOT_FOUND);
        }

        $items = $this->reviews->findBy(['product' => $product], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    // Exercitiul 2: GET /api/products/1/rating -> {"productId": 1, "count": 3, "average": 4.33}
    #[Route('/api/products/{id<\d+>}/rating', name: 'review_product_rating', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Numarul de recenzii si nota medie (null daca nu are recenzii)')]
    #[OA\Response(response: 404, description: 'Produsul nu exista')]
    public function rating(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu exista.'], Response::HTTP_NOT_FOUND);
        }

        // media se calculeaza in PHP, din lista primita de la findBy()
        $ratings = array_map(fn (Review $r) => $r->getRating(), $this->reviews->findBy(['product' => $product]));
        $count = count($ratings);

        return $this->json([
            'productId' => $product->getId(),
            'count' => $count,
            // fara recenzii nu exista o medie (impartire la 0), deci intoarcem null
            'average' => $count > 0 ? round(array_sum($ratings) / $count, 2) : null,
        ]);
    }

    // POST /api/reviews -> creeaza o recenzie; proprietarul ei devine utilizatorul autentificat
    #[Route('/api/reviews', name: 'review_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    #[OA\RequestBody(content: new OA\JsonContent(example: self::EXAMPLE))]
    #[OA\Response(response: 201, description: 'Recenzia a fost creata')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    #[OA\Response(response: 401, description: 'Neautentificat')]
    public function create(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        $review = new Review();
        $review->setOwner($user); // proprietarul vine din token, nu din corpul cererii

        $errors = $this->fill($review, $request);
        if ($errors) {
            return $this->invalid($errors);
        }

        $this->em->persist($review); // obiect nou, de salvat
        $this->em->flush();          // trimite INSERT la PostgreSQL

        return $this->json($review->toArray(), Response::HTTP_CREATED);
    }

    // PUT /api/reviews/7 -> inlocuieste TOATE campurile: author, rating si productId sunt obligatorii
    #[Route('/api/reviews/{id<\d+>}', name: 'review_update', methods: ['PUT'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: self::EXAMPLE))]
    #[OA\Response(response: 200, description: 'Recenzia a fost modificata')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    #[OA\Response(response: 403, description: 'Recenzia nu va apartine')]
    #[OA\Response(response: 404, description: 'Recenzia nu exista')]
    public function update(int $id, Request $request): JsonResponse
    {
        return $this->modify($id, $request, partial: false);
    }

    // Exercitiul 3: PATCH /api/reviews/7 -> modifica DOAR campurile prezente in JSON.
    // Diferenta fata de PUT: cu {"rating": 3}, PUT raspunde 400 (lipsesc author si productId),
    // iar PATCH schimba doar nota si pastreaza restul campurilor.
    #[Route('/api/reviews/{id<\d+>}', name: 'review_patch', methods: ['PATCH'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: ['rating' => 3]))]
    #[OA\Response(response: 200, description: 'Recenzia a fost modificata')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    #[OA\Response(response: 403, description: 'Recenzia nu va apartine')]
    #[OA\Response(response: 404, description: 'Recenzia nu exista')]
    public function patch(int $id, Request $request): JsonResponse
    {
        return $this->modify($id, $request, partial: true);
    }

    // DELETE /api/reviews/7 -> sterge recenzia
    #[Route('/api/reviews/{id<\d+>}', name: 'review_delete', methods: ['DELETE'])]
    #[OA\Response(response: 204, description: 'Recenzia a fost stearsa')]
    #[OA\Response(response: 403, description: 'Recenzia nu va apartine')]
    #[OA\Response(response: 404, description: 'Recenzia nu exista')]
    public function delete(int $id): Response
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu exista.'], Response::HTTP_NOT_FOUND);
        }

        $this->denyAccessUnlessGranted(ReviewVoter::DELETE, $review);

        $this->em->remove($review);
        $this->em->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    // Partea comuna pentru PUT si PATCH: gaseste recenzia, verifica dreptul, valideaza, salveaza
    private function modify(int $id, Request $request, bool $partial): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu exista.'], Response::HTTP_NOT_FOUND);
        }

        $this->denyAccessUnlessGranted(ReviewVoter::EDIT, $review);

        $errors = $this->fill($review, $request, $partial);
        if ($errors) {
            return $this->invalid($errors);
        }

        $this->em->flush(); // obiectul este deja urmarit de Doctrine: flush trimite UPDATE

        return $this->json($review->toArray());
    }

    // 400 Bad Request: "error" = primul mesaj (ca in restul API-ului), "errors" = cate un mesaj pe camp
    private function invalid(array $errors): JsonResponse
    {
        return $this->json(['error' => reset($errors), 'errors' => $errors], Response::HTTP_BAD_REQUEST);
    }

    /**
     * Validarea manuala, comuna pentru POST, PUT si PATCH: verifica JSON-ul si completeaza recenzia.
     * Intoarce erorile (camp => mesaj); daca exista vreo eroare, recenzia ramane neschimbata.
     * Cu $partial = true (PATCH) se verifica si se schimba doar campurile prezente in JSON.
     *
     * @return array<string, string>
     */
    private function fill(Review $review, Request $request, bool $partial = false): array
    {
        if ($request->getContentTypeFormat() !== 'json') {
            return ['body' => 'Cererea trebuie trimisa ca JSON (Content-Type: application/json).'];
        }

        try {
            $data = $request->toArray(); // JSON invalid, gol sau care nu este un obiect -> JsonException
        } catch (JsonException) {
            return ['body' => 'Corpul cererii trebuie sa fie un obiect JSON valid.'];
        }

        // la PUT/POST orice camp se verifica; la PATCH doar cele trimise
        $has = fn (string $field): bool => !$partial || array_key_exists($field, $data);
        $errors = [];

        $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
        if ($has('author') && ($author === '' || mb_strlen($author) > 100)) {
            $errors['author'] = 'Autorul este obligatoriu (cel mult 100 de caractere).';
        }

        // is_int: "4" (text) nu este acceptat, doar 4 (numar)
        $rating = $data['rating'] ?? null;
        if ($has('rating') && (!is_int($rating) || $rating < 1 || $rating > 5)) {
            $errors['rating'] = 'Nota trebuie sa fie un numar intreg intre 1 si 5.';
        }

        $product = $has('productId') ? $this->products->find((int) ($data['productId'] ?? 0)) : null;
        if ($has('productId') && !$product) {
            $errors['productId'] = 'Produsul indicat nu exista.';
        }

        $comment = is_string($data['comment'] ?? null) ? trim($data['comment']) : '';
        if ($has('comment') && mb_strlen($comment) > 2000) {
            $errors['comment'] = 'Comentariul poate avea cel mult 2000 de caractere.';
        }

        if ($errors) {
            return $errors;
        }

        if ($has('author')) {
            $review->setAuthor($author);
        }
        if ($has('rating')) {
            $review->setRating($rating);
        }
        if ($has('comment')) {
            $review->setComment($comment === '' ? null : $comment);
        }
        if ($has('productId')) {
            $review->setProduct($product);
        }

        return [];
    }
}
