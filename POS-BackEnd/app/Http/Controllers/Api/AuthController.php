<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    //
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::with('cabang')->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau Password salah.'],
            ]);
        }

        $user->tokens()->delete();

        $token = $user->createToken('pos-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'nama_lengkap' => $user->nama_lengkap,
                    'email' => $user->email,
                    'role' => $user->role,
                    'cabang_id' => $user->cabang_id,
                    'cabang' => $user->cabang?->nama_cabang,
                ],
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('cabang');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'nama_lengkap' => $user->nama_lengkap,
                'email' => $user->email,
                'role' => $user->role,
                'cabang_id' => $user->cabang_id,
                'cabang' => $user->cabang?->nama_cabang,
            ],
        ]);
    }
}
