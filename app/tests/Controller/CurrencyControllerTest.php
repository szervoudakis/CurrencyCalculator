<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\User;

class CurrencyControllerTest extends WebTestCase
{
    public function testGetCurrencies()
    {
        $client = static::createClient();

        // Πάρε container
        $container = static::getContainer();

        // Δημιούργησε έναν fake χρήστη για test
        $user = new User();
        $user->setUsername('testuser');
        $user->setPassword('password');

        $em = $container->get('doctrine')->getManager();
        $em->persist($user);
        $em->flush();

        // Δημιούργησε JWT token
        $jwtManager = $container->get('lexik_jwt_authentication.jwt_manager');
        $token = $jwtManager->create($user);

        // Κάνε request με Authorization header
        $client->request('GET', '/api/currencies', [], [], [
            'HTTP_Authorization' => 'Bearer ' . $token,
        ]);

        // Assertions
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/json');
    }
}
