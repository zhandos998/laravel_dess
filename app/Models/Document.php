<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Document extends Model
{
    protected $table = 'documents';

    protected $fillable = [
        'id',
        'uuid',
        'title',
        'json_code',
        'cover',
        'preface',

    ];

    protected $casts = [
        'json_code' => 'array',
        'cover' => 'array',
        'preface' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->uuid) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }
}
