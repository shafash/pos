<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Struk Transaksi</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
        .container { max-width: 420px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 16px; }
        .meta { font-size: 12px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { padding: 6px 0; font-size: 12px; }
        .total { font-weight: 700; border-top: 1px dashed #999; padding-top: 8px; }
        .footer { margin-top: 16px; font-size: 11px; text-align: center; color: #666; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h3 style="margin: 0;">STRUK PENJUALAN</h3>
            <div>{{ $transaksi->cabang->nama_cabang ?? 'POS Elang Anugerah' }}</div>
        </div>

        <div class="meta">
            <div>No. Transaksi: {{ $transaksi->no_transaksi }}</div>
            <div>Waktu: {{ $transaksi->waktu?->format('d/m/Y H:i:s') }}</div>
            <div>Kasir: {{ $transaksi->user->nama_lengkap ?? '-' }}</div>
            <div>Metode: {{ strtoupper($transaksi->metode_pembayaran) }}</div>
        </div>

        <table>
            <thead>
                <tr>
                    <th align="left">Item</th>
                    <th align="right">Qty</th>
                    <th align="right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($transaksi->detailTransaksi as $detail)
                    <tr>
                        <td>{{ $detail->produk->nama_barang ?? $detail->sku }}</td>
                        <td align="right">{{ $detail->kuantitas }}</td>
                        <td align="right">{{ number_format($detail->subtotal, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total">
            <div style="display:flex; justify-content:space-between;">
                <span>Total</span>
                <span>{{ number_format($transaksi->total_bayar, 0, ',', '.') }}</span>
            </div>
        </div>

        <div class="footer">
            <div>Terima kasih telah berbelanja.</div>
        </div>
    </div>

    <script>
        window.onload = () => window.print();
    </script>
</body>
</html>
