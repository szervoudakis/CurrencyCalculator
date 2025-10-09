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

}
