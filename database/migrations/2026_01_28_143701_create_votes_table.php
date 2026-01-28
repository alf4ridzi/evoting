<?php

use App\Models\Poll;
use App\Models\PollOptions;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("votes", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignIdFor(Poll::class, "poll_id")
                ->constrained()
                ->nullOnDelete();

            $table
                ->foreignIdFor(PollOptions::class, "poll_option_id")
                ->constrained()
                ->nullOnDelete();
                
                
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("votes");
    }
};
