<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    //
    protected $fillable = [
        "poll_id",
        "poll_option_id",
        "voted_at"
    ];

    public function poll() {
        return $this->belongsTo(Poll::class);
    }

    public function option() {
        return $this->belongsTo(PollOptions::class);
    }
}
