<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\ChapterCheck;
use App\Services\Ai\ChapterAiChecker;
use App\Services\Slate\SlateTextExtractor;

// use PhpOffice\PhpWord\Shared\XMLWriter;

class ChapterCheckController extends Controller
{
    public function check(Chapter $chapter)
    {
        // 1️⃣ создаём запись "проверяется"
        $check = ChapterCheck::create([
            'chapter_id' => $chapter->id,
            'status' => 'checking',
        ]);

        // 2️⃣ извлекаем текст из Slate JSON
        $plainText = app(SlateTextExtractor::class)
            ->extract($chapter->content);

        // 3️⃣ вызываем AI
        $aiResult = app(ChapterAiChecker::class)
            ->check($plainText);

        // 4️⃣ обновляем результат
        $check->update([
            'status' => $aiResult['ok'] ? 'ok' : 'error',
            'result' => $aiResult,
        ]);

        return response()->json($check);
    }
}
