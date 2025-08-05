<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Models\Reservation;
use App\Models\Table;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of reservations.
     */
    public function index()
    {
        $reservations = Reservation::with('assignedTable')
            ->upcoming()
            ->paginate(20);

        return Inertia::render('reservations/index', [
            'reservations' => $reservations,
        ]);
    }

    /**
     * Show the form for creating a new reservation.
     */
    public function create()
    {
        $availableTables = Table::where('status', 'available')
            ->orWhere('status', 'reserved')
            ->orderBy('table_name')
            ->get();

        return Inertia::render('reservations/create', [
            'availableTables' => $availableTables,
        ]);
    }

    /**
     * Store a newly created reservation.
     */
    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();
        $validated['status'] = 'confirmed';

        $reservation = Reservation::create($validated);

        // Update table status to reserved if it's available
        $table = Table::find($validated['assigned_table_id']);
        if ($table && $table->status === 'available') {
            $table->update(['status' => 'reserved']);
        }

        return redirect()->route('reservations.index')
            ->with('success', 'Reservation created successfully.');
    }

    /**
     * Display the specified reservation.
     */
    public function show(Reservation $reservation)
    {
        $reservation->load('assignedTable');

        return Inertia::render('reservations/show', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Update the specified reservation status.
     */
    public function update(Reservation $reservation)
    {
        // Mark customer as arrived
        $reservation->update(['status' => 'arrived']);
        
        // Update table status to occupied
        $reservation->assignedTable->update(['status' => 'occupied']);

        return redirect()->back()->with('success', 'Customer marked as arrived.');
    }

    /**
     * Remove the specified reservation.
     */
    public function destroy(Reservation $reservation)
    {
        // If table is reserved only for this reservation, make it available
        if ($reservation->assignedTable->status === 'reserved') {
            $otherReservations = Reservation::where('assigned_table_id', $reservation->assigned_table_id)
                ->where('id', '!=', $reservation->id)
                ->upcoming()
                ->exists();
                
            if (!$otherReservations) {
                $reservation->assignedTable->update(['status' => 'available']);
            }
        }

        $reservation->update(['status' => 'cancelled']);

        return redirect()->back()->with('success', 'Reservation cancelled successfully.');
    }
}