<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poll extends Model
{
    //
    protected $fillable = [
        "created_by",
        "poll_id",
        "name",
        "status",
        "starts_at",
        "ends_at"
    ];

    public function options() {
        return $this->hasMany(PollOptions::class);
    }
}
