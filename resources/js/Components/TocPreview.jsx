export default function TocPreview({ chapters }) {
    const items = chapters
        .filter((ch) => ch.title && ch.title.trim() !== "")
        .sort((a, b) => a.position - b.position);

    return (
        <div className="mb-6 bg-white border rounded p-6">
            <h2 className="text-lg font-bold mb-4">Содержание</h2>

            <ol className="list-decimal pl-5 space-y-1">
                <li>Предисловие</li>
                {items.map((ch, i) => (
                    <li key={ch.id}>
                        {i + 1}. {ch.title}
                    </li>
                ))}
            </ol>
        </div>
    );
}
