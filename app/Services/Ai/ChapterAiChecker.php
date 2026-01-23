<?php

namespace App\Services\Ai;

use OpenAI\Laravel\Facades\OpenAI;


class ChapterAiChecker
{
    public function check(string $text): array
    {
        // return [
        //     'ok' => false,
        //     'errors' => [
        //         [
        //             'type' => 'spelling',
        //             'message' => 'Найдено слово с ошибкой',
        //             'fragment' => 'програмирование',
        //         ],
        //     ],
        //     'summary' => 'Найдены орфографические ошибки',
        // ];
        try {
            $content = <<<PROMPT
Ты выступаешь как научный редактор и эксперт по оформлению нормативных и справочных источников.

Проверь текст главы по следующим критериям:
1. Орфография
2. Грамматика
3. Научно-деловой стиль
4. Корректность оформления ссылок на:
   - международные стандарты (ISO)
   - законы и подзаконные акты
   - приказы государственных органов
   - внутренние нормативные документы организаций

ВАЖНО:
- НЕ проверяй документы через интернет
- НЕ утверждай, действует ли документ на текущую дату
- НЕ придумывай факты
- Если актуальность или редакция требует ручной проверки — укажи это явно

Для каждой найденной проблемы укажи:
- тип ошибки
- краткое описание
- фрагмент текста

Ответь СТРОГО в JSON следующего формата:
{
  "ok": boolean,
  "errors": [
    {
      "type": "spelling | grammar | style | reference",
      "message": string,
      "fragment": string
    }
  ],
  "summary": string
}

Текст главы:
$text
PROMPT;

            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'temperature' => 0,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' =>
                        'Ты научный редактор. Отвечай строго JSON.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $content
                    ]
                ],
            ]);

            return json_decode(
                $response->choices[0]->message->content,
                true
            );
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'errors' => [
                    [
                        'type' => 'system',
                        'message' => 'Ошибка AI: ' . $e->getMessage(),
                        'fragment' => '',
                    ],
                ],
                'summary' => 'Ошибка проверки',
            ];
        }
    }
}
