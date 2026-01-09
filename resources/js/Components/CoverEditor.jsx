import axios from "axios";
import { useState } from "react";

export default function CoverEditor({ document }) {
    const [cover, setCover] = useState(
        document.cover || {
            organization: "",
            system: "",
            document_type: "",
            document_name: "",
            iso: "",
            code: "",
            city: "",
            year: new Date().getFullYear(),
        }
    );

    const updateCover = async (field, value) => {
        const newCover = { ...cover, [field]: value };
        setCover(newCover);

        await axios.put(`/admin/documents/${document.id}`, {
            cover: newCover,
        });
    };

    return (
        <div className="mb-6 bg-white border rounded p-6">
            <h2 className="text-lg font-bold mb-4">Титульный лист</h2>

            {[
                ["organization", "Организация"],
                ["system", "Система"],
                ["document_type", "Вид документа"],
                ["document_name", "Название документа"],
                ["iso", "Стандарты ISO"],
                ["code", "Код документа"],
                ["city", "Город"],
                ["year", "Год"],
            ].map(([key, label]) => (
                <input
                    key={key}
                    value={cover[key] || ""}
                    onChange={(e) => updateCover(key, e.target.value)}
                    placeholder={label}
                    className="w-full mb-2 border px-3 py-2 rounded"
                />
            ))}
        </div>
    );
}
