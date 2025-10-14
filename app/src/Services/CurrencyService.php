<?php

namespace App\Services;

use App\Entity\Currency;
use App\Repository\CurrencyRepository;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface; 


class CurrencyService{

    private CurrencyRepository $currencyRepo;
    private CacheInterface $cache;

    public function __construct(CurrencyRepository $currencyRepo, CacheInterface $cache)
    {
        $this->currencyRepo = $currencyRepo;
        $this->cache = $cache;
    }

    //retrun currencies with pagination
    public function getCurrencies(int $page = 1, int $limit = 10):array{
       //every page has specific cacheKey
       $cacheKey = sprintf('currencies_page_%d_limit_%d', $page, $limit);

        return $this->cache->get($cacheKey, function (ItemInterface $item) use ($page, $limit) {
            $item->expiresAfter(600);
            return $this->currencyRepo->findPaginated($page, $limit);
        });


    }
    //create currency
    public function createCurrency(string $name, string $code):Currency{
        $currency = $this->currencyRepo->create($name, $code);
        $this->invalidateCache();
        return $currency;
    }

    //update currencies
    public function updateCurrencies(Currency $currency):Currency{
        $updated=$this->currencyRepo->update($currency);
        $this->invalidateCache();

        return $updated;
    }

    //delete currency
    public function deleteCurrency(Currency $currency):void{
        $this->currencyRepo->delete($currency);
        $this->invalidateCache();
    }


    //clear all caches
    public function invalidateCache():void{
        $this->cache->clear();
    }

}