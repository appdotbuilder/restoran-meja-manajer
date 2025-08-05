<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name')->comment('Name of the customer making reservation');
            $table->string('customer_phone')->comment('Phone number of the customer');
            $table->integer('pax')->comment('Number of people for reservation');
            $table->datetime('reservation_time')->comment('Date and time of reservation');
            $table->unsignedBigInteger('assigned_table_id')->comment('Table assigned for this reservation');
            $table->enum('status', ['pending', 'confirmed', 'arrived', 'cancelled', 'completed'])->default('pending')->comment('Reservation status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('reservation_time');
            $table->index('status');
            $table->index('assigned_table_id');
            $table->index(['status', 'reservation_time']);
            $table->foreign('assigned_table_id')->references('id')->on('tables')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};