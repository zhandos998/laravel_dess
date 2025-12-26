import { useState } from "react";

const generatePositions = (blocks) => {
    const counters = [];

    return blocks.map((block) => {
        if (block.type !== "paragraph") return block;

        counters[block.level - 1] = (counters[block.level - 1] || 0) + 1;

        counters.length = block.level;

        return {
            ...block,
            position: counters.join("."),
        };
    });
};

export default function ChapterEditor({ value = [], onChange }) {
    const [blocks, setBlocks] = useState(generatePositions(value));

    const updateBlocks = (newBlocks) => {
        const withPos = generatePositions(newBlocks);
        setBlocks(withPos);
        onChange(withPos);
    };

    const onKeyDown = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const current = blocks[index];

            const newBlock = {
                id: Date.now().toString(),
                type: "paragraph",
                level: current.level,
                text: "",
            };

            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);

            updateBlocks(newBlocks);
        }

        if (e.key === "Tab") {
            e.preventDefault();

            const newBlocks = [...blocks];
            newBlocks[index].level += e.shiftKey ? -1 : 1;
            if (newBlocks[index].level < 1) {
                newBlocks[index].level = 1;
            }

            updateBlocks(newBlocks);
        }
    };

    const updateText = (index, text) => {
        const newBlocks = [...blocks];
        newBlocks[index].text = text;
        updateBlocks(newBlocks);
    };

    return (
        <div className="space-y-2">
            {blocks.map((block, index) => (
                <div
                    key={block.id}
                    className="flex items-start gap-2"
                    style={{ marginLeft: (block.level - 1) * 24 }}
                >
                    <div className="text-gray-400 w-12 select-none">
                        {block.position}
                    </div>

                    <input
                        value={block.text}
                        onChange={(e) => updateText(index, e.target.value)}
                        onKeyDown={(e) => onKeyDown(e, index)}
                        className="flex-1 border rounded px-2 py-1"
                    />
                </div>
            ))}
        </div>
    );
}
