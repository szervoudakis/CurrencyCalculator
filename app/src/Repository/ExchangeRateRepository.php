<?php

namespace App\Repository;

use App\Entity\ExchangeRate;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @extends ServiceEntityRepository<ExchangeRate>
 */
class ExchangeRateRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $em;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $em)
    {
        parent::__construct($registry, ExchangeRate::class);

        $this->em=$em;
    }
    //create exchange existing rate
    public function create(ExchangeRate $rate): ExchangeRate 
    {
        $this->em->persist($rate);
        $this->em->flush();

        return $rate;
    }
     //update exchange existing rate 
     public function update(ExchangeRate $rate): ExchangeRate 
    {
        $this->em->persist($rate);
        $this->em->flush();

        return $rate;
    }
    //delete exchange rate
    public function delete(ExchangeRate $rate): void
    {
        $this->em->remove($rate);
        $this->em->flush();
    }
    //check if base and target currency exists
    public function findByCurrencies(int $baseId, int $targetId): ?ExchangeRate
    {
        return $this->createQueryBuilder('r')
        ->where('r.baseCurrency = :base')
        ->andWhere('r.targetCurrency = :target')
        ->setParameter('base', $baseId)
        ->setParameter('target', $targetId)
        ->getQuery()
        ->getOneOrNullResult();
    }
    //pagination for exchanges
    public function findPaginated(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;

        $qb = $this->createQueryBuilder('r')
            ->leftJoin('r.baseCurrency', 'base')  //we want to take the basecurrency value 
            ->addSelect('base')
            ->leftJoin('r.targetCurrency', 'target') //we want to take the targetcurrency value
            ->addSelect('target')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->orderBy('r.id', 'ASC');

        $items = $qb->getQuery()->getResult();
        $total = $this->count([]);

        return [
            'items' => $items,
            'total' => $total,
        ];
    }

    
}
