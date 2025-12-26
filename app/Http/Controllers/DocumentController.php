<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
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
