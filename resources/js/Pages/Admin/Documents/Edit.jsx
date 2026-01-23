import { useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useRef } from "react";

import AdminLayout from "@/Layouts/AdminLayout";
import SlateEditor from "@/Components/SlateEditor";
import CoverEditor from "@/Components/CoverEditor";
// import TocPreview from "@/Components/TocPreview";

const MIN_LEVEL = 2;

export default function Edit({ document }) {
    const [title, setTitle] = useState(document.title);
    // const [jsonCode, setJsonCode] = useState(
    //     document.json_code || { chapters: [] }
    // );
    const [chapters, setChapters] = useState(
        (document.chapters || []).map((c) => ({
            ...c,
            open: Boolean(c.open),
            checkStatus: "idle", // idle | checking | ok | error
            checkResult: null,
        }))
    );
    const checkChapter = async (chapterId) => {
        setChapters((prev) =>
            prev.map((ch) =>
                ch.id === chapterId
                    ? { ...ch, checkStatus: "checking", checkResult: null }
                    : ch
            )
        );

        try {
            const res = await axios.post(`/admin/chapters/${chapterId}/check`);

            setChapters((prev) =>
                prev.map((ch) =>
                    ch.id === chapterId
                        ? {
                              ...ch,
                              checkStatus:
                                  res.data.status === "ok" ? "ok" : "error",
                              checkResult: res.data.result,
                          }
                        : ch
                )
            );
        } catch (e) {
            setChapters((prev) =>
                prev.map((ch) =>
                    ch.id === chapterId
                        ? {
                              ...ch,
                              checkStatus: "error",
                              checkResult: {
                                  summary: "Ошибка запроса к серверу",
                                  errors: [],
                              },
                          }
                        : ch
                )
            );
        }
    };

    const downloadDocumentJson = () => {
        const data = {
            document: {
                id: document.id,
                title: document.title,
            },
            chapters: chapters.map((ch) => ({
                id: ch.id,
                title: ch.title,
                position: ch.position,
                content: ch.content,
            })),
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });

        const url = URL.createObjectURL(blob);
        const a = window.document.createElement("a");

        a.href = url;
        a.download = `document-${document.id}.json`;
        a.click();

        URL.revokeObjectURL(url);
    };

    const downloadChapterJson = (chapter) => {
        const data = {
            chapter: {
                id: chapter.id,
                title: chapter.title,
                position: chapter.position,
            },
            content: chapter.content,
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });

        const url = URL.createObjectURL(blob);
        const a = window.document.createElement("a"); // ✅ ИСПРАВЛЕНО

        a.href = url;
        a.download = `chapter-${chapter.position}.json`;
        a.click();

        URL.revokeObjectURL(url);
    };

    const toggleChapter = (id) => {
        setChapters((prev) =>
            prev.map((chapter) =>
                chapter.id === id
                    ? { ...chapter, open: !chapter.open }
                    : chapter
            )
        );

        axios.put(`/admin/chapters/${id}`, {
            open: !chapters.find((c) => c.id === id).open,
        });
    };

    const addChapter = async () => {
        const response = await axios.post(
            `/admin/documents/${document.id}/chapters`
        );

        setChapters((prev) => [...prev, response.data]);
    };

    const updateChapter = async (id, data) => {
        setChapters((prev) =>
            prev.map((ch) => (ch.id === id ? { ...ch, ...data } : ch))
        );

        await axios.put(`/admin/chapters/${id}`, data);
    };

    const updateTitle = async (value) => {
        setTitle(value);

        await axios.put(`/admin/documents/${document.id}`, {
            title: value,
        });
    };

    const normalizeChapterData = (data) => {
        const result = { ...data };

        if (
            "title" in result &&
            (result.title === null || result.title === undefined)
        ) {
            result.title = "";
        }

        if ("content" in result && !Array.isArray(result.content)) {
            result.content = [
                {
                    type: "paragraph",
                    level: MIN_LEVEL,
                    children: [{ text: "" }],
                },
            ];
        }

        if ("open" in result) {
            result.open = Boolean(result.open);
        }

        return result;
    };

    const updateChapterLocal = (id, data) => {
        const normalizedData = normalizeChapterData(data);

        setChapters((prev) =>
            prev.map((ch) => (ch.id === id ? { ...ch, ...normalizedData } : ch))
        );
    };
    const [preface, setPreface] = useState(
        document.preface || [{ type: "paragraph", children: [{ text: "" }] }]
    );
    const updatePreface = async (value) => {
        setPreface(value);

        await axios.put(`/admin/documents/${document.id}`, {
            preface: value,
        });
    };
    const chaptersRef = useRef(chapters);

    // всегда держим ref актуальным
    useEffect(() => {
        chaptersRef.current = chapters;
    }, [chapters]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!chaptersRef.current.length) return;

            console.log("💾 autosave all chapters");

            chaptersRef.current.forEach((chapter) => {
                axios.put(`/admin/chapters/${chapter.id}`, {
                    title: chapter.title,
                    content: chapter.content,
                    open: chapter.open,
                });
            });
        }, 60_000); // ✅ 1 минута

        return () => clearInterval(interval);
    }, []);

    // console.log("DOCUMENT:", document);
    // console.log("CHAPTERS:", chapters);
    // chapters.forEach((ch, i) => {
    //     console.log(`chapter[${i}].content =`, ch.content);
    // });
    return (
        <AdminLayout>
            {/* Название документа */}
            <div className="mb-6">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => updateTitle(e.target.value)}
                    // onBlur={(e) => updateTitle(e.target.value)}
                    className="w-full text-2xl font-bold border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#21397D]"
                />
            </div>

            {/* Кнопки */}

            <button
                onClick={downloadDocumentJson}
                className="mb-4 px-4 py-2 bg-[#21397D] text-white rounded"
            >
                Скачать JSON
            </button>

            <button
                onClick={() =>
                    (window.location.href = `/admin/documents/${document.id}/export-docx`)
                }
                className="mb-4 ml-2 px-4 py-2 bg-green-700 text-white rounded"
            >
                Скачать DOCX
            </button>

            {/* 1. Титульный лист */}
            <CoverEditor document={document} />

            {/* 2. Предисловие */}
            <div className="border p-4 bg-white rounded mb-6">
                <h2 className="font-bold text-lg mb-2">Предисловие</h2>
                <SlateEditor value={preface} onChange={updatePreface} />
            </div>

            {/* 3. Содержание */}
            {/* <TocPreview chapters={chapters} /> */}

            {/* 4. Основные главы */}
            {/* <ChaptersEditor /> */}

            <div className="mb-4">
                <button
                    onClick={addChapter}
                    className="px-4 py-2 bg-[#21397D] text-white rounded hover:bg-[#1e2d63]"
                >
                    + Добавить главу
                </button>
            </div>
            {/* Главы */}
            <div className="space-y-4">
                {chapters.length === 0 ? (
                    <div className="text-gray-500 bg-white p-6 rounded border">
                        Глав пока нет
                    </div>
                ) : (
                    chapters.map((chapter) => (
                        <div
                            key={chapter.id}
                            className="border border-gray-200 rounded"
                        >
                            {/* Заголовок главы */}
                            <div
                                onClick={() => toggleChapter(chapter.id)}
                                className="cursor-pointer px-4 py-3 bg-gray-100 font-semibold flex justify-between items-center"
                            >
                                <input
                                    value={chapter.title}
                                    onChange={(e) =>
                                        updateChapter(chapter.id, {
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-1"
                                />

                                <div className="flex gap-2">
                                    {/* <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            downloadChapterJson(chapter);
                                        }}
                                        className="text-sm px-2 py-1 border rounded bg-white hover:bg-gray-50"
                                    >
                                        JSON
                                    </button> */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            checkChapter(chapter.id);
                                        }}
                                        disabled={
                                            chapter.checkStatus === "checking"
                                        }
                                        className="text-sm px-2 py-1 border rounded bg-white hover:bg-gray-50"
                                    >
                                        Проверить
                                    </button>

                                    <span>{chapter.open ? "−" : "+"}</span>
                                </div>
                            </div>
                            {/* Контент главы */}
                            {chapter.open && (
                                <div className="px-4 py-3 bg-white">
                                    <SlateEditor
                                        chapterPosition={chapter.position}
                                        value={
                                            chapter.content &&
                                            chapter.content.length > 0
                                                ? chapter.content
                                                : [
                                                      {
                                                          type: "paragraph",
                                                          level: MIN_LEVEL,
                                                          children: [
                                                              { text: "" },
                                                          ],
                                                      },
                                                  ]
                                        }
                                        onChange={(content) =>
                                            updateChapterLocal(chapter.id, {
                                                content,
                                            })
                                        }
                                    />
                                </div>
                            )}
                            <div className="px-4 pb-3 text-sm">
                                {chapter.checkStatus === "checking" && (
                                    <span className="text-gray-500">
                                        ⏳ Проверяется…
                                    </span>
                                )}

                                {chapter.checkStatus === "ok" && (
                                    <span className="text-green-600">
                                        ✅ Всё хорошо
                                    </span>
                                )}

                                {chapter.checkStatus === "error" && (
                                    <span className="text-red-600">
                                        ❌{" "}
                                        {chapter.checkResult?.summary ||
                                            "Найдены ошибки"}
                                    </span>
                                )}
                            </div>
                            {chapter.checkStatus === "error" &&
                                chapter.checkResult?.errors?.length > 0 && (
                                    <div className="mt-2 border rounded bg-red-50 p-3 text-sm">
                                        <ul className="list-disc pl-5 space-y-1">
                                            {chapter.checkResult.errors.map(
                                                (err, i) => (
                                                    <li key={i}>
                                                        <b>{err.type}:</b>{" "}
                                                        {err.message}
                                                        {err.fragment && (
                                                            <div className="text-gray-600 italic">
                                                                «{err.fragment}»
                                                            </div>
                                                        )}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
