<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('users')->insertOrIgnore([
            [
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('admin12345'),
            ],
            [
                'name' => 'user1',
                'email' => 'user1@gmail.com',
                'password' => bcrypt('user123'),
            ],
            [
                'name' => 'user2',
                'email' => 'user2@gmail.com',
                'password' => bcrypt('user123'),
            ],
            [
                'name' => 'user3',
                'email' => 'user3@gmail.com',
                'password' => bcrypt('user123'),
            ],
            [
                'name' => 'user4',
                'email' => 'user4@gmail.com',
                'password' => bcrypt('user123'),
            ],
            [
                'name' => 'user5',
                'email' => 'user5@gmail.com',
                'password' => bcrypt('user123'),
            ],
        ]);
    }
}
