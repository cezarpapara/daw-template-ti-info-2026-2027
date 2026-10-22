<?php

namespace App\Controller;

use App\Dto\RegisterInput;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// Inregistrare, utilizatorul curent si delogare.
// Login-ul (POST /api/auth/login) este tratat direct de Symfony (vezi config/packages/security.yaml).
#[Route('/api/auth')]
#[OA\Tag(name: 'Autentificare')]
class AuthController extends AbstractController
{
    // POST /api/auth/register -> creeaza un cont nou (intotdeauna cu rolul ROLE_USER)
    #[Route('/register', name: 'auth_register', methods: ['POST'])]
    #[OA\Response(response: 201, description: 'Contul a fost creat')]
    #[OA\Response(response: 409, description: 'Email-ul este deja folosit')]
    #[OA\Response(response: 422, description: 'Date invalide')]
    #[OA\Response(response: 429, description: 'Prea multe incercari')]
    public function register(
        #[MapRequestPayload] RegisterInput $input,
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        #[Autowire(service: 'limiter.registration')] RateLimiterFactoryInterface $registrationLimiter,
    ): JsonResponse {
        // limiteaza numarul de conturi create de pe aceeasi adresa IP
        $limit = $registrationLimiter->create($request->getClientIp())->consume();
        if (!$limit->isAccepted()) {
            throw new TooManyRequestsHttpException($limit->getRetryAfter()->getTimestamp() - time());
        }

        if ($userRepository->findOneBy(['email' => mb_strtolower($input->email)]) !== null) {
            return $this->json(['error' => 'Exista deja un cont cu acest email.'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($input->email);
        // rolul NU vine din cerere: altfel oricine si-ar putea da singur ROLE_ADMIN
        $user->setRoles([]);
        $user->setPassword($passwordHasher->hashPassword($user, $input->password));

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json($user->toArray(), Response::HTTP_CREATED);
    }

    // POST /api/auth/login -> ruta exista doar ca Symfony sa o recunoasca;
    // cererea este interceptata si tratata de firewall-ul "login" (json_login + JWT)
    #[Route('/login', name: 'auth_login', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['email', 'password'],
            properties: [
                new OA\Property(property: 'email', type: 'string', example: 'student@exemplu.ro'),
                new OA\Property(property: 'password', type: 'string', example: 'Parola-Sigura-2026'),
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Autentificat; token-ul JWT este pus in cookie-ul BEARER')]
    #[OA\Response(response: 401, description: 'Email sau parola gresita')]
    #[OA\Response(response: 429, description: 'Prea multe incercari')]
    public function login(): never
    {
        throw new \LogicException('Aceasta metoda nu se executa: login-ul este tratat de firewall.');
    }

    // GET /api/auth/me -> utilizatorul autentificat (frontend-ul il foloseste la pornire)
    #[Route('/me', name: 'auth_me', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    #[OA\Response(response: 200, description: 'Utilizatorul curent')]
    #[OA\Response(response: 401, description: 'Neautentificat')]
    public function me(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json($user->toArray());
    }

    // POST /api/auth/logout -> sterge cookie-ul cu token-ul (httpOnly, deci JavaScript nu il poate sterge)
    #[Route('/logout', name: 'auth_logout', methods: ['POST'])]
    #[OA\Response(response: 204, description: 'Delogat')]
    public function logout(#[Autowire('%env(bool:JWT_COOKIE_SECURE)%')] bool $secureCookie): Response
    {
        $response = new Response(null, Response::HTTP_NO_CONTENT);
        $response->headers->clearCookie('BEARER', '/', null, $secureCookie, true, Cookie::SAMESITE_STRICT);

        return $response;
    }
}
