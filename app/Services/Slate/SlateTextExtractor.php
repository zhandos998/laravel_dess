<?php

namespace App\Services\Slate;

// use PhpOffice\PhpWord\Shared\XMLWriter;

class SlateTextExtractor
{
    public function extract(?array $nodes): string
    {
        if (!$nodes) return '';

        $text = '';

        foreach ($nodes as $node) {
            if (isset($node['children'])) {
                foreach ($node['children'] as $child) {
                    if (isset($child['text'])) {
                        $text .= $child['text'] . " ";
                    }
                }
            }
        }

        return trim($text);
    }
}
