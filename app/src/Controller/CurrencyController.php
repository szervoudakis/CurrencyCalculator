<?php

namespace App\Controller;

use App\Entity\Currency;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\CurrencyRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\CacheInterface;
use App\Services\CurrencyService;

#[Route('/api/currencies')]
class CurrencyController extends AbstractController
{
    private CurrencyRepository $currencyRepo;
    private CurrencyService $currencyService;
    
     public function __construct(CurrencyRepository $currencyRepo,CurrencyService $currencyService)
    {
        $this->currencyRepo = $currencyRepo;
        $this->currencyService = $currencyService;
    }

    #[Route('', name: 'currency_index', methods:['GET'])]
    public function index(Request $request): JsonResponse
    {

        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, max(1, (int)$request->query->get('limit',10)));
        
        $result = $this->currencyService->getCurrencies($page,$limit);

        $currencies = array_map(fn($c) => [
            'id' => $c->getId(),
            'name' => $c->getName(),
            'code' => $c->getCode(),
        ], $result['items']);

        $total = $result['total'];
        $pages = (int)ceil($total / $limit);

        return $this->json([
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => $pages,
            'data' => $currencies,
        ]);

    }

    #[Route('/{id}', name: 'currency_show', methods:['GET'])]
    public function show(int $id): JsonResponse
    {
        $currency = $this->currencyRepo->find($id);
        if (!$currency) {
            return $this->json([
                'error' => sprintf('Currency with id %d not found', $id)
            ], 404);
        }

        return $this->json([
            'id' => $currency->getId(),
            'name' => $currency->getName(),
            'code' => $currency->getCode()
        ]);
    }


    #[Route('', name: 'currency_create', methods:['POST'])]
    public function create (Request $request) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['name'], $data['code'])) {
            return $this->json(['error' => 'Name and code are required'], 400);
        }

        //check if currency exist
        $currency = $this->currencyRepo->findCurrency($data['code']);
        if ($currency) {
            return $this->json(['error' => 'Currency already exists'], 409);
        }

        //service to communicate with repo for creation currency and clear cache
        $currency = $this->currencyService->createCurrency($data['name'],$data['code']);

        return $this->json([
            'message' => 'Currency created successfully',
            'currency' => [
                'id' => $currency->getId(),
                'name' => $currency->getName(),
                'code' => $currency->getCode(),
            ]
        ], 201);
    }

    #[Route('/{id}', name: 'currency_delete', methods:['DELETE'])]
    public function delete(?Currency $currency): JsonResponse{
       
        if(!$currency){
            return $this->json(['error' => 'Currency not found'], 404);
        }
        
        $this->currencyService->deleteCurrency($currency);

        return $this->json(['message' => 'Currency deleted successfully']);
    }

    #[Route('/{id}', name: 'currency_update', methods:['PUT'])]
    public function updateCurrency(Request $request, ?Currency $currency): JsonResponse{
        
        if(!$currency){
           return $this->json(['error' => 'Currency not found'], 404); 
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['name'], $data['code'])) {
            return $this->json(['error' => 'Name and code are required'], 400);
        }

        if (isset($data['name'])) $currency->setName($data['name']);
            
        if (isset($data['code'])) $currency->setCode(strtoupper($data['code']));
        //service to communicate with repo and clear cache
        $updated=$this->currencyService->updateCurrencies($currency);

        return $this->json([
            'message' => 'Currency updated successfully',
            'currency' => [
                'id' =>  $updated->getId(),
                'name' =>  $updated->getName(),
                'code' =>  $updated->getCode(),
            ]
        ]);
    }

}
