<?php

namespace App\Controller;

use App\Entity\ExchangeRate;
use App\Repository\ExchangeRateRepository;
use App\Repository\CurrencyRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


#[Route('/api/exchange-rates')]
class ExchangeRateController extends AbstractController
{
    private ExchangeRateRepository $rateRepo;
    private CurrencyRepository $currencyRepo;

    public function __construct(ExchangeRateRepository $rateRepo, CurrencyRepository $currencyRepo)
    {
        $this->rateRepo = $rateRepo;
        $this->currencyRepo = $currencyRepo;
    }

    #[Route ('/{id}' , name: 'exchange_rate_update', methods: ['PUT'])]
    public function update(Request $request, ?ExchangeRate $exchangeRate): JsonResponse
    {
       if(!$exchangeRate){
        return $this->json(['error' => 'Exchange rate not found'], 404);
       }
      
       $data = json_decode($request->getContent(), true);

       if (!isset($data['rate']) || !is_numeric($data['rate'])) {
            return $this->json(['error' => 'Valid rate is required'], 400);
       }

       $exchangeRate->setRate((float) $data['rate']);
       $this->rateRepo->update($exchangeRate);

       //return the correct object in json
           return $this->json([
            'message' => 'Exchange rate updated successfully',
                'rate' => [
                    'id' => $exchangeRate->getId(),
                    'base' => $exchangeRate->getBaseCurrency()->getCode(),
                    'target' => $exchangeRate->getTargetCurrency()->getCode(),
                    'value' => $exchangeRate->getRate(),
                ]
            ]);
         
    }

    #[Route('', name: 'exchange_rate_create', methods:['POST'])]
    public function create (Request $request) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if(!isset($data['baseCurrency'], $data['targetCurrency'], $data['rate'])) {
            return $this->json(['error' => 'Base currency and Target Currency are required'], 400);
        }

        $base = $this->currencyRepo->find($data['baseCurrency']);
        $target = $this->currencyRepo->find($data['targetCurrency']);
         
        if(!$base || !$target){
            return $this->json(['error' => 'Invalid currency IDs provided'], 404);
        }

        $rate = new ExchangeRate();
        $rate->setBaseCurrency($base);
        $rate->setTargetCurrency($target);
        $rate->setRate((float) $data['rate']);

        $this->rateRepo->create($rate);

        return $this->json([
            'message' => 'Exchange rate created successfully',
            'rate' => [
                'id' => $rate->getId(),
                'base' => $base->getCode(),
                'target' => $target->getCode(),
                'value' => $rate->getRate(),
            ]
        ], 201);//created suscessfully
    }

    #[Route('', name: 'exchange_rate_index' , methods:['GET'])]
    public function index(): JsonResponse
    {   
        $rates=$this->rateRepo->findAll();
        
        $data = array_map(fn($r) => [
            'id' => $r->getId(),
            'base' => $r->getBaseCurrency()->getCode(),
            'target' => $r->getTargetCurrency()->getCode(),
            'rate' => $r->getRate(),
        ], $rates);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'exchange_rate_delete', methods: ['DELETE'])]
    public function delete(?ExchangeRate $rate): JsonResponse
    {
        if(!$rate){
            return $this->json(['error' => 'Exchange Rate not found'], 404);
        }

        $this->rateRepo->delete($rate);
        return $this->json(['message' => 'Exchange rate deleted successfully']);
    }
}
