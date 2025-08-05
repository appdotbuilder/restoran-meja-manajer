<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Reservation;
use Inertia\Inertia;

class FloorPlanController extends Controller
{
    /**
     * Display the floor plan with all tables.
     */
    public function index()
    {
        $tables = Table::with(['currentSession', 'reservations' => function ($query) {
            $query->upcoming()->limit(1);
        }])->get();

        $upcomingReservations = Reservation::with('assignedTable')
            ->upcoming()
            ->limit(5)
            ->get();

        return Inertia::render('floor-plan', [
            'tables' => $tables,
            'upcomingReservations' => $upcomingReservations,
        ]);
    }
}