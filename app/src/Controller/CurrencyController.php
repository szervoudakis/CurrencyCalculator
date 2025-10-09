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

#[Route('/api/currencies')]
class CurrencyController extends AbstractController
{
    private CurrencyRepository $currencyRepo;
    private CacheInterface $cache;
    
     public function __construct(CurrencyRepository $currencyRepo, CacheInterface $cache)
    {
        $this->currencyRepo = $currencyRepo;
        $this->cache = $cache;
    }

    #[Route('', name: 'currency_index', methods:['GET'])]
    public function index(Request $request): JsonResponse
    {

        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, max(1, (int)$request->query->get('limit',10)));
        
        $cacheKey=sprintf('currencies_page_%d_limit_%d', $page, $limit);
        //cache results for 10 min
        $result = $this->cache->get($cacheKey, function (ItemInterface $item) use ($page, $limit) {
            $item->expiresAfter(600);
            return $this->currencyRepo->findPaginated($page, $limit);
        });


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

    #[Route('', name: 'currency_create', methods:['POST'])]
    public function create (Request $request) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['name'], $data['code'])) {
            return $this->json(['error' => 'Name and code are required'], 400);
        }

        //add currency->>db
        $currency = $this->currencyRepo->create($data['name'],$data['code']);

        //clear cache
        $this->cache->clear();  //clear all cache

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
    public function delete(Currency $currency): JsonResponse{
        if(!$currency){
            return $this->json(['error' => 'Currency not found'], 404);
        }
        $this->currencyRepo->delete($currency);

        // Invalidate cache after delete
        $this->cache->clear();

        return $this->json(['message' => 'Currency deleted successfully']);
    }

    #[Route('/{id}', name: 'currency_update', methods:['PUT'])]
    public function updateCurrency(Request $request, Currency $currency): JsonResponse{
        
        if(!$currency){
           return $this->json(['error' => 'Currency not found'], 404); 
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['name'], $data['code'])) {
            return $this->json(['error' => 'Name and code are required'], 400);
        }

        if (isset($data['name'])) {
            $currency->setName($data['name']);
        }

        if (isset($data['code'])) {
            $currency->setCode(strtoupper($data['code']));
        }

        $this->currencyRepo->update($currency);

        $this->cache->clear();

        return $this->json([
            'message' => 'Currency updated successfully',
            'currency' => [
                'id' => $currency->getId(),
                'name' => $currency->getName(),
                'code' => $currency->getCode(),
            ]
        ]);
    }

}
