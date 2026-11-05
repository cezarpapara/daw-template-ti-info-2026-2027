<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Toate rutele din acest controller incep cu /api/products
#[Route('/api/products')]
#[OA\Tag(name: 'Produse')]
class ProductController extends AbstractController
{
    // GET /api/products -> lista tuturor produselor
    #[Route('', name: 'product_list', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista produselor')]
    public function list(ProductRepository $productRepository): JsonResponse
    {
        $products = $productRepository->findAllWithCategory();

        return $this->json(array_map(fn (Product $product) => $product->toArray(), $products));
    }

    // GET /api/products/5 -> un singur produs, dupa id
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

    // POST /api/products -> adauga un produs nou
    #[Route('', name: 'product_create', methods: ['POST'])]
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
    #[OA\Response(response: 400, description: 'Date invalide')]
    public function create(
        Request $request,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true) ?? [];

        $name = trim($data['name'] ?? '');
        $price = $data['price'] ?? null;
        $category = $categoryRepository->find($data['categoryId'] ?? 0);

        // Validari simple
        if ($name === '') {
            return $this->json(['error' => 'Numele produsului este obligatoriu.'], Response::HTTP_BAD_REQUEST);
        }
        if (!is_numeric($price) || $price < 0) {
            return $this->json(['error' => 'Pretul trebuie sa fie un numar pozitiv.'], Response::HTTP_BAD_REQUEST);
        }
        if ($category === null) {
            return $this->json(['error' => 'Categoria aleasa nu exista.'], Response::HTTP_BAD_REQUEST);
        }

        $product = new Product();
        $product->setName($name);
        $product->setDescription(trim($data['description'] ?? '') ?: null);
        $product->setPrice(number_format((float) $price, 2, '.', ''));
        $product->setCategory($category);

        $entityManager->persist($product);
        $entityManager->flush();

        return $this->json($product->toArray(), Response::HTTP_CREATED);
    }

    // DELETE /api/products/5 -> sterge un produs
    #[Route('/{id}', name: 'product_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    #[OA\Response(response: 204, description: 'Produsul a fost sters')]
    #[OA\Response(response: 404, description: 'Produsul nu exista')]
    public function delete(int $id, ProductRepository $productRepository, EntityManagerInterface $entityManager): Response
    {
        $product = $productRepository->find($id);

        if ($product === null) {
            return $this->json(['error' => 'Produsul nu exista.'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($product);
        $entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
