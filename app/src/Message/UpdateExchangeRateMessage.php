<?php

namespace App\Message;

class UpdateExchangeRateMessage
{
    public function __construct(
        public int $exchangeRateId,
        public float $newRate
    ) {}
}
