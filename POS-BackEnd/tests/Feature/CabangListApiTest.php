<?php

namespace Tests\Feature;

use App\Models\Cabang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CabangListApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_fetch_branch_list(): void
    {
        $cabangA = Cabang::create([
            'nama_cabang' => 'Elang Anugerah Blimbing',
            'alamat' => 'Jl. Blimbing',
        ]);

        $cabangB = Cabang::create([
            'nama_cabang' => 'Elang Anugerah Kepanjen',
            'alamat' => 'Jl. Kepanjen',
        ]);

        $user = User::create([
            'nama_lengkap' => 'Owner Test',
            'email' => 'owner@example.com',
            'password' => 'secret123',
            'role' => 'owner',
            'cabang_id' => $cabangA->id,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/cabang');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    ['id', 'nama'],
                ],
            ])
            ->assertJsonFragment(['id' => $cabangA->id, 'nama' => 'Elang Anugerah Blimbing'])
            ->assertJsonFragment(['id' => $cabangB->id, 'nama' => 'Elang Anugerah Kepanjen']);
    }
}
