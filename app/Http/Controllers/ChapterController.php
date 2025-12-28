<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChapterController extends Controller
{

    public function sanitizeSlateNodes(array $nodes): array
    {
        $result = [];

        foreach ($nodes as $node) {

            // ✅ LEAF NODE (text + marks)
            if (array_key_exists('text', $node)) {
                $cleanLeaf = [
                    'text' => is_string($node['text']) ? $node['text'] : '',
                ];

                // ✅ разрешённые marks
                foreach (['bold', 'italic', 'underline'] as $mark) {
                    if (!empty($node[$mark])) {
                        $cleanLeaf[$mark] = true;
                    }
                }

                $result[] = $cleanLeaf;
                continue;
            }

            // ✅ ELEMENT NODE
            $cleanNode = $node;

            unset($cleanNode['text']);

            if (
                !isset($cleanNode['children']) ||
                !is_array($cleanNode['children']) ||
                empty($cleanNode['children'])
            ) {
                $cleanNode['children'] = [
                    ['text' => ''],
                ];
            }

            // 🔁 рекурсия
            $cleanNode['children'] = $this->sanitizeSlateNodes(
                $cleanNode['children']
            );

            $result[] = $cleanNode;
        }

        return $result;
    }




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

            $data['content'] = $this->sanitizeSlateNodes($content);
        }

        if ($request->has('open')) {
            $data['open'] = (bool) $request->open;
        }

        $chapter->update($data);

        return response()->json($chapter);
    }
}
