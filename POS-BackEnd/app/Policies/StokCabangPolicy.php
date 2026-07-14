<?php

namespace App\Policies;

use App\Models\StokCabang;
use App\Models\User;

class StokCabangPolicy
{
    public function update(User $user, StokCabang $stok): bool
    {
        return $user->isAdmin() || $user->isOwner() || $user->cabang_id === $stok->cabang_id;
    }

    public function view(User $user, StokCabang $stok): bool
    {
        return $this->update($user, $stok);
    }
}
