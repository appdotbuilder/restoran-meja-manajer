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
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->string('table_name')->comment('Table identifier/name');
            $table->integer('capacity')->comment('Maximum number of people');
            $table->enum('status', ['available', 'occupied', 'reserved', 'cleaning', 'billed'])->default('available')->comment('Current table status');
            $table->integer('position_x')->comment('X coordinate for floor plan');
            $table->integer('position_y')->comment('Y coordinate for floor plan');
            $table->unsignedBigInteger('current_session_id')->nullable()->comment('Current active session if occupied');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('status');
            $table->index('table_name');
            $table->index(['status', 'capacity']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};