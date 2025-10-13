<?php
namespace App\MessageHandler;

use App\Message\UpdateExchangeRateMessage;
use App\Repository\ExchangeRateRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Services\ExchangeRateService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateExchangeRateMessageHandler
{
    public function __construct(
        private ExchangeRateRepository $repo,
        private EntityManagerInterface $em,
        private ExchangeRateService $service
    ) {}

    public function __invoke(UpdateExchangeRateMessage $message): void
    {
        $rate = $this->repo->find($message->exchangeRateId);
        if (!$rate) return;

        $this->service->updateRate($rate, $message->newRate);
    }
}