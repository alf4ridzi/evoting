<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollOptions;
use App\Models\Vote;
use App\Models\Votes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function Termwind\render;

class VotesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $pollID)
    {
        //
        $request->validate([
            "poll_option_id" => ["required", "integer", "exists:poll_options,id"]
        ]);
        
        $poll = Poll::where("poll_id", $pollID)->firstOrFail();


        $option = $poll->options()->findOrFail($request->poll_option_id);

        $vote = [
            "poll_id" => $poll->id,
            "poll_option_id" => $option->id,
            "ip_address" => $request->ip() 
        ];

        Vote::create($vote);
        
        return back()->with("success", "berhasil vote");
    }

    /**
     * Display the specified resource.
     */
    public function show(Vote $votes)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vote $votes)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vote $votes)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vote $votes)
    {
        //
    }
}
