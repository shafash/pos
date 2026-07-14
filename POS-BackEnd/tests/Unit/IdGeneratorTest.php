<?php

namespace Tests\Unit;

use App\Support\IdGenerator;
use Tests\TestCase;

class IdGeneratorTest extends TestCase
{
    public function test_it_generates_member_ids_with_expected_format(): void
    {
        $generator = new IdGenerator();

        $id = $generator->memberId();

        $this->assertMatchesRegularExpression('/^MBR-[A-Z0-9]{8}$/', $id);
    }

    public function test_it_generates_unique_ids_for_transactions_and_products(): void
    {
        $generator = new IdGenerator();
        $ids = [];

        for ($i = 0; $i < 100; $i++) {
            $ids[] = $generator->transaksiNo();
            $ids[] = $generator->produkSku('Sample Brand');
        }

        $this->assertCount(200, array_unique($ids));
    }
}
