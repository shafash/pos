<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

use App\Models\Transaksi;
use App\Models\AuditStok;
use App\Models\StokCabang;

use App\Policies\TransaksiPolicy;
use App\Policies\AuditStokPolicy;
use App\Policies\StokCabangPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Transaksi::class => TransaksiPolicy::class,
        AuditStok::class => AuditStokPolicy::class,
        StokCabang::class => StokCabangPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Optionally define a gate for Super Admin roles if you have one
        Gate::before(function ($user, $ability) {
            if ($user->isOwner() || $user->isAdmin()) {
                return true;
            }
            return null;
        });
    }
}
