<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChapterController extends Controller
{
    public function store(Request $request, Document $document)
    {
        $chapter = $document->chapters()->create([
            'title' => ($document->chapters()->max('position') + 1) . ' Глава',
            'content' => [
                [
                    'type' => 'paragraph',
                    'children' => [
                        ['text' => '']
                    ],
                ],
            ],
            'open' => true,
            'position' => $document->chapters()->max('position') + 1,
        ]);
        return response()->json($chapter);
    }

    public function update(Request $request, Chapter $chapter)
    {
        $data = [];

        if ($request->has('title')) {
            $data['title'] = $request->title ?? '';
        }

        if ($request->has('content')) {
            $content = $request->input('content');

            // если null или не массив — создаём дефолт
            if (!is_array($content) || empty($content)) {
                $content = [
                    [
                        'type' => 'paragraph',
                        'children' => [
                            ['text' => ''],
                        ],
                    ],
                ];
            }

            // чистим Slate-нодЫ (на всякий случай)
            foreach ($content as &$node) {
                if (
                    !isset($node['children']) ||
                    !is_array($node['children']) ||
                    empty($node['children'])
                ) {
                    $node['children'] = [
                        ['text' => ''],
                    ];
                }

                foreach ($node['children'] as &$child) {
                    if (!isset($child['text']) || $child['text'] === null) {
                        $child['text'] = '';
                    }
                }
            }

            $data['content'] = $content;
        }

        if ($request->has('open')) {
            $data['open'] = (bool) $request->open;
        }

        $chapter->update($data);

        return response()->json($chapter);
    }
}
