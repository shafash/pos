<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'dari'      => 'nullable|date',
            'sampai'    => 'nullable|date|after_or_equal:dari',
            'cabang_id' => 'nullable|integer|exists:cabang,id',
            'tipe'      => 'nullable|in:harian,bulanan,tahunan',
        ]);

        $user     = $request->user();
        $cabangId = $user->isKasir() ? $user->cabang_id : $request->cabang_id;
        $dari     = $request->input('dari', now()->startOfMonth()->toDateString());
        $sampai   = $request->input('sampai', now()->toDateString());
        $tipe     = $request->input('tipe', 'harian');

        [$selectRaw, $groupRaw, $labelKey] = match ($tipe) {
            'tahunan' => ["YEAR(waktu) as periode, SUM(total_bayar) as total, COUNT(*) as jumlah_transaksi", "YEAR(waktu)", 'periode'],
            'bulanan' => ["DATE_FORMAT(waktu, '%Y-%m') as periode, SUM(total_bayar) as total, COUNT(*) as jumlah_transaksi", "DATE_FORMAT(waktu, '%Y-%m')", 'periode'],
            default   => ["DATE(waktu) as periode, SUM(total_bayar) as total, COUNT(*) as jumlah_transaksi", "DATE(waktu)", 'periode'],
        };

        $query = DB::table('transaksi')
            ->selectRaw($selectRaw)
            ->whereBetween(DB::raw('DATE(waktu)'), [$dari, $sampai])
            ->where('status', 'lunas')
            ->groupByRaw($groupRaw)
            ->orderByRaw($groupRaw);

        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }

        $rows = $query->get();

        $produkTerlaris = DB::table('detail_transaksi')
            ->join('transaksi', 'transaksi.no_transaksi', '=', 'detail_transaksi.no_transaksi')
            ->join('produk', 'produk.sku', '=', 'detail_transaksi.sku')
            ->selectRaw('produk.sku, produk.nama_barang, SUM(detail_transaksi.kuantitas) as total_terjual, SUM(detail_transaksi.subtotal) as total_omset')
            ->whereBetween(DB::raw('DATE(transaksi.waktu)'), [$dari, $sampai])
            ->where('transaksi.status', 'lunas')
            ->when($cabangId, fn($q) => $q->where('transaksi.cabang_id', $cabangId))
            ->groupBy('produk.sku', 'produk.nama_barang')
            ->orderByDesc('total_terjual')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'periode'         => ['dari' => $dari, 'sampai' => $sampai, 'tipe' => $tipe],
                'grafik'          => $rows,
                'total_omset'     => (float) $rows->sum('total'),
                'total_transaksi' => (int) $rows->sum('jumlah_transaksi'),
                'produk_terlaris' => $produkTerlaris,
            ],
        ]);
    }
}