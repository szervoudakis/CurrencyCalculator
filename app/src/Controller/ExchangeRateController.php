<?php

namespace App\Controller;

use App\Entity\ExchangeRate;
use App\Repository\ExchangeRateRepository;
use App\Repository\CurrencyRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Services\ExchangeRateService;
use App\Message\UpdateExchangeRateMessage;
use Symfony\Component\Messenger\MessageBusInterface;

#[Route('/api/exchange-rates')]
class ExchangeRateController extends AbstractController
{
    private ExchangeRateRepository $rateRepo;
    private CurrencyRepository $currencyRepo;
    private ExchangeRateService $rateService; 

    public function __construct(ExchangeRateRepository $rateRepo, CurrencyRepository $currencyRepo, ExchangeRateService $rateService)
    {
        $this->rateRepo = $rateRepo;
        $this->currencyRepo = $currencyRepo;
        $this->rateService = $rateService;
    }

    //GET request get all exchange rates
    #[Route('', name: 'exchange_rate_index' , methods:['GET'])]
    public function index(Request $request): JsonResponse
    {   
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, max(1, (int)$request->query->get('limit', 10)));

        $result = $this->rateService->getRates($page, $limit);

        $rates = array_map(fn($r) => [
            'id' => $r->getId(),
            'base' => $r->getBaseCurrency()->getCode(),
            'target' => $r->getTargetCurrency()->getCode(),
            'rate' => $r->getRate(),
        ], $result['items']);

        $total = $result['total'];
        $pages = (int)ceil($total / $limit);

        return $this->json([
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => $pages,
            'data' => $rates,
        ]);
    }

     //CREATE post request (exchange rate)
    #[Route('', name: 'exchange_rate_create', methods:['POST'])]
    public function create (Request $request) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if(!isset($data['baseCurrency'], $data['targetCurrency'], $data['rate'])) {
            return $this->json(['error' => 'Base currency and Target Currency are required'], 400);
        }

        $base = $this->currencyRepo->find($data['baseCurrency']);
        $target = $this->currencyRepo->find($data['targetCurrency']);
        //check if base and target is correct
        if(!$base || !$target){
            return $this->json(['error' => 'Invalid currency IDs provided'], 404);
        }

        try {
          $rate = $this->rateService->createRate($base, $target, (float)$data['rate']);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 409);
        }
       
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

    //PUT request for update the rate
    #[Route ('/{id}' , name: 'exchange_rate_update', methods: ['PUT'])]
    public function update(Request $request, ?ExchangeRate $exchangeRate, MessageBusInterface $bus): JsonResponse
    {
       if(!$exchangeRate){
        return $this->json(['error' => 'Exchange rate not found'], 404);
       }
      
       $data = json_decode($request->getContent(), true);

       if (!isset($data['rate']) || !is_numeric($data['rate'])) {
            return $this->json(['error' => 'Valid rate is required'], 400);
       }

        $bus->dispatch(new UpdateExchangeRateMessage($exchangeRate->getId(), (float)$data['rate']));
        
        //return the correct object in json
        return $this->json([
          'message' => 'Exchange rate updated successfully',
        ]);
         
    }
      
    #[Route('/{id}', name: 'exchange_rate_show' , methods:['GET'])]
    public function show(int $id): JsonResponse
    {   
        $rate=$this->rateRepo->find($id);
        
        if (!$rate) {
            return $this->json([
                'error' => sprintf('Exchange Currency with id %d not found', $id)
            ], 404);
        }

        return $this->json([
            'id' => $rate->getId(),
            'rate' => $rate->getRate(),
            'target'=> $rate->getTargetCurrency(),
            'base'=> $rate->getBaseCurrency(),
        ]);

    }


    //delete specific exchange currency rate
    #[Route('/{id}', name: 'exchange_rate_delete', methods: ['DELETE'])]
    public function delete(?ExchangeRate $exchangeRate): JsonResponse
    {
        if (!$exchangeRate) {
            return $this->json(['error' => 'Exchange rate not found'], 404);
        }

        $this->rateService->deleteRate($exchangeRate);
        return $this->json(['message' => 'Exchange rate deleted successfully']);
    }
}
