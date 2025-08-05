<?php

namespace Database\Seeders;

use App\Models\Table;
use App\Models\Reservation;
use App\Models\Session;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample tables with predefined layout
        $tables = [
            ['table_name' => 'T01', 'capacity' => 2, 'position_x' => 100, 'position_y' => 100, 'status' => 'available'],
            ['table_name' => 'T02', 'capacity' => 4, 'position_x' => 250, 'position_y' => 100, 'status' => 'available'],
            ['table_name' => 'T03', 'capacity' => 6, 'position_x' => 400, 'position_y' => 100, 'status' => 'available'],
            ['table_name' => 'T04', 'capacity' => 2, 'position_x' => 550, 'position_y' => 100, 'status' => 'available'],
            ['table_name' => 'T05', 'capacity' => 4, 'position_x' => 100, 'position_y' => 250, 'status' => 'available'],
            ['table_name' => 'T06', 'capacity' => 4, 'position_x' => 250, 'position_y' => 250, 'status' => 'occupied'],
            ['table_name' => 'T07', 'capacity' => 8, 'position_x' => 400, 'position_y' => 250, 'status' => 'available'],
            ['table_name' => 'T08', 'capacity' => 2, 'position_x' => 550, 'position_y' => 250, 'status' => 'reserved'],
            ['table_name' => 'T09', 'capacity' => 4, 'position_x' => 100, 'position_y' => 400, 'status' => 'cleaning'],
            ['table_name' => 'T10', 'capacity' => 6, 'position_x' => 250, 'position_y' => 400, 'status' => 'available'],
            ['table_name' => 'T11', 'capacity' => 4, 'position_x' => 400, 'position_y' => 400, 'status' => 'billed'],
            ['table_name' => 'T12', 'capacity' => 2, 'position_x' => 550, 'position_y' => 400, 'status' => 'available'],
        ];

        foreach ($tables as $tableData) {
            $table = Table::create($tableData);
            
            // Create active session for occupied tables
            if ($tableData['status'] === 'occupied') {
                $session = Session::create([
                    'table_id' => $table->id,
                    'start_time' => now()->subMinutes(random_int(15, 120)),
                    'pax' => random_int(1, $table->capacity),
                    'customer_name' => fake()->name(),
                ]);
                
                $table->update(['current_session_id' => $session->id]);
            }
        }

        // Create some sample reservations
        $reservedTable = Table::where('status', 'reserved')->first();
        if ($reservedTable) {
            Reservation::create([
                'customer_name' => 'John Doe',
                'customer_phone' => '+62812345678',
                'pax' => 2,
                'reservation_time' => now()->addHours(2),
                'assigned_table_id' => $reservedTable->id,
                'status' => 'confirmed',
            ]);
        }

        // Create additional upcoming reservations
        Reservation::factory()->count(5)->upcoming()->create();
    }
}