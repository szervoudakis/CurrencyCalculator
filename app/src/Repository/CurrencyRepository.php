<?php

namespace App\Repository;

use App\Entity\Currency;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @extends ServiceEntityRepository<Currency>
 */
class CurrencyRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $em;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $em)
    {
        parent::__construct($registry, Currency::class);
        $this->em=$em;
    }
    //create new currency
    public function create(string $name, string $code):Currency
    {
        $currency = new Currency();
        $currency->setName($name);
        $currency->setCode(strtoupper($code));

        $this->em->persist($currency);
        $this->em->flush();

        return $currency;
    }
    //find all currencies (sort)
    public function findAllOrdered(): array
    {
        return $this->createQueryBuilder('c')
            ->orderBy('c.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
    //update currency with new info
    public function update(Currency $currency):Currency{

        $this->em->persist($currency);
        $this->em->flush();
       
        return $currency;
    }

    //delete currency 
    public function delete(Currency $currency):void{
        $this->em->remove($currency);
        $this->em->flush();
    }

    //pagination
    public function findPaginated(int $page=1, int $limit=10): array{
        $offset = ($page-1)* $limit;
        
        $query = $this->createQueryBuilder('c')
            ->orderBy('c.name', 'ASC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery();

        $items = $query->getResult();

        //we calculate the overall of pagination metada
        $total = $this->createQueryBuilder('c')
        ->select('COUNT(c.id)')
        ->getQuery()
        ->getSingleScalarResult();

        return [
            'items' => $items,
            'total' => (int)$total
        ];
    }
}
