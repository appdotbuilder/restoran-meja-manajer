<?php

namespace Database\Factories;

use App\Models\Session;
use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Session>
 */
class SessionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Session>
     */
    protected $model = Session::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('-2 hours', 'now');
        
        return [
            'table_id' => Table::factory(),
            'start_time' => $startTime,
            'end_time' => fake()->optional(0.3)->dateTimeBetween($startTime, 'now'),
            'pax' => fake()->numberBetween(1, 8),
            'customer_name' => fake()->name(),
        ];
    }

    /**
     * Indicate that the session is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_time' => null,
        ]);
    }
}