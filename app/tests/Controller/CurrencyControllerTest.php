<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\User;

class CurrencyControllerTest extends WebTestCase
{

    protected static function getKernelClass(): string
    {
        return \App\Kernel::class;
    }

    public function testGetCurrencies()
    {
        $client = static::createClient();

        $container = static::getContainer();
        $randomNum = rand(1000, 9999);
        //create fake user
        $user = new User();
        $user->setUsername('testuser'.$randomNum);
        $user->setPassword('password');

        $em = $container->get('doctrine')->getManager();
        $em->persist($user);
        $em->flush();

        // create JWT token
        $jwtManager = $container->get('lexik_jwt_authentication.jwt_manager');
        $token = $jwtManager->create($user);

        // create request with Authorization header
        $client->request('GET', '/api/currencies', [], [], [
            'HTTP_Authorization' => 'Bearer ' . $token,
        ]);

        // Assertions
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/json');
    }
}
