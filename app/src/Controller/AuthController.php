<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthController extends AbstractController
{
    #[Route('/auth', name: 'app_auth')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/AuthController.php',
        ]);
    }

    #[Route('/api/register', name: 'api_register' , methods: ['POST'])]
    public function register( Request $request,EntityManagerInterface $em,UserPasswordHasherInterface $passwordHasher) : JsonResponse 
    {
        $data = json_decode($request->getContent(),true);
        
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;
        
        //if is empty send json message
        if(!$username || !$password){
            return $this->json(['error' => 'User and pass required!!'], 400);
        }
        
        //if user already exist send json message

        $existing = $em->getRepository(User::class)->findOneBy(['username' => $username]);
        if($existing){
        return $this->json(['error' => 'User already exist in db!!'], 400);
        }
        
        //create user inst
        $user = new User();
        $user->setUsername($username);
        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        $em->persist($user); //add user in db
        $em->flush();

        return $this->json(['message' => 'User registered successfully'], 201);
    }
    

    #[Route('/api/login', name: 'api_login' , methods: ['POST'])]
    public function login(Request $request,EntityManagerInterface $em,UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager) : JsonResponse
    {
        $data = json_decode($request->getContent(),true);
        
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;
        
        //if is empty send json message
        if(!$username || !$password){
            return $this->json(['error' => 'User and pass required!!'], 400);
        }

        //check credentilas
        $user=$em->getRepository(User::class)->findOneBy(['username'=>$username]);

        if(!$user || !$passwordHasher->isPasswordValid($user,$password)){
            throw new AuthenticationException('Invalid credentials.');
        }

        $token = $jwtManager->create($user);

        return $this->json([
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
            ],
        ]);
        
    }
}
