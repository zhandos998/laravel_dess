<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chapter_checks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('chapter_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->enum('status', ['checking', 'ok', 'error'])->default('checking');

            $table->json('result')->nullable();
            /*
      result:
      {
        ok: boolean,
        errors: [
          { type, message, fragment }
        ],
        summary: string,
        links: [
          { url, status, http_code }
        ]
      }
    */

            $table->string('model')->default('gpt-4o-mini');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chapter_checks');
    }
};
