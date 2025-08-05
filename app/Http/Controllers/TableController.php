<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSessionRequest;
use App\Models\Table;
use App\Models\Session;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    /**
     * Display the specified table.
     */
    public function show(Table $table)
    {
        $table->load(['currentSession', 'reservations' => function ($query) {
            $query->upcoming();
        }]);

        return Inertia::render('table-details', [
            'table' => $table,
        ]);
    }

    /**
     * Update the table status.
     */
    public function update(Request $request, Table $table)
    {
        $validated = $request->validate([
            'status' => 'required|in:available,occupied,reserved,cleaning,billed',
        ]);

        // If changing to available, end current session
        if ($validated['status'] === 'available' && $table->current_session_id) {
            $table->currentSession->update(['end_time' => now()]);
            $table->update(['current_session_id' => null]);
        }

        $table->update($validated);

        return redirect()->back()->with('success', 'Table status updated successfully.');
    }

    /**
     * Seat walk-in customers.
     */
    public function store(StoreSessionRequest $request)
    {
        $validated = $request->validated();
        
        $table = Table::findOrFail($validated['table_id']);
        
        // Create new session
        $session = Session::create([
            'table_id' => $table->id,
            'start_time' => now(),
            'pax' => $validated['pax'],
            'customer_name' => $validated['customer_name'],
        ]);

        // Update table status and link session
        $table->update([
            'status' => 'occupied',
            'current_session_id' => $session->id,
        ]);

        return redirect()->back()->with('success', 'Customers seated successfully.');
    }
}