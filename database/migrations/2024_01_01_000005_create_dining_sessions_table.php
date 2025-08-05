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
        Schema::create('dining_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('table_id')->comment('Table where session is active');
            $table->datetime('start_time')->comment('When customer was seated');
            $table->datetime('end_time')->nullable()->comment('When customer left/paid');
            $table->integer('pax')->comment('Number of people in this session');
            $table->string('customer_name')->nullable()->comment('Customer name for walk-ins');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('table_id');
            $table->index('start_time');
            $table->index(['table_id', 'start_time']);
            $table->foreign('table_id')->references('id')->on('tables')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dining_sessions');
    }
};