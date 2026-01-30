<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollOptions;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Str;

class PollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render("Polls/List");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render("Polls/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            "name" => ["required", "max:50"],
            "starts_at" => ["required", "date"],
            "ends_at" => ["required", "date"],
            "options" => ["required", "array"],
            "options.*.name" => ["required", "string"],
            "options.*.description" => ["required", "string"],
            "options.*.image" => ["required", "image", "mimes:jpg,png,jpeg,svg", "max:4092"]
        ]);

        $pollID = Str::random(8);

        // poll data
        $poll = [
            "name" => $validated["name"],
            "poll_id" => $pollID,
            "created_by" => Auth::id(),
            "starts_at" => $validated["starts_at"],
            "ends_at" => $validated["ends_at"],
        ];

        DB::beginTransaction();

        try {
            // create Poll
            $insertPoll = Poll::create($poll);
            $pollID = $insertPoll->id;

            foreach ($validated["options"] as $opt) {
                $imageName = Str::random(12) . "." . $opt["image"]->extension();
                $opt["image"]->move(public_path("images"), $imageName);

                $option = [
                    "poll_id" => $pollID,
                    "name" => $opt["name"],
                    "description" => $opt["description"],
                    "image" => $imageName,
                ];

                PollOptions::create($option);
            }

            DB::commit();

        } catch (Exception $e) {
            DB::rollBack();
            //dd(vars: $e->getMessage());
            return back()->with("error", "internal server error");
        }
        

        return back()->with("success", "berhasil menambah voting");
    }

    /**
     * Display the specified resource.
     */
    public function show(Poll $poll, string $id)
    {
        //

        $poll = $poll->with("options")
        ->where("poll_id", $id)
        ->first();

        if (!$poll) {
            return back()->with('error', "poll tidak ditemukan");
        }

        $options = $poll->options;

        $data = [
            'poll' => $poll,
            'options' => $options,
            'userVote' => null,
        ];

        return Inertia::render("Polls/Voting", $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Poll $poll)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Poll $poll)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Poll $poll)
    {
        //
    }

    /**
     * Dashboard
     */
    public function dashboard()
    {
        return Inertia::render("Polls/Dashboard");
    }

    /**
     * result
     */
    public function result()
    {
        return Inertia::render("Polls/Result");
    }
}
