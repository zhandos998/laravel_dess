import { useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Transforms, Editor, Path } from "slate";

const EMPTY_VALUE = [
    {
        type: "paragraph",
        level: 1,
        children: [{ text: "" }],
    },
];

// 🔢 Генерация 1.1 / 1.2.1
function generatePositions(nodes) {
    const counters = [];

    return nodes.map((node) => {
        if (node.type !== "paragraph") return node;

        const level = node.level || 1;

        counters[level - 1] = (counters[level - 1] || 0) + 1;
        counters.length = level;

        return {
            ...node,
            position: counters.join("."),
        };
    });
}

function computePositions(nodes) {
    const counters = [];

    return nodes.map((node) => {
        if (node.type !== "paragraph") return null;

        const level = node.level || 1;

        counters[level - 1] = (counters[level - 1] || 0) + 1;
        counters.length = level;

        return counters.join(".");
    });
}


// 🧱 Рендер абзаца с номером
const ParagraphElement = ({ attributes, children, position }) => {
    return (
        <div {...attributes} className="flex gap-3">
            <span className="text-gray-400 w-16 select-none">
                {position}
            </span>
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default function SlateEditor({ value, onChange }) {
    const editor = useMemo(() => withReact(createEditor()), []);

    const safeValue =
        Array.isArray(value) && value.length > 0 ? value : EMPTY_VALUE;
    
const positions = computePositions(editor.children);

    const renderElement = useCallback(
        (props) => {
            if (props.element.type === "paragraph") {
                const index = editor.children.indexOf(props.element);
                const position = positions[index];

                return (
                    <ParagraphElement
                        {...props}
                        position={position}
                    />
                );
            }

            return <ParagraphElement {...props} />;
        },
        [editor.children]
    );

    const handleChange = (newValue) => {
        const normalized = generatePositions(newValue);
        onChange(normalized);
    };

    const handleKeyDown = (event) => {
        // const [match] = editor.selection
        //     ? Array.from(
        //           editor.nodes({
        //               match: (n) => n.type === "paragraph",
        //           })
        //       )
        //     : [];

        // if (!match) return;

        // const [node] = match;

        // ENTER → новый пункт
        if (event.key === "Enter") {
            event.preventDefault();

            const { selection } = editor;
            if (!selection) return;

            // ⬅️ ИЩЕМ paragraph ВЫШЕ text-ноды
            const entry = Editor.above(editor, {
                match: (n) => n.type === "paragraph",
            });

            if (!entry) return;

            const [node, path] = entry;

            Transforms.insertNodes(
                editor,
                {
                    type: "paragraph",
                    level: node.level || 1,
                    children: [{ text: "" }],
                },
                {
                    at: Path.next(path), // ⬅️ ВСТАВКА ПОСЛЕ paragraph
                    select: true,
                }
            );
        }

        // TAB → вложенность
        if (event.key === "Tab") {
            event.preventDefault();

            Transforms.setNodes(editor, {
                level: event.shiftKey
                    ? Math.max(1, (node.level || 1) - 1)
                    : (node.level || 1) + 1,
            });
        }
    };

    return (
        <Slate
            editor={editor}
            initialValue={safeValue}
            onChange={handleChange}
        >
            <Editable
                className="border rounded p-3 min-h-[120px]"
                placeholder="Начните писать..."
                renderElement={renderElement}
                onKeyDown={handleKeyDown}
            />
        </Slate>
    );
}
