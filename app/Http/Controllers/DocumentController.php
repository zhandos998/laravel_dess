<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    private array $numbering = [];
    private int $lastLevel = 2;
    private bool $insideTable = false;

    public function exportDocx(Document $document)
    {
        $phpWord = new PhpWord();
        $phpWord->setDefaultFontName('Times New Roman');
        $phpWord->setDefaultFontSize(14);
        // $section = $phpWord->addSection();

        $phpWord->addTitleStyle(1, [
            'name' => 'Times New Roman',
            'size' => 14,
            'bold' => true,
            'allCaps' => true
        ], [
            'spaceBefore' => 0.75 * 567, // 1 см ДО
            'spaceAfter'  => 0.75 * 567, // 1 см ПОСЛЕ
            'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::BOTH,
        ]);

        $phpWord->addParagraphStyle('MainParagraph', [
            'indentation' => [
                'left'      => 1.25 * 567, // ОБЯЗАТЕЛЬНО
                'firstLine' => 1.25 * 567, // 1.25 см
            ],
            'spacing' => 0,
            'spaceAfter' => 0,
            'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::BOTH,
        ]);

        $section = $phpWord->addSection([
            'marginLeft'   => 3 * 567, // 1701
            'marginRight'  => 1 * 567, // 567
            'marginTop'    => 2 * 567, // 1134
            'marginBottom' => 2 * 567, // 1134
        ]);
        // 🟦 Заголовок документа
        // $section->addTitle($document->title, 1);

        foreach ($document->chapters()->orderBy('position')->get() as $chapter) {

            $chapterTitle = $chapter->position . ' ' . $chapter->title;

            $section->addTitle($chapterTitle, 1);

            // 🔄 Сброс нумерации для главы
            $this->numbering = [
                0 => $chapter->position,
            ];
            // $this->numbering = [];
            $this->lastLevel = 2;

            $this->renderSlateToDocx($section, $chapter->content);
        }

        $fileName = 'document-' . $document->id . '.docx';

        return new StreamedResponse(function () use ($phpWord) {
            $writer = IOFactory::createWriter($phpWord, 'Word2007');
            $writer->save('php://output');
        }, 200, [
            "Content-Type" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition" => "attachment; filename=\"{$fileName}\"",
        ]);
    }

    private function renderSlateToDocx($section, array $nodes)
    {
        foreach ($nodes as $node) {

            switch ($node['type'] ?? 'paragraph') {

                case 'paragraph':
                    $this->renderParagraph($section, $node);
                    break;

                case 'table':
                    $this->renderTable($section, $node);
                    break;
            }
        }
    }

    private function renderTable($section, array $tableNode)
    {
        $this->insideTable = true;

        $tableWidth = 17 * 567; // рабочая ширина страницы
        $columnsCount = count($tableNode['children'][0]['children'] ?? []);
        $cellWidth = $columnsCount > 0 ? $tableWidth / $columnsCount : $tableWidth;

        $table = $section->addTable([
            'width' => $tableWidth,
            'unit' => \PhpOffice\PhpWord\SimpleType\TblWidth::TWIP,
            'borderSize' => 6,
            'borderColor' => '999999',
            'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::CENTER,
        ]);

        foreach ($tableNode['children'] ?? [] as $rowNode) {
            $table->addRow();

            foreach ($rowNode['children'] ?? [] as $cellNode) {
                $cell = $table->addCell($cellWidth);

                foreach ($cellNode['children'] ?? [] as $cellContent) {
                    if (($cellContent['type'] ?? '') === 'paragraph') {
                        $this->renderParagraph($cell, $cellContent);
                    }
                }
            }
        }

        $this->insideTable = false;
    }



    private function renderParagraph($section, array $node)
    {
        $level = $node['level'] ?? 2;

        $indentation = $this->insideTable
            ? $this->getTableIndent()
            : $this->getIndentByLevel($level);

        $textRun = $section->addTextRun([
            'indentation' => $indentation,
            'spacing' => 0,
            'spaceAfter' => 100,
            'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::BOTH,
        ]);

        if (!$this->insideTable) {
            $number = $this->getParagraphNumber($level);

            $textRun->addText($number, [
                'name' => 'Times New Roman',
                'size' => 14,
            ]);
        }

        if ($this->paragraphHasText($node)) {
            $textRun->addText(' ');

            foreach ($node['children'] ?? [] as $leaf) {
                $this->addTextLeaf($textRun, $leaf);
            }
        }
    }




    private function addTextLeaf($textRun, array $leaf)
    {
        $style = [
            'name' => 'Times New Roman',
            'size' => 14,
        ];

        if (!empty($leaf['bold'])) {
            $style['bold'] = true;
        }

        if (!empty($leaf['italic'])) {
            $style['italic'] = true;
        }

        if (!empty($leaf['underline'])) {
            $style['underline'] = 'single';
        }

        $textRun->addText($leaf['text'] ?? '', $style);
    }

    private function getParagraphNumber(int $level): string
    {
        // 1️⃣ если уровень тот же — увеличиваем
        if ($level === $this->lastLevel) {
            $this->numbering[$level] = ($this->numbering[$level] ?? 0) + 1;
        }

        // 2️⃣ если ушли глубже
        elseif ($level > $this->lastLevel) {
            $this->numbering[$level] = 1;
        }

        // 3️⃣ если поднялись выше
        else {
            // сбрасываем все уровни глубже
            foreach ($this->numbering as $lvl => $_) {
                if ($lvl > $level) {
                    unset($this->numbering[$lvl]);
                }
            }

            $this->numbering[$level] = ($this->numbering[$level] ?? 0) + 1;
        }

        $this->lastLevel = $level;

        ksort($this->numbering);

        return implode('.', $this->numbering);
    }



    private function paragraphHasText(array $node): bool
    {
        foreach ($node['children'] ?? [] as $leaf) {
            if (!empty(trim($leaf['text'] ?? ''))) {
                return true;
            }
        }
        return false;
    }

    private function getIndentByLevel(int $level): array
    {
        $base = 1.25 * 567; // 1.25 см
        $step = 1.25 * 567;

        return [
            'left'      => $base + ($level - 2) * $step,
            // 'firstLine' => $step,
        ];
    }

    private function getTableIndent(): array
    {
        return [
            'left' => 0.25 * 567, // 1 см
            'right' => 0.25 * 567, // 1 см
        ];
    }


    // 🏠


    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    // 1. Список документов
    public function index()
    {
        $documents = Document::all();

        return inertia('Admin/Documents/Index', [
            'documents' => $documents,
        ]);
    }

    // 2. Создание пустого документа
    public function store()
    {
        $document = Document::create([
            'title' => 'Документ',
            'json_code' => [
                'chapters' => [],
            ],
        ]);


        $document->title = 'Документ ' . $document->id;
        $document->save();

        return redirect()->route('documents.edit', $document->uuid);
    }

    // 3. Редактирование документа
    public function edit($uuid)
    {
        $document = Document::where('uuid', $uuid)->firstOrFail();

        return inertia('Admin/Documents/Edit', [
            'document' => $document->load('chapters'),
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $document->update([
            'title' => $request->title,
        ]);

        return response()->json();
    }
}
