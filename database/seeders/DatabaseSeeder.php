<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'firstname' => 'John',
            'lastname' => 'Doe',
            'email' => 'test@example.com',
        ]);

        User::factory()->count(15)->create();
    }
}
