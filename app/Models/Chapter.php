<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Chapter extends Model
{
    protected $fillable = [
        'document_id',
        'title',
        'content',
        'open',
        'position',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
