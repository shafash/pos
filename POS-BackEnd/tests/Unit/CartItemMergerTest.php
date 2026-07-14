<?php

namespace Tests\Unit;

use App\Support\CartItemMerger;
use Tests\TestCase;

class CartItemMergerTest extends TestCase
{
    public function test_it_merges_duplicate_items_by_sku_and_sums_quantities(): void
    {
        $merger = new CartItemMerger();

        $items = [
            ['sku' => 'SKU-001', 'kuantitas' => 2, 'harga_satuan' => 10000],
            ['sku' => 'SKU-002', 'kuantitas' => 1, 'harga_satuan' => 15000],
            ['sku' => 'SKU-001', 'kuantitas' => 3, 'harga_satuan' => 10000],
        ];

        $merged = $merger->merge($items);

        $this->assertSame([
            ['sku' => 'SKU-001', 'kuantitas' => 5, 'harga_satuan' => 10000],
            ['sku' => 'SKU-002', 'kuantitas' => 1, 'harga_satuan' => 15000],
        ], $merged);
    }
}
