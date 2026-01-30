<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PollOptions extends Model
{
    //
    protected $fillable = [
        "poll_id",
        "name",
        "description",
        "image"
    ];

    public function poll() {
        return $this->belongsTo(Poll::class);
    }

}
