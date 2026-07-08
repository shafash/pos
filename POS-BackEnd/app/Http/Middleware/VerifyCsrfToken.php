<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyCsrfToken
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request):
     */

     protected $except = [
        'api/*',   
    ];
    
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
}
