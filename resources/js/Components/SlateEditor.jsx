import { useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Transforms, Editor, Path } from "slate";

const MIN_LEVEL = 2;

const EMPTY_VALUE = [
    {
        type: "paragraph",
        level: MIN_LEVEL,
        children: [{ text: "" }],
    },
];

const TABLE = "table";
const TABLE_ROW = "table-row";
const TABLE_CELL = "table-cell";

const findPreviousParagraph = (editor, fromIndex) => {
    for (let i = fromIndex - 1; i >= 0; i--) {
        const node = editor.children[i];
        if (node.type === "paragraph") {
            return node;
        }
    }
    return null;
};

const removeTable = (editor) => {
    const tableEntry = Editor.above(editor, {
        match: (n) => n.type === "table",
    });

    if (!tableEntry) return;

    const [, tablePath] = tableEntry;

    // Удаляем таблицу целиком
    Transforms.removeNodes(editor, { at: tablePath });

    // Вставляем пустой paragraph, чтобы курсор не потерялся
    Transforms.insertNodes(
        editor,
        {
            type: "paragraph",
            level: MIN_LEVEL,
            children: [{ text: "" }],
        },
        { at: tablePath }
    );
};

const TableElement = ({ attributes, children }) => (
    <table {...attributes} className="border-collapse border w-full my-2">
        <tbody>{children}</tbody>
    </table>
);

const TableRowElement = ({ attributes, children }) => (
    <tr {...attributes}>{children}</tr>
);

const TableCellElement = ({ attributes, children }) => (
    <td {...attributes} className="border px-2 py-1 align-top">
        {children}
    </td>
);

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

const ToolbarButton = ({ active, onMouseDown, children }) => {
    return (
        <button
            className={`px-2 py-1 border rounded text-sm ${
                active ? "bg-gray-200" : ""
            }`}
            onMouseDown={(e) => {
                e.preventDefault(); // ❗️очень важно
                onMouseDown();
            }}
        >
            {children}
        </button>
    );
};

const getPreviousParagraphLevel = (editor, tablePath) => {
    const tableIndex = tablePath[0];

    for (let i = tableIndex - 1; i >= 0; i--) {
        const node = editor.children[i];
        if (node.type === "paragraph") {
            return node.level || 1;
        }
    }

    return 1;
};

const Toolbar = ({ editor }) => {
    return (
        <div className="flex gap-2 mb-2 border-b pb-2">
            <ToolbarButton
                active={isMarkActive(editor, "bold")}
                onMouseDown={() => toggleMark(editor, "bold")}
            >
                <b>Ж</b>
            </ToolbarButton>

            <ToolbarButton
                active={isMarkActive(editor, "italic")}
                onMouseDown={() => toggleMark(editor, "italic")}
            >
                <i>К</i>
            </ToolbarButton>

            <ToolbarButton
                active={isMarkActive(editor, "underline")}
                onMouseDown={() => toggleMark(editor, "underline")}
            >
                <u>Ч</u>
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => insertTable(editor, 2, 2)}>
                Таблица
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => addRowBelow(editor)}>
                ➕ Строка
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => addColumnRight(editor)}>
                ➕ Колонна
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => removeRow(editor)}>
                ➖ Строка
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => removeColumn(editor)}>
                ➖ Колонна
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => removeTable(editor)}>
                🗑 Таблица
            </ToolbarButton>
        </div>
    );
};

const createCell = () => ({
    type: "table-cell",
    children: [
        {
            type: "paragraph",
            level: 0,
            children: [{ text: "" }],
        },
    ],
});

const addRowBelow = (editor) => {
    const tableEntry = Editor.above(editor, {
        match: (n) => n.type === "table",
    });

    if (!tableEntry) return;

    const [tableNode, tablePath] = tableEntry;

    const columnCount = tableNode.children[0].children.length;

    const newRow = {
        type: "table-row",
        children: Array.from({ length: columnCount }, createCell),
    };

    Transforms.insertNodes(editor, newRow, {
        at: [...tablePath, tableNode.children.length], // ⬅️ В КОНЕЦ
    });
};

