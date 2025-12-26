import AdminLayout from "@/Layouts/AdminLayout";
import { router, Link } from "@inertiajs/react";

export default function Index({ documents }) {
    const createDocument = () => {
        router.post("/admin/documents");
    };

    return (
        <AdminLayout>
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#21397D]">
                        Документы
                    </h1>
                    <p className="text-gray-600">Список всех документов</p>
                </div>

                <button
                    onClick={createDocument}
                    className="px-4 py-2 bg-[#21397D] text-white rounded hover:bg-[#1e2d63] transition"
                >
                    + Создать документ
                </button>
            </div>

            {/* Список документов */}
            {documents.length === 0 ? (
                <div className="text-gray-500 bg-white p-6 rounded border">
                    Документов пока нет
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <Link
                            key={doc.id}
                            href={`/admin/documents/${doc.uuid}`}
                            className="bg-white border border-gray-100 rounded-lg p-5 shadow hover:shadow-lg transition block"
                        >
                            <h2 className="text-lg font-semibold text-[#21397D] mb-1">
                                {doc.title}
                            </h2>

                            <p className="text-sm text-gray-500">
                                ID: {doc.id}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
