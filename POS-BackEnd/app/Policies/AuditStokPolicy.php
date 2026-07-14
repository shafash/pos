<?php

namespace App\Policies;

use App\Models\AuditStok;
use App\Models\User;

class AuditStokPolicy
{
    public function view(User $user, AuditStok $audit): bool
    {
        return $user->isAdmin() || $user->isOwner() || $user->cabang_id === $audit->cabang_id;
    }

    public function update(User $user, AuditStok $audit): bool
    {
        return $this->view($user, $audit);
    }

    public function delete(User $user, AuditStok $audit): bool
    {
        return $this->view($user, $audit);
    }
}
