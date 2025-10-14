<?php

namespace App\Services;

use App\Entity\ExchangeRate;
use App\Repository\ExchangeRateRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface; 

class ExchangeRateService
{
    private ExchangeRateRepository $rateRepo;
    private EntityManagerInterface $em;
    private CacheInterface $cache;

    public function __construct(ExchangeRateRepository $rateRepo,EntityManagerInterface $em,CacheInterface $cache) {
        $this->rateRepo = $rateRepo;
        $this->em = $em;
        $this->cache = $cache;
    }
    

    public function getRates(int $page = 1, int $limit = 10): array
    {
        $cacheKey = sprintf('exchange_rates_page_%d_limit_%d', $page, $limit);

        return $this->cache->get($cacheKey, function (ItemInterface $item) use ($page, $limit) {
            $item->expiresAfter(600); // 10 min cache
            return $this->rateRepo->findPaginated($page, $limit);
        });
    }

    public function createRate($baseCurrency, $targetCurrency, float $rate): ExchangeRate
    {
        $existing = $this->rateRepo->findByCurrencies(
            $baseCurrency->getId(),
            $targetCurrency->getId()
        );

        if ($existing) {
            throw new \Exception('Exchange rate already exists.');
        }

        $exchangeRate = new ExchangeRate();
        $exchangeRate->setBaseCurrency($baseCurrency);
        $exchangeRate->setTargetCurrency($targetCurrency);
        $exchangeRate->setRate($rate);

        $this->em->persist($exchangeRate);
        $this->em->flush();

        //clear cache because we have new version of exchange rates
        $this->cache->clear();

        return $exchangeRate;
    }

    public function updateRate(ExchangeRate $exchangeRate,float $newRate): ExchangeRate
    {
        //setRate because this function executed UpdateExchangeRateMessage 
        $exchangeRate->setRate($newRate);
        $this->em->persist($exchangeRate);
        $this->em->flush();

        $this->cache->clear();
        return $exchangeRate;
    }

    public function deleteRate(ExchangeRate $exchangeRate): void
    {
        $this->em->remove($exchangeRate);
        $this->em->flush();
        //clear cache because we have new version of exchange rates
         $this->cache->clear();
    }

    

}