<?php

namespace App\Support;

class CartItemMerger
{
    /**
     * Merge duplicate cart items by SKU and sum their quantities.
     *
     * @param array<int, array<string, mixed>> $items
     * @return array<int, array<string, mixed>>
     */
    public function merge(array $items): array
    {
        $merged = [];

        foreach ($items as $item) {
            $sku = $item['sku'] ?? null;

            if ($sku === null || $sku === '') {
                continue;
            }

            $key = $sku;

            if (! isset($merged[$key])) {
                $merged[$key] = [
                    'sku' => $sku,
                    'kuantitas' => (int) ($item['kuantitas'] ?? 0),
                    'harga_satuan' => $item['harga_satuan'] ?? null,
                ];

                continue;
            }

            $merged[$key]['kuantitas'] += (int) ($item['kuantitas'] ?? 0);
        }

        return array_values($merged);
    }
}