const addColumnRight = (editor) => {
    const tableEntry = Editor.above(editor, {
        match: (n) => n.type === "table",
    });

    if (!tableEntry) return;

    const [tableNode, tablePath] = tableEntry;

    const columnIndex = tableNode.children[0].children.length; // ⬅️ ПОСЛЕДНЯЯ

    tableNode.children.forEach((row, rowIndex) => {
        const insertPath = [...tablePath, rowIndex, columnIndex];

        Transforms.insertNodes(editor, createCell(), {
            at: insertPath,
        });
    });
};

const removeRow = (editor) => {
    const tableEntry = Editor.above(editor, {
        match: (n) => n.type === "table",
    });

    if (!tableEntry) return;

    const [tableNode, tablePath] = tableEntry;

    if (tableNode.children.length <= 1) return;

    const lastRowIndex = tableNode.children.length - 1;

    Transforms.removeNodes(editor, {
        at: [...tablePath, lastRowIndex],
    });

    Transforms.select(editor, [...tablePath, 0, 0, 0]);
};

const removeColumn = (editor) => {
    const tableEntry = Editor.above(editor, {
        match: (n) => n.type === "table",
    });

    if (!tableEntry) return;

    const [tableNode, tablePath] = tableEntry;

    const columnCount = tableNode.children[0].children.length;

    if (columnCount <= 1) return;

    const lastColIndex = columnCount - 1;

    tableNode.children.forEach((row, rowIndex) => {
        Transforms.removeNodes(editor, {
            at: [...tablePath, rowIndex, lastColIndex],
        });
    });

    Transforms.select(editor, [...tablePath, 0, 0, 0]);
};

const exitTable = (editor) => {
    const tableEntry = Editor.above(editor, {
        match: (n) => n.type === "table",
    });

    if (!tableEntry) return;

    const [, tablePath] = tableEntry;

    const level = Math.max(
        getPreviousParagraphLevel(editor, tablePath),
        MIN_LEVEL
    );
    const insertPath = Path.next(tablePath);

    Transforms.insertNodes(
        editor,
        {
            type: "paragraph",
            level,
            children: [{ text: "" }],
        },
        { at: insertPath }
    );

    // 🔥 ВАЖНО: ставим курсор В TEXT
    Transforms.select(editor, [...insertPath, 0, 0]);
};

// 🔢 Генерация 1.1 / 1.2.1
function generatePositions(nodes) {
    const counters = [];

    return nodes.map((node) => {
        if (node.type !== "paragraph") return node;

        const level = node.level || 1;

        counters[level - 1] = (counters[level - 1] || 0) + 1;
        counters.length = level;

        return node;
        // return {
        //     ...node,
        //     position: counters.join("."),
        // };
    });
}

function computePositions(nodes) {
    const counters = [];

    return nodes.map((node) => {
        if (node.type !== "paragraph") return null;

        const level = Math.max(node.level || MIN_LEVEL, MIN_LEVEL);
        const index = level - MIN_LEVEL;

        counters[index] = (counters[index] || 0) + 1;
        counters.length = index + 1;

        return counters.join(".");
    });
}

// 🧱 Рендер абзаца с номером
const ParagraphElement = ({
    attributes,
    children,
    element,
    position,
    chapterPosition,
    hideNumber,
}) => {
    const level = element.level || MIN_LEVEL;

    return (
        <div
            {...attributes}
            className="flex gap-3"
            style={{
                marginLeft: level == 0 ? 0 : (level - MIN_LEVEL) * 24,
            }}
        >
            {!(level == 0) && (
                <span
                    contentEditable={false}
                    className="text-gray-400 w-16 select-none"
                >
                    {chapterPosition && position
                        ? `${chapterPosition}.${position}`
                        : ""}
                </span>
            )}

            <div className="flex-1">{children}</div>
        </div>
    );
};

const insertTable = (editor, rows, cols) => {
    const table = createTable(rows, cols);
    Transforms.insertNodes(editor, table);
};

