import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function DocumentEditor() {
    const documentId = 1;

    const [documentTitle, setDocumentTitle] = useState(
        `Документ ${documentId}`
    );

    const [chapters, setChapters] = useState([
        {
            id: 1,
            title: `${documentId} глава`,
            open: false,
        },
    ]);

    const toggleChapter = (id) => {
        setChapters((prev) =>
            prev.map((chapter) =>
                chapter.id === id
                    ? { ...chapter, open: !chapter.open }
                    : chapter
            )
        );
    };

    return (
        <AdminLayout>
            {/* Заголовок документа */}
            <div className="mb-6">
                <input
                    type="text"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className="w-full text-2xl font-bold border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#21397D]"
                />
            </div>

            {/* Кнопка создания главы */}
            <div className="mb-6">
                <button className="px-4 py-2 bg-[#21397D] text-white rounded hover:bg-[#1e2d63] transition">
                    Создать главу
                </button>
            </div>

            {/* Список глав */}
            <div className="space-y-4">
                {chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        className="border border-gray-200 rounded"
                    >
                        {/* Заголовок главы */}
                        <div
                            onClick={() => toggleChapter(chapter.id)}
                            className="cursor-pointer px-4 py-3 bg-gray-100 font-semibold flex justify-between items-center"
                        >
                            {chapter.title}
                            <span>{chapter.open ? "−" : "+"}</span>
                        </div>

                        {/* Контент главы */}
                        {chapter.open && (
                            <div className="px-4 py-3 text-gray-600">
                                Здесь будет контент главы
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
