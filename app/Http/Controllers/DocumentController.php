<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use Symfony\Component\HttpFoundation\StreamedResponse;
// use PhpOffice\PhpWord\Shared\XMLWriter;

class DocumentController extends Controller
{
    private bool $enableNumbering = true;
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
                'firstLine' => 0 * 567, // 1.25 см
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

        $this->addPageNumberFooter($section);

        // $section = $phpWord->addSection([
        //     'marginLeft'   => 3 * 567,
        //     'marginRight'  => 1 * 567,
        //     'marginTop'    => 2 * 567,
        //     'marginBottom' => 2 * 567,
        // ]);

        // 🟦 Заголовок документа
        // $section->addTitle($document->title, 1);

        $this->renderCover($phpWord, $document);
        // ❌ выключаем нумерацию
        $this->enableNumbering = false;

        $section->addTitle('Предисловие', 1);
        $this->renderSlateToDocx($section, $document->preface);
        $section->addPageBreak();

        $section->addTitle('Содержание', 1);
        $section->addTOC();
        $section->addPageBreak();

        // ✅ включаем обратно
        $this->enableNumbering = true;

        // ❗ сбрасываем счётчики перед главами
        $this->numbering = [];
        $this->lastLevel = 2;



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
        $level = max(2, $node['level'] ?? 2);

        $indentation = $this->insideTable
            ? $this->getTableIndent()
            : $this->getIndentByLevel($level);

        $textRun = $section->addTextRun([
            'indentation' => $indentation,
            'spacing' => 0,
            'spaceAfter' => 100,
            'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::BOTH,
        ]);

        $hasText = $this->paragraphHasText($node);

        if (
            $this->enableNumbering &&
            !$this->insideTable &&
            $hasText
        ) {
            $number = $this->getParagraphNumber($level);
            $textRun->addText($number, [
                'name' => 'Times New Roman',
                'size' => 14,
            ]);
        }

        if ($this->paragraphHasText($node)) {
            $textRun->addText(' ');

            foreach ($node['children'] ?? [] as $leaf) {

                // if (($leaf['type'] ?? '') === 'math') {
                //     $this->addMathOMML($section, $leaf['latex']);
                //     continue;
                // }

                if (($leaf['type'] ?? '') === 'inline-image') {
                    $this->addInlineImage($textRun, $leaf);
                    continue;
                }

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

        $text = $leaf['text'] ?? '';

        // print("<pre>");

        if (!mb_check_encoding($text, 'UTF-8')) {
            $text = mb_convert_encoding($text, 'UTF-8', 'Windows-1251');
        }
        $lines = preg_split("/\R/u", $text);
        // print_r($lines);

        foreach ($lines as $i => $line) {
            if ($i > 0) {
                $textRun->addTextBreak();
            }

            if ($line !== '') {
                $textRun->addText($line, $style);
            }
        }
        // $textRun->addText($leaf['text'] ?? '', $style);
    }

    private function addInlineImage($textRun, array $leaf)
    {
        if (empty($leaf['url'])) {
            return;
        }

        // base64 → файл
        if (preg_match('/base64,(.*)$/', $leaf['url'], $matches)) {
            $imageData = base64_decode($matches[1]);
        } else {
            return;
        }

        $tmp = tempnam(sys_get_temp_dir(), 'img_');
        file_put_contents($tmp, $imageData);

        $textRun->addImage($tmp, [
            'width'  => $leaf['width'] ?? 100,
            'height' => $leaf['height'] ?? 100,
            'wrappingStyle' => 'inline',
        ]);

        // unlink($tmp);
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
        $base = 0 * 567; // 1.25 см
        $step = 1.25 * 567;

        return [
            'left'      => $base + ($level - 2) * $step,
            'firstLine' => $step,
        ];
    }

    private function getTableIndent(): array
    {
        return [
            'left' => 0.25 * 567, // 1 см
            'right' => 0.25 * 567, // 1 см
        ];
    }

    private function renderCover(PhpWord $phpWord, Document $document): void
    {
        $cover = $document->cover ?? [];

        $section = $phpWord->addSection([
            'marginLeft'   => 3 * 567,
            'marginRight'  => 1 * 567,
            'marginTop'    => 2 * 567,
            'marginBottom' => 2 * 567,
        ]);

        $center = ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER];

        $section->addText($cover['organization'] ?? '', [
            'bold' => true,
            'size' => 14,
        ], $center);

        $section->addTextBreak(1);

        $section->addText($cover['system'] ?? '', [
            'bold' => true,
            'size' => 14,
        ], $center);

        $section->addTextBreak(2);

        $section->addText($cover['document_type'] ?? '', [
            'size' => 14,
        ], $center);

        $section->addTextBreak(1);

        $section->addText($cover['document_name'] ?? '', [
            'bold' => true,
            'size' => 14,
            'allCaps' => true,
        ], $center);

        $section->addTextBreak(1);

        if (!empty($cover['iso'])) {
            $section->addText($cover['iso'], ['size' => 12], $center);
        }

        $section->addTextBreak(2);

        if (!empty($cover['code'])) {
            $section->addText($cover['code'], ['size' => 12], $center);
        }

        $section->addTextBreak(8);

        $section->addText(
            ($cover['city'] ?? '') . ', ' . ($cover['year'] ?? ''),
            ['size' => 12],
            $center
        );
    }

    private function addPageNumberFooter($section): void
    {
        $footer = $section->addFooter();

        $footer->addPreserveText(
            '{PAGE}',
            [
                'name' => 'Times New Roman',
                'size' => 14,
            ],
            [
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
            ]
        );
    }

    // private function renderToc($section, Document $document): void
    // {
    //     $section->addTitle('Содержание', 1);

    //     $section->addTextRun()->addText('Предисловие');

    //     foreach ($document->chapters()->orderBy('position')->get() as $chapter) {
    //         $section->addTextRun()->addText(
    //             $chapter->position . ' ' . $chapter->title
    //         );
    //     }
    // }

    // private function addMath($section, string $omml)
    // {
    //     $xmlWriter = new XMLWriter(XMLWriter::STORAGE_MEMORY);
    //     $xmlWriter->writeRaw($omml);

    //     $section->addObject($xmlWriter->getData());
    // }

    // private function addMathOMML($section, string $latex)
    // {
    //     $escaped = htmlspecialchars($latex, ENT_XML1);

    //     $omml = <<<XML
    //         <w:oMathPara xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    //         <w:oMath>
    //             <w:sSup>
    //             <w:e><w:r><w:t>x</w:t></w:r></w:e>
    //             <w:sup><w:r><w:t>2</w:t></w:r></w:sup>
    //             </w:sSup>
    //         </w:oMath>
    //         </w:oMathPara>
    //         XML;

    //     $this->addMathOMMLRaw($section, $omml);

    //     $section->addTextRun()->addText($omml, [], ['preserveLineBreaks' => true]);
    // }

    // private function addMathOMMLRaw($section, string $omml)
    // {
    //     $writer = new XMLWriter(XMLWriter::STORAGE_MEMORY);
    //     $writer->writeRaw($omml);

    //     $section->addObject($writer->getData());
    // }

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
        $document->update(
            $request->only(['title', 'cover', 'preface'])
        );

        return response()->json();
    }
}
