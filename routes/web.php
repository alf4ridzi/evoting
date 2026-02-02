<?php

use App\Http\Controllers\PollController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VotesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get("/", function () {
//     return Inertia::render("Welcome", [
//         "canLogin" => Route::has("login"),
//         "canRegister" => Route::has("register"),
//         "laravelVersion" => Application::VERSION,
//         "phpVersion" => PHP_VERSION,
//     ]);
// })->name("index");
Route::get("/", function () {
    return Inertia::render("Index");
})->name("index");

// Route::get("/dashboard", function () {
//     return Inertia::render("Dashboard");
// })
//     ->middleware(["auth", "verified"])
//     ->name("dashboard");

Route::middleware("auth")->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit",
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update",
    );
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy",
    );
});

Route::prefix("/polls")->group(function () {
    // Route::get("/", [PollController::class, "index"]);
    Route::post("/", [PollController::class, "store"])->name("polls.store");
    Route::get("/create", [PollController::class, "create"])
        ->middleware("auth")
        ->name("polls.create");
    Route::get("/{id}", [PollController::class, "show"])->name("polls.show");
    Route::post("/{poll_id}/vote", [VotesController::class, "store"])->name(
        "vote.store",
    );
});

// Route::prefix("/votes")->group(function () {
//     Route::get("/{id}/result", [PollController::class, "result"]);
// });

Route::middleware("auth")
    ->prefix("/dashboard")
    ->group(function () {
        Route::get("/", [PollController::class, "dashboard"])->name(
            "dashboard",
        );
    });

require __DIR__ . "/auth.php";
