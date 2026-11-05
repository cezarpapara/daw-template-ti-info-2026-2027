<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Toate rutele din acest controller incep cu /api/categories
#[Route('/api/categories')]
#[OA\Tag(name: 'Categorii')]
class CategoryController extends AbstractController
{
    // GET /api/categories -> lista tuturor categoriilor
    #[Route('', name: 'category_list', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista categoriilor')]
    public function list(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findBy([], ['name' => 'ASC']);

        return $this->json(array_map(fn (Category $category) => $category->toArray(), $categories));
    }

    // POST /api/categories -> adauga o categorie noua
    #[Route('', name: 'category_create', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name'],
            properties: [new OA\Property(property: 'name', type: 'string', example: 'Jucarii')]
        )
    )]
    #[OA\Response(response: 201, description: 'Categoria a fost creata')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $name = trim($data['name'] ?? '');

        if ($name === '') {
            return $this->json(['error' => 'Numele categoriei este obligatoriu.'], Response::HTTP_BAD_REQUEST);
        }

        $category = new Category();
        $category->setName($name);

        $entityManager->persist($category); // pregateste salvarea
        $entityManager->flush();            // executa INSERT in baza de date

        return $this->json($category->toArray(), Response::HTTP_CREATED);
    }
}
