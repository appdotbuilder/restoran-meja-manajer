<?php

namespace Database\Factories;

use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Table>
 */
class TableFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Table>
     */
    protected $model = Table::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'table_name' => 'Table ' . fake()->unique()->numberBetween(1, 50),
            'capacity' => fake()->numberBetween(2, 8),
            'status' => fake()->randomElement(['available', 'occupied', 'reserved', 'cleaning']),
            'position_x' => fake()->numberBetween(50, 800),
            'position_y' => fake()->numberBetween(50, 600),
            'current_session_id' => null,
        ];
    }

    /**
     * Indicate that the table is available.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
            'current_session_id' => null,
        ]);
    }

    /**
     * Indicate that the table is occupied.
     */
    public function occupied(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'occupied',
        ]);
    }
}