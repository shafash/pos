<?php

namespace App\Policies;

use App\Models\Transaksi;
use App\Models\User;

class TransaksiPolicy
{
    public function view(User $user, Transaksi $transaksi): bool
    {
        return $user->isAdmin() || $user->isOwner() || $user->cabang_id === $transaksi->cabang_id;
    }

    public function update(User $user, Transaksi $transaksi): bool
    {
        // used for actions like cancel
        return $this->view($user, $transaksi);
    }

    public function delete(User $user, Transaksi $transaksi): bool
    {
        return $this->view($user, $transaksi);
    }
}
