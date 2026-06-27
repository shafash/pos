export const omsetData = [
  { year: '2016', value: 5000  },
  { year: '2017', value: 12000 },
  { year: '2018', value: 35000 },
  { year: '2019', value: 55000 },
  { year: '2020', value: 15000 },
  { year: '2021', value: 22000 },
  { year: '2022', value: 65000 },
  { year: '2023', value: 95000 },
]

export const cabangData = [
  { name: 'Blimbing',  value: 120 },
  { name: 'Kepanjen',  value: 80  },
  { name: 'Turen',     value: 70  },
  { name: 'Singosari', value: 50  },
]

export const stokMenipisData = [
  { nama: 'Aki GS Astra Premium NS60', unit: 3, cabang: 'Kepanjen', critical: false },
  { nama: 'Aki GS Astra Premium NS60', unit: 8, cabang: 'Kepanjen', critical: false },
  { nama: 'Aki GS Astra Premium NS60', unit: 5, cabang: 'Kepanjen', critical: false },
  { nama: 'Aki GS Astra Premium NS60', unit: 1, cabang: 'Kepanjen', critical: true  },
  { nama: 'Aki GS Astra Premium NS60', unit: 1, cabang: 'Kepanjen', critical: true  },
]

export const transaksiTerakhirData = [
  { id: '#TRX-2026-00847', waktu: '10:42 WIB', jumlah: 2, harga: 'Grosir', total: 'Rp 1.000.000' },
  { id: '#TRX-2026-00847', waktu: '10:42 WIB', jumlah: 2, harga: 'Eceran', total: 'Rp 1.000.000' },
  { id: '#TRX-2026-00847', waktu: '10:42 WIB', jumlah: 2, harga: 'Eceran', total: 'Rp 1.000.000' },
]

export const produkListData = [
  { id: 1, nama: 'Incoe Gold N50',           kategori: 'Basah',  hargaBeli: 'Rp. 800.000',   hargaJual: 'Rp. 1.099.998', satuan: 'Pcs' },
  { id: 2, nama: 'Amaron Hi-Life 55D23L',    kategori: 'Kering', hargaBeli: 'Rp. 1.300.000', hargaJual: 'Rp. 1.600.000', satuan: 'Pcs' },
  { id: 3, nama: 'Bosch MF 46B24L',          kategori: 'Kering', hargaBeli: 'Rp. 820.000',   hargaJual: 'Rp. 990.000',   satuan: 'Pcs' },
  { id: 4, nama: 'GS Astra MF NS40Z',        kategori: 'Kering', hargaBeli: 'Rp. 740.000',   hargaJual: 'Rp. 900.000',   satuan: 'Pcs' },
  { id: 5, nama: 'Bosch Maintenance Free',   kategori: 'Kering', hargaBeli: 'Rp. 715.000',   hargaJual: 'Rp. 915.000',   satuan: 'Pcs' },
  { id: 6, nama: 'Motolite Gold',            kategori: 'Kering', hargaBeli: 'Rp. 975.000',   hargaJual: 'Rp. 1.250.000', satuan: 'Pcs' },
  { id: 7, nama: 'Rocket MF',                kategori: 'Kering', hargaBeli: 'Rp. 1.025.000', hargaJual: 'Rp. 1.300.000', satuan: 'Pcs' },
  { id: 8, nama: 'Delkor MF',                kategori: 'Kering', hargaBeli: 'Rp. 900.000',   hargaJual: 'Rp. 1.800.000', satuan: 'Pcs' },
  { id: 9, nama: 'G-Force N50',              kategori: 'Basah',  hargaBeli: 'Rp. 725.000',   hargaJual: 'Rp. 950.000',   satuan: 'Pcs' },
]

export const barangBaruData = [
  { nama: 'Incoe Gold N50',        stok: 15 },
  { nama: 'GS Astra MF NS40Z',     stok: 9  },
  { nama: 'Amaron Hi-Life 55D23L', stok: 24 },
  { nama: 'Bosch MF 46B24L',       stok: 5  },
]

export const kasirProdukData = Array.from({ length: 9 }, (_, i) => ({
  id:          i + 1,
  nama:        'GS Astra Maintenance Free (MF)',
  tipe:        'Kering',
  stok:        12,
  hargaEceran: 1000000,
  hargaGrosir: 900000,
}))

export const keranjangInitData = [
  { id: 1, nama: 'GS Astra Maintenance Free (MF)', tipe: 'Kering', harga: 1010000, qty: 1 },
  { id: 2, nama: 'GS Astra Maintenance Free (MF)', tipe: 'Kering', harga: 1010000, qty: 1 },
  { id: 3, nama: 'GS Astra Maintenance Free (MF)', tipe: 'Kering', harga: 1010000, qty: 1 },
  { id: 4, nama: 'GS Astra Maintenance Free (MF)', tipe: 'Kering', harga: 1010000, qty: 1 },
  { id: 5, nama: 'GS Astra Maintenance Free (MF)', tipe: 'Kering', harga: 1010000, qty: 1 },
  { id: 6, nama: 'GS Astra Maintenance Free (MF)', tipe: 'Kering', harga: 1010000, qty: 1 },
]

export const memberListData = [
  { id: 1, memberId: 'MBR-0021', nama: 'Keizuro Isaac',     telp: '0812-3456-7890', alamat: 'Jl. Suropati No.157, Singosari, Kabupaten Malang',    poin: 8500 },
  { id: 2, memberId: 'MBR-0020', nama: 'Jiwa Trisna Kama',  telp: '0813-7788-9922', alamat: 'Jl. Jendral Ahmad Yani Utara No.32',                  poin: 4100 },
  { id: 3, memberId: 'MBR-0019', nama: 'Adimas Ken Maharu', telp: '0821-5566-1100', alamat: 'Komplek Araya Business Center',                        poin: 900  },
  { id: 4, memberId: 'MBR-0018', nama: 'Kandra Hamirga',    telp: '0822-9090-1234', alamat: 'Jl. Simpang Borobudur No.7',                           poin: 2670 },
  { id: 5, memberId: 'MBR-0017', nama: 'Geivano Eldanar',   telp: '0856-4444-7777', alamat: 'Jl. Stadion Utara No.02 RT.01 RW.15',                 poin: 7000 },
  { id: 6, memberId: 'MBR-0016', nama: 'Galva Giltantama',  telp: '0857-3210-8888', alamat: 'Jl. Sidodadi No.20 RT 01 RW 08, Singosari',           poin: 3907 },
  { id: 7, memberId: 'MBR-0015', nama: 'Kael Hiro',         telp: '0877-6655-4433', alamat: 'Jl. Ahmad Yani No.15, Kepanjen',                       poin: 1798 },
  { id: 8, memberId: 'MBR-0014', nama: 'Milano Keshi',      telp: '0881-7000-1122', alamat: 'Jl. KH. Ahmad Dahlan, Kepanjen',                       poin: 6561 },
  { id: 9, memberId: 'MBR-0013', nama: 'Baraja Gefardian',  telp: '0895-1234-5678', alamat: 'Jl. Sulfat No.74, Purwantoro',                         poin: 9718 },
]

export const laporanBulananData = [
  { bulan: 'Jan', value: 32000000 },
  { bulan: 'Feb', value: 28000000 },
  { bulan: 'Mar', value: 41000000 },
  { bulan: 'Apr', value: 38000000 },
  { bulan: 'Mei', value: 45000000 },
  { bulan: 'Jun', value: 39000000 },
]