const createTable = (rows = 2, cols = 2) => ({
    type: "table",
    children: Array.from({ length: rows }, () => ({
        type: "table-row",
        children: Array.from({ length: cols }, () => ({
            type: "table-cell",
            children: [
                {
                    type: "paragraph",
                    level: 0,
                    children: [{ text: "" }],
                },
            ],
        })),
    })),
});
export default function SlateEditor({ value, onChange, chapterPosition }) {
    const editor = useMemo(() => withReact(createEditor()), []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

    const safeValue =
        Array.isArray(value) && value.length > 0 ? value : EMPTY_VALUE;
    const positions = computePositions(safeValue);

    const renderElement = useCallback(
        (props) => {
            const { element, path } = props;

            const isInTable =
                Array.isArray(path) &&
                path.length > 1 &&
                editor.children[path[0]]?.type === "table";

            switch (element.type) {
                case "paragraph": {
                    const index = editor.children.indexOf(element);
                    const position = positions[index];

                    return (
                        <ParagraphElement
                            {...props}
                            position={position}
                            chapterPosition={chapterPosition}
                            hideNumber={isInTable}
                        />
                    );
                }

                case "table":
                    return <TableElement {...props} />;
                case "table-row":
                    return <TableRowElement {...props} />;
                case "table-cell":
                    return <TableCellElement {...props} />;
                default:
                    return <ParagraphElement {...props} />;
            }
        },
        [editor.children, positions, chapterPosition]
    );

    const handleChange = (newValue) => {
        const normalized = generatePositions(newValue);
        onChange(normalized);
    };

    const handleKeyDown = (event) => {
        const isInTable = Editor.above(editor, {
            match: (n) => n.type === "table-cell",
        });

        // ⬅️ TAB / Shift+TAB внутри таблицы
        if (event.key === "Tab") {
            const cellEntry = Editor.above(editor, {
                match: (n) => n.type === "table-cell",
            });

            if (cellEntry) {
                event.preventDefault();

                const [, cellPath] = cellEntry;

                const tableEntry = Editor.above(editor, {
                    match: (n) => n.type === "table",
                });

                if (!tableEntry) return;

                const [tableNode, tablePath] = tableEntry;

                const rowIndex = cellPath[cellPath.length - 2];
                const colIndex = cellPath[cellPath.length - 1];

                const rowCount = tableNode.children.length;
                const colCount = tableNode.children[0].children.length;

                let nextRow = rowIndex;
                let nextCol = colIndex;

                if (event.shiftKey) {
                    // ⬅️ Shift + Tab → назад
                    if (colIndex > 0) {
                        nextCol--;
                    } else if (rowIndex > 0) {
                        nextRow--;
                        nextCol = colCount - 1;
                    } else {
                        return; // ⛔️ первая ячейка — ничего не делаем
                    }
                } else {
                    // ➡️ Tab → вперёд
                    if (colIndex < colCount - 1) {
                        nextCol++;
                    } else if (rowIndex < rowCount - 1) {
                        nextRow++;
                        nextCol = 0;
                    } else {
                        return; // ⛔️ ПОСЛЕДНЯЯ ЯЧЕЙКА — НИЧЕГО НЕ ДЕЛАЕМ
                    }
                }

                Transforms.select(editor, [
                    ...tablePath,
                    nextRow,
                    nextCol,
                    0,
                    0,
                ]);

                return;
            }
        }

        if (isInTable && event.key === "Enter") {
            // Ctrl + Enter → выйти из таблицы
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                exitTable(editor);
                return;
            }

            // обычный Enter → новая строка в ячейке
            event.preventDefault();
            Editor.insertText(editor, "\n");
            return;
        }

        if (event.key === "ArrowDown") {
            const tableEntry = Editor.above(editor, {
                match: (n) => n.type === "table",
            });

            if (tableEntry) {
                const [, tablePath] = tableEntry;
                const nextPath = Path.next(tablePath);

                if (!Editor.hasPath(editor, nextPath)) {
                    event.preventDefault();
                    exitTable(editor);
                    return;
                }
            }
        }

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
                    level: Math.max(node.level || MIN_LEVEL, MIN_LEVEL),
                    children: [{ text: "" }],
                },
                {
                    at: Path.next(path), // ⬅️ ВСТАВКА ПОСЛЕ paragraph
                    select: true,
                }
            );
        }

        // TAB → вложенность
        // if (event.key === "Tab") {
        //     event.preventDefault();

        //     const entry = Editor.above(editor, {
        //         match: (n) => n.type === "paragraph",
        //     });

        //     if (!entry) return;

        //     const [node, path] = entry;
        //     const currentLevel = node.level || 1;

        //     // 🔥 ИЩЕМ предыдущий paragraph, пропуская table
        //     let prevParagraph = null;

        //     for (let i = path[0] - 1; i >= 0; i--) {
        //         const prevNode = editor.children[i];
        //         if (prevNode.type === "paragraph") {
        //             prevParagraph = prevNode;
        //             break;
        //         }
        //     }

        //     // ❌ если реально нет родителя — нельзя Tab
        //     if (!prevParagraph) return;

        //     const prevLevel = prevParagraph.level || 1;

        //     // ❌ запрещаем Tab, если нет логического родителя
        //     if (currentLevel > prevLevel) return;

        //     // ✅ можно вложить
        //     Transforms.setNodes(
        //         editor,
        //         { level: currentLevel + 1 },
        //         { at: path }
        //     );
        // }

        // TAB / SHIFT+TAB для paragraph (НЕ в таблице)
        if (event.key === "Tab") {
            const isInTableCell = Editor.above(editor, {
                match: (n) => n.type === "table-cell",
            });

            if (isInTableCell) return;

            event.preventDefault();

            const entry = Editor.above(editor, {
                match: (n) => n.type === "paragraph",
            });

            if (!entry) return;

            const [node, path] = entry;

            // 🔒 ГАРАНТИРУЕМ минимум
            const currentLevel = Math.max(node.level ?? MIN_LEVEL, MIN_LEVEL);

            // ⬅️ Shift + Tab — уменьшаем уровень
            if (event.shiftKey) {
                if (currentLevel === MIN_LEVEL) {
                    // ⛔️ ниже 2 нельзя
                    return;
                }

                Transforms.setNodes(
                    editor,
                    { level: currentLevel - 1 },
                    { at: path }
                );
                return;
            }

            // ➡️ Tab — увеличиваем уровень
            const prevParagraph = findPreviousParagraph(editor, path[0]);
            if (!prevParagraph) return;

            const prevLevel = Math.max(
                prevParagraph.level ?? MIN_LEVEL,
                MIN_LEVEL
            );

            // ❗ вложение разрешено ТОЛЬКО если уровни равны
            if (currentLevel !== prevLevel) return;

            Transforms.setNodes(
                editor,
                { level: currentLevel + 1 },
                { at: path }
            );
        }

        if (event.key === "Backspace") {
            const cellEntry = Editor.above(editor, {
                match: (n) => n.type === "table-cell",
            });

            if (cellEntry) {
                const [, cellPath] = cellEntry;

                const textPath = [...cellPath, 0, 0];
                const textNode = Editor.node(editor, textPath)[0];

                // 🔒 Если текст есть — даём Slate удалить символ
                if (textNode.text.length > 0) {
                    return;
                }

                // 🔒 Если текст пуст — НИЧЕГО не делаем
                event.preventDefault();
                return;
            }
        }
        if (event.key === "Delete") {
            const cellEntry = Editor.above(editor, {
                match: (n) => n.type === "table-cell",
            });

            if (cellEntry) {
                const [, cellPath] = cellEntry;

                const textPath = [...cellPath, 0, 0];
                const textNode = Editor.node(editor, textPath)[0];

                // 🔒 если текст есть — даём Slate удалить символ
                if (textNode.text.length > 0) {
                    return;
                }

                // 🔒 если текст пуст — ЗАПРЕЩАЕМ Delete
                event.preventDefault();
                return;
            }
        }
    };

    return (
        <Slate editor={editor} initialValue={safeValue} onChange={handleChange}>
            <Toolbar editor={editor} />
            <Editable
                className="border rounded p-3 min-h-[120px]"
                placeholder="Начните писать..."
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={handleKeyDown}
            />
        </Slate>
    );
}
