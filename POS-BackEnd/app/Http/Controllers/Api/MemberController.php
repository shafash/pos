<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Member::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_member', 'like', "%{$search}%")
                  ->orWhere('no_telepon', 'like', "%{$search}%")
                  ->orWhere('id_member', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $member = $query->orderBy('nama_member')->get();

        return response()->json(['success' => true, 'data' => $member]);
    }

    public function show(string $idMember): JsonResponse
    {
        $member = Member::with([
            'transaksi' => fn($q) => $q->latest('waktu')->limit(10),
        ])->findOrFail($idMember);

        return response()->json(['success' => true, 'data' => $member]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_member'       => 'required|string|max:100',
            'no_telepon'        => 'required|string|max:20|unique:member,no_telepon',
            'email'             => 'nullable|email|max:100',
            'alamat'            => 'nullable|string|max:255',
            'tipe_member'       => 'nullable|string|max:50',
            'tanggal_bergabung' => 'nullable|date',
        ]);

        $member = Member::create([
            'id_member'         => $this->generateIdMember(),
            'nama_member'       => $validated['nama_member'],
            'no_telepon'        => $validated['no_telepon'],
            'email'             => $validated['email'] ?? null,
            'alamat'            => $validated['alamat'] ?? null,
            'tipe_member'       => $validated['tipe_member'] ?? 'reguler',
            'tier_loyalty'      => 'bronze',
            'poin'              => 0,
            'tanggal_bergabung' => $validated['tanggal_bergabung'] ?? now()->toDateString(),
            'status'            => 'aktif',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Member berhasil ditambahkan.',
            'data'    => $member,
        ], 201);
    }

    public function update(Request $request, string $idMember): JsonResponse
    {
        $member = Member::findOrFail($idMember);

        $validated = $request->validate([
            'nama_member'  => 'sometimes|string|max:100',
            'no_telepon'   => ['sometimes', 'string', 'max:20', Rule::unique('member', 'no_telepon')->ignore($idMember, 'id_member')],
            'email'        => 'nullable|email|max:100',
            'alamat'       => 'nullable|string|max:255',
            'tipe_member'  => 'nullable|string|max:50',
            'status'       => 'sometimes|in:aktif,nonaktif',
        ]);

        $member->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Member berhasil diperbarui.',
            'data'    => $member->fresh(),
        ]);
    }

    public function destroy(string $idMember): JsonResponse
    {
        $member = Member::findOrFail($idMember);
        $member->update(['status' => 'nonaktif']);

        return response()->json([
            'success' => true,
            'message' => 'Member berhasil dinonaktifkan.',
        ]);
    }

    private function generateIdMember(): string
    {
        $last = Member::orderByDesc('id_member')->first();

        if (! $last) {
            return 'MBR-0001';
        }

        $lastNumber = (int) substr($last->id_member, 4);
        $nextNumber = str_pad((string) ($lastNumber + 1), 4, '0', STR_PAD_LEFT);

        return "MBR-{$nextNumber}";
    }
}