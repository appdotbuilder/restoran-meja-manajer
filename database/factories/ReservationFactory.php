<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Reservation>
     */
    protected $model = Reservation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_name' => fake()->name(),
            'customer_phone' => fake()->phoneNumber(),
            'pax' => fake()->numberBetween(1, 8),
            'reservation_time' => fake()->dateTimeBetween('now', '+7 days'),
            'assigned_table_id' => Table::factory(),
            'status' => fake()->randomElement(['pending', 'confirmed', 'arrived']),
        ];
    }

    /**
     * Indicate that the reservation is upcoming.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'reservation_time' => fake()->dateTimeBetween('+1 hour', '+3 days'),
            'status' => 'confirmed',
        ]);
    }
}