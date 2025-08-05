<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('floor-plan.index');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('floor-plan.index');
    })->name('dashboard');
    
    // Restaurant management routes
    // Floor plan - main dashboard
    Route::get('/floor-plan', [App\Http\Controllers\FloorPlanController::class, 'index'])->name('floor-plan.index');
    
    // Table management
    Route::resource('tables', App\Http\Controllers\TableController::class)->only(['show', 'update', 'store']);
    
    // Reservations
    Route::resource('reservations', App\Http\Controllers\ReservationController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
