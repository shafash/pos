<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StokCabang;
use App\Models\Transaksi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user     = $request->user();
        $cabangId = $user->isKasir() ? $user->cabang_id : $request->cabang_id;
        $tahun    = $request->input('tahun', now()->year);

        return response()->json([
            'success' => true,
            'data'    => [
                'ringkasan'         => $this->getRingkasan($cabangId),
                'omset_bulanan'     => $this->getOmsetBulanan($tahun, $cabangId),
                'penjualan_cabang'  => $this->getPenjualanPerCabang($tahun),
                'stok_menipis'      => $this->getStokMenipis($cabangId),
                'transaksi_terakhir'=> $this->getTransaksiTerakhir($cabangId),
            ],
        ]);
    }

    private function getRingkasan(?int $cabangId): array
    {
        $qTransaksi = Transaksi::whereDate('waktu', today())
            ->where('status', 'lunas');

        if ($cabangId) {
            $qTransaksi->where('cabang_id', $cabangId);
        }

        $totalTransaksiHariIni = (clone $qTransaksi)->count();
        $omsetHariIni          = (clone $qTransaksi)->sum('total_bayar');

        $totalProduk  = DB::table('produk')->count();
        $totalMember  = DB::table('member')->where('status', 'aktif')->count();

        return [
            'transaksi_hari_ini' => $totalTransaksiHariIni,
            'omset_hari_ini'     => (float) $omsetHariIni,
            'total_produk'       => $totalProduk,
            'total_member_aktif' => $totalMember,
        ];
    }

    private function getOmsetBulanan(int $tahun, ?int $cabangId): array
    {
        $namaBulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

        $query = DB::table('transaksi')
            ->selectRaw('MONTH(waktu) as bulan, SUM(total_bayar) as total')
            ->whereYear('waktu', $tahun)
            ->where('status', 'lunas')
            ->groupByRaw('MONTH(waktu)')
            ->orderByRaw('MONTH(waktu)');

        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }

        $rows = $query->get()->keyBy('bulan');

        return collect(range(1, 12))->map(fn($m) => [
            'bulan' => $namaBulan[$m - 1],
            'value' => (float) ($rows->get($m)?->total ?? 0),
        ])->values()->toArray();
    }

    private function getPenjualanPerCabang(int $tahun): array
    {
        return DB::table('transaksi')
            ->join('cabang', 'cabang.id', '=', 'transaksi.cabang_id')
            ->selectRaw('cabang.nama_cabang as name, COUNT(*) as value')
            ->whereYear('transaksi.waktu', $tahun)
            ->where('transaksi.status', 'lunas')
            ->groupBy('cabang.id', 'cabang.nama_cabang')
            ->get()
            ->map(fn($row) => [
                'name'  => $row->name,
                'value' => (int) $row->value,
            ])
            ->toArray();
    }

    private function getStokMenipis(?int $cabangId): array
    {
        $query = StokCabang::with(['produk:sku,nama_barang', 'cabang:id,nama_cabang'])
            ->whereColumn('stok_saat_ini', '<=', 'minimum_stok')
            ->orderBy('stok_saat_ini');

        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }

        return $query->limit(10)->get()->map(fn($s) => [
            'sku'          => $s->sku,
            'nama'         => $s->produk?->nama_barang,
            'unit'         => $s->stok_saat_ini,
            'cabang'       => $s->cabang?->nama_cabang,
            'critical'     => $s->stok_saat_ini === 0,
        ])->toArray();
    }

    private function getTransaksiTerakhir(?int $cabangId): array
    {
        $query = Transaksi::with([
            'detailTransaksi',
            'cabang:id,nama_cabang',
        ])->where('status', 'lunas');

        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }

        return $query->latest('waktu')->limit(5)->get()->map(fn($t) => [
            'id'      => $t->no_transaksi,
            'waktu'   => $t->waktu->format('H:i') . ' WIB',
            'jumlah'  => $t->detailTransaksi->sum('kuantitas'),
            'total'   => 'Rp ' . number_format($t->total_bayar, 0, ',', '.'),
            'cabang'  => $t->cabang?->nama_cabang,
        ])->toArray();
    }
}