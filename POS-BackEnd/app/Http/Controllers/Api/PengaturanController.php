<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PengaturanController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'invoice_prefix' => Pengaturan::get('invoice_prefix', 'TRX-'),
                'tax_percent'    => (float) Pengaturan::get('tax_percent', 3),
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya admin yang bisa mengubah pengaturan.',
            ], 403);
        }

        $validated = $request->validate([
            'invoice_prefix' => 'sometimes|string|max:20',
            'tax_percent'    => 'sometimes|numeric|min:0|max:100',
        ]);

        foreach ($validated as $key => $value) {
            Pengaturan::set($key, $value);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan berhasil disimpan.',
            'data' => [
                'invoice_prefix' => Pengaturan::get('invoice_prefix', 'TRX-'),
                'tax_percent'    => (float) Pengaturan::get('tax_percent', 3),
            ],
        ]);
    }
}