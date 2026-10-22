<?php

namespace App\Controller;

use App\Dto\ProductInput;
use App\Entity\Product;
use App\Entity\User;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use App\Security\ProductVoter;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// Toate rutele din acest controller incep cu /api/products
#[Route('/api/products')]
#[OA\Tag(name: 'Produse')]
class ProductController extends AbstractController
{
    // GET /api/products -> lista tuturor produselor (publica)
    #[Route('', name: 'product_list', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista produselor')]
    public function list(ProductRepository $productRepository): JsonResponse
    {
        $products = $productRepository->findAllWithCategory();

        return $this->json(array_map(fn (Product $product) => $product->toArray(), $products));
    }

    // GET /api/products/5 -> un singur produs, dupa id (public)
    #[Route('/{id}', name: 'product_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    #[OA\Response(response: 200, description: 'Produsul cerut')]
    #[OA\Response(response: 404, description: 'Produsul nu exista')]
    public function show(int $id, ProductRepository $productRepository): JsonResponse
    {
        $product = $productRepository->find($id);

        if ($product === null) {
            return $this->json(['error' => 'Produsul nu exista.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($product->toArray());
    }

    // POST /api/products -> adauga un produs nou (doar utilizatorii autentificati)
    #[Route('', name: 'product_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name', 'price', 'categoryId'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Mouse wireless'),
                new OA\Property(property: 'description', type: 'string', example: 'Mouse optic, 1600 DPI'),
                new OA\Property(property: 'price', type: 'string', example: '59.90'),
                new OA\Property(property: 'categoryId', type: 'integer', example: 1),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Produsul a fost creat')]
    #[OA\Response(response: 401, description: 'Neautentificat')]
    #[OA\Response(response: 422, description: 'Date invalide')]
    public function create(
        #[MapRequestPayload] ProductInput $input,
        #[CurrentUser] User $user,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $product = new Product();
        $product->setOwner($user); // proprietarul vine din token, nu din cerere

        $error = $this->applyInput($product, $input, $categoryRepository);
        if ($error !== null) {
            return $error;
        }

        $entityManager->persist($product);
        $entityManager->flush();

        return $this->json($product->toArray(), Response::HTTP_CREATED);
    }

    // PUT /api/products/5 -> modifica un produs (doar proprietarul sau un admin)
    #[Route('/{id}', name: 'product_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
    #[OA\Response(response: 200, description: 'Produsul a fost modificat')]
    #[OA\Response(response: 403, description: 'Nu aveti dreptul sa modificati acest produs')]
    #[OA\Response(response: 404, description: 'Produsul nu exista')]
    public function update(
        int $id,
        #[MapRequestPayload] ProductInput $input,
        ProductRepository $productRepository,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $product = $productRepository->find($id);

        if ($product === null) {
            return $this->json(['error' => 'Produsul nu exista.'], Response::HTTP_NOT_FOUND);
        }

        $this->denyAccessUnlessGranted(ProductVoter::EDIT, $product);

        $error = $this->applyInput($product, $input, $categoryRepository);
        if ($error !== null) {
            return $error;
        }

        $entityManager->flush();

        return $this->json($product->toArray());
    }

    // DELETE /api/products/5 -> sterge un produs (doar proprietarul sau un admin)
    #[Route('/{id}', name: 'product_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    #[OA\Response(response: 204, description: 'Produsul a fost sters')]
    #[OA\Response(response: 403, description: 'Nu aveti dreptul sa stergeti acest produs')]
    #[OA\Response(response: 404, description: 'Produsul nu exista')]
    public function delete(int $id, ProductRepository $productRepository, EntityManagerInterface $entityManager): Response
    {
        $product = $productRepository->find($id);

        if ($product === null) {
            return $this->json(['error' => 'Produsul nu exista.'], Response::HTTP_NOT_FOUND);
        }

        $this->denyAccessUnlessGranted(ProductVoter::DELETE, $product);

        $entityManager->remove($product);
        $entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    // Copiaza datele validate din cerere in produs (folosit la creare si la modificare)
    private function applyInput(Product $product, ProductInput $input, CategoryRepository $categoryRepository): ?JsonResponse
    {
        $category = $categoryRepository->find($input->categoryId);
        if ($category === null) {
            return $this->json(['error' => 'Categoria aleasa nu exista.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $product->setName(trim($input->name));
        $product->setDescription(trim($input->description ?? '') ?: null);
        $product->setPrice(number_format((float) $input->price, 2, '.', ''));
        $product->setCategory($category);

        return null;
    }
}
