<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DocumentController;
// use App\Http\Controllers\DocController;
use App\Http\Controllers\AiLogController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\ChapterCheckController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware('auth')->group(
    function () {
        Route::get('/dashboard', [HomeController::class, 'dashboard'])->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::post('/chat/send', [ChatController::class, 'send']);
        Route::post('/chat/new', [ChatController::class, 'createChat']);
        Route::get('/chat/{chat}', [ChatController::class, 'loadChat']);

        Route::get('/chats', [ChatController::class, 'listChats']);
        Route::delete('/chat/{chat}', [ChatController::class, 'delete'])->name('chat.delete');


        Route::get('/admin', [DocumentController::class, 'dashboard'])->name('admin.dashboard');
        // Route::resource('/admin/documents', DocumentController::class);
        Route::get('/admin/ai-logs', [AiLogController::class, 'index'])->name('admin.ai-logs.index');
        Route::get('/admin/ai-logs/{id}', [AiLogController::class, 'show'])->name('admin.ai-logs.show');

        Route::get('/admin/documents', [DocumentController::class, 'index'])->name('documents.index');   // список документов
        Route::put('/admin/documents/{document}', [DocumentController::class, 'update'])->name('documents.update');   // список документов
        Route::post('/admin/documents', [DocumentController::class, 'store'])->name('documents.store'); // создать документ
        Route::get('/admin/documents/{uuid}', [DocumentController::class, 'edit'])->name('documents.edit'); // редактирование

        Route::post('/admin/documents/{document}/chapters', [ChapterController::class, 'store']);
        Route::put('/admin/chapters/{chapter}', [ChapterController::class, 'update']);
        Route::post('/admin/chapters/{chapter}/check', [ChapterCheckController::class, 'check']);

        Route::get('/admin/documents/{document}/export-docx', [DocumentController::class, 'exportDocx']);
    }
);
