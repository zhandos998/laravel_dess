<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ChapterCheck extends Model
{
    protected $fillable = [
        'chapter_id',
        'status',
        'result',
        'model',
    ];

    protected $casts = [
        'result' => 'array',
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }
}
