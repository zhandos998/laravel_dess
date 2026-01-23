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

    public function checks()
    {
        return $this->hasMany(ChapterCheck::class);
    }

    public function lastCheck()
    {
        return $this->hasOne(ChapterCheck::class)->latest();
    }
}
