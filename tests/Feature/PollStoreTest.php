<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Poll;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PollStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_poll()
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $payload = [
            'name' => 'Polling Presiden',
            'starts_at' => now()->toDateTimeString(),
            'ends_at' => now()->addDay()->toDateTimeString(),
            'options' => [
                [
                    'name' => 'Option 1',
                    'description' => 'Desc 1',
                    'image' => UploadedFile::fake()->image('opt1.jpg'),
                ],
                [
                    'name' => 'Option 2',
                    'description' => 'Desc 2',
                    'image' => UploadedFile::fake()->image('opt2.jpg'),
                ],
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->post('/polls', $payload);

        $response->assertStatus(302);
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('polls', [
            'name' => 'Polling Presiden',
            'created_by' => $user->id,
        ]);

        $this->assertDatabaseCount('poll_options', 2);
    }

}

