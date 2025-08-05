<?php

use App\Models\User;
use App\Models\Table;
use App\Models\Reservation;
use App\Models\Session;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('floor plan displays tables', function () {
    Table::factory()->count(5)->create();

    $response = $this->get(route('floor-plan.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('floor-plan')
        ->has('tables', 5)
    );
});

test('can create reservation', function () {
    $table = Table::factory()->available()->create();

    $reservationData = [
        'customer_name' => 'John Doe',
        'customer_phone' => '+62812345678',
        'pax' => 2,
        'reservation_time' => now()->addHours(2)->format('Y-m-d H:i:s'),
        'assigned_table_id' => $table->id,
    ];

    $response = $this->post(route('reservations.store'), $reservationData);

    $response->assertRedirect(route('reservations.index'));
    $this->assertDatabaseHas('reservations', [
        'customer_name' => 'John Doe',
        'assigned_table_id' => $table->id,
    ]);
});

test('can seat walk in customers', function () {
    $table = Table::factory()->available()->create();

    $sessionData = [
        'table_id' => $table->id,
        'pax' => 3,
        'customer_name' => 'Jane Smith',
    ];

    $response = $this->post(route('tables.store'), $sessionData);

    $response->assertRedirect();
    $this->assertDatabaseHas('dining_sessions', [
        'table_id' => $table->id,
        'customer_name' => 'Jane Smith',
    ]);
    
    $table->refresh();
    expect($table->status)->toBe('occupied');
});

test('can update table status', function () {
    $table = Table::factory()->occupied()->create();

    $response = $this->patch(route('tables.update', $table), [
        'status' => 'billed',
    ]);

    $response->assertRedirect();
    $table->refresh();
    expect($table->status)->toBe('billed');
});

test('reservation index shows upcoming reservations', function () {
    Reservation::factory()->upcoming()->count(3)->create();

    $response = $this->get(route('reservations.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('reservations/index')
        ->has('reservations.data', 3)
    );
});

test('can mark reservation as arrived', function () {
    $reservation = Reservation::factory()->create(['status' => 'confirmed']);

    $response = $this->patch(route('reservations.update', $reservation));

    $response->assertRedirect();
    $reservation->refresh();
    expect($reservation->status)->toBe('arrived');
});

test('dashboard redirects to floor plan', function () {
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('floor-plan.index'));
});

test('authenticated users redirect to floor plan from home', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('floor-plan.index'));
});

test('guests see welcome page', function () {
    auth()->logout();

    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('welcome'));
});