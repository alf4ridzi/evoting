<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("polls", function (Blueprint $table) {
            $table->id();

            $table
                ->foreignIdFor(User::class, "created_by")
                ->index()
                ->constrained()
                ->nullOnDelete();

            $table->string("poll_id")->unique()->index(); // for domain.com/v/pool_id -> rand char

            $table->string("name");
            $table
                ->enum("status", ["active", "closed"])
                ->default("active")
                ->index();

            $table->dateTime("starts_at")->index();
            $table->dateTime("ends_at")->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("polls");
    }
};
