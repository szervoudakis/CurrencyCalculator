<?php

namespace App\Tests\Service;

use App\Entity\Currency;
use App\Repository\CurrencyRepository;
use App\Services\CurrencyService;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Component\Cache\Adapter\ArrayAdapter;

class CurrencyServiceTest extends TestCase
{
    private $currencyRepo;
    private $cache;
    private $service;

    protected function setUp(): void
    {
        $this->currencyRepo = $this->createMock(CurrencyRepository::class);
        $this->cache = new ArrayAdapter();
        $this->service = new CurrencyService($this->currencyRepo, $this->cache);
    }

    public function testCreateCurrency(): void
    {
        //create instance for currency
        $currency = new Currency();
        $currency->setName('Euro');
        $currency->setCode('EUR');

        $this->currencyRepo
            ->expects($this->once())
            ->method('create')
            ->with('Euro', 'EUR')
            ->willReturn($currency);
        

        $result = $this->service->createCurrency('Euro', 'EUR');

        $this->assertInstanceOf(Currency::class, $result);
        $this->assertSame('Euro', $result->getName());
        $this->assertSame('EUR', $result->getCode());
    }

    

    
}
