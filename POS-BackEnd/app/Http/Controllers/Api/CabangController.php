<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cabang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CabangController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Cabang::query()
            ->select('id', 'nama_cabang as nama')
            ->orderBy('nama_cabang');

        $branches = $query->get()->map(function ($branch) {
            return [
                'id' => $branch->id,
                'nama' => $branch->nama,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $branches,
        ]);
    }
}
