<?php

namespace App\Controller;

use App\Repository\ExchangeRateRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use App\Repository\CurrencyRepository;
use App\Repository\ExchangeCurrencyRepository;


#[Route('/api')]
class ConvertController extends AbstractController
{
    private CurrencyRepository $currencyRepo;
    private ExchangeRateRepository $rateRepo;
    private CacheInterface $cache;

    public function __construct(CurrencyRepository $currencyRepo,ExchangeRateRepository $rateRepo,CacheInterface $cache) {
        $this->currencyRepo = $currencyRepo;
        $this->rateRepo = $rateRepo;
        $this->cache = $cache;
    }


    #[Route('/convert', name: 'currency_convert' , methods: ['GET'])]
    public function convert(Request $request): JsonResponse
    {
        //take from url the parameters
       $fromCode= strtoupper($request->query->get('from'));
       $toCode= strtoupper($request->query->get('to'));
       $amount= (float) $request->query->get('amount', 0);

        //validation input
       if(!$fromCode || !$toCode || $amount <= 0){
          return $this->json(['error' => 'Invalid parameters. Example: /api/convert?from=EUR&to=USD&amount=100'], 400);
       }


       //to do cache
       $fromCurrency = $this->currencyRepo->findCurrency($fromCode);
       $toCurrency = $this->currencyRepo->findCurrency($toCode);
       //input validation to currency 
       if(!$fromCurrency || !$toCurrency){
        return $this->json([
            'error' => 'Invalid currency code provided'
        ]);
       }

       //input validation to exchange rates
       $rateEntity = $this->rateRepo->findByCurrencies($fromCurrency->getId() , $toCurrency->getId());
       if(!$rateEntity){
          return $this->json([
            'error' => sprintf('Exchange rate not found for %s → %s', $fromCode, $toCode)
          ]);
       }

       $converted = $amount * $rateEntity->getRate();


       //return object
       return $this->json([
                'from' => $fromCode,
                'to' => $toCode,
                'rate' => $rateEntity->getRate(),
                'amount' => $amount,
                'converted' => round($converted, 4)]);
    }
}
