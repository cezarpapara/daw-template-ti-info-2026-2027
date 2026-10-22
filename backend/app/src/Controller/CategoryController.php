<?php

namespace App\Controller;

use App\Dto\CategoryInput;
use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// Toate rutele din acest controller incep cu /api/categories
#[Route('/api/categories')]
#[OA\Tag(name: 'Categorii')]
class CategoryController extends AbstractController
{
    // GET /api/categories -> lista tuturor categoriilor (publica)
    #[Route('', name: 'category_list', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista categoriilor')]
    public function list(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findBy([], ['name' => 'ASC']);

        return $this->json(array_map(fn (Category $category) => $category->toArray(), $categories));
    }

    // POST /api/categories -> adauga o categorie noua (doar administratorii)
    #[Route('', name: 'category_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name'],
            properties: [new OA\Property(property: 'name', type: 'string', example: 'Jucarii')]
        )
    )]
    #[OA\Response(response: 201, description: 'Categoria a fost creata')]
    #[OA\Response(response: 403, description: 'Doar administratorii pot adauga categorii')]
    #[OA\Response(response: 409, description: 'Categoria exista deja')]
    #[OA\Response(response: 422, description: 'Date invalide')]
    public function create(
        #[MapRequestPayload] CategoryInput $input,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $name = trim($input->name);

        if ($categoryRepository->findOneBy(['name' => $name]) !== null) {
            return $this->json(['error' => 'Exista deja o categorie cu acest nume.'], Response::HTTP_CONFLICT);
        }

        $category = new Category();
        $category->setName($name);

        $entityManager->persist($category); // pregateste salvarea
        $entityManager->flush();            // executa INSERT in baza de date

        return $this->json($category->toArray(), Response::HTTP_CREATED);
    }
}
