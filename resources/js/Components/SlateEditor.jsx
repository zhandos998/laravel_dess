import { useMemo, useCallback, useRef, useState } from "react";
import { InlineMath } from "react-katex";

import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { createEditor, Transforms, Editor, Path } from "slate";
import { withHistory, HistoryEditor } from "slate-history";

const MIN_LEVEL = 2;

const EMPTY_VALUE = [
    {
        type: "paragraph",
        level: MIN_LEVEL,
        children: [{ text: "" }],
    },
];

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

const Toolbar = ({ editor, onImageClick }) => {
    const canUndo = editor.history.undos.length > 0;
    const canRedo = editor.history.redos.length > 0;
    return (
        <div className="flex gap-2 mb-2 border-b pb-2">
            <ToolbarButton
                active={false}
                onMouseDown={() => canUndo && HistoryEditor.undo(editor)}
            >
                ⬅️ Назад
            </ToolbarButton>

            <ToolbarButton
                active={false}
                onMouseDown={() => canRedo && HistoryEditor.redo(editor)}
            >
                ➡️ Вперёд
            </ToolbarButton>

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

            {/* <ToolbarButton onMouseDown={() => insertInlineTable(editor, 2, 2)}>
                ⧉ Inline таблица
            </ToolbarButton> */}

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

            <ToolbarButton onMouseDown={() => insertMath(editor)}>
                ∑
            </ToolbarButton>

            <ToolbarButton onMouseDown={onImageClick}>🖼 Фото</ToolbarButton>
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
            className={`
                flex gap-3
                px-2 py-1
                ${
                    hideNumber
                        ? ""
                        : "border-b border-gray-200 focus-within:border-blue-400"
                }
            `}
            style={{
                paddingLeft:
                    level === 0 || hideNumber ? 0 : (level - MIN_LEVEL) * 24,
            }}
        >
            {!hideNumber && level !== 0 && (
                <span
                    contentEditable={false}
                    className="text-gray-400 w-16 select-none px-2"
                >
                    {chapterPosition && position
                        ? `${chapterPosition}.${position}`
                        : ""}
                </span>
            )}

            <span className="flex-1 inline">{children}</span>
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

const MathElement = ({ attributes, element, children }) => (
    <span
        {...attributes}
        contentEditable={false}
        className="px-1 bg-gray-100 rounded"
    >
        <InlineMath math={element.latex} />
        {children}
    </span>
);

const insertMath = (editor) => {
    const latex = prompt("Введите LaTeX формулу", "\\frac{a}{b}");

    if (!latex) return;

    Transforms.insertNodes(editor, {
        type: "math",
        latex,
        children: [{ text: "" }],
    });

    Transforms.move(editor);
};

const insertImage = (editor, url, width, height) => {
    const imageNode = {
        type: "image",
        id: crypto.randomUUID(),
        url,
        width,
        height,
        rotation: 0,
        children: [{ text: "" }], // ОБЯЗАТЕЛЬНО
    };

    // 1️⃣ вставляем image В ТЕКСТ
    Transforms.insertNodes(editor, imageNode);

    // 2️⃣ ОБЯЗАТЕЛЬНО добавляем текст после,
    // чтобы курсор мог туда встать
    Transforms.insertText(editor, " ");
};

const insertImageFromFile = (editor, file) => {
    const reader = new FileReader();

    reader.onload = () => {
        insertImage(editor, reader.result);
    };

    reader.readAsDataURL(file);
};

const getResizeCursor = (direction, rotation) => {
    const rot = ((rotation % 360) + 360) % 360;

    const map0 = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize",
    };

    const map90 = {
        n: "ew-resize",
        s: "ew-resize",
        e: "ns-resize",
        w: "ns-resize",
        ne: "nwse-resize",
        sw: "nwse-resize",
        nw: "nesw-resize",
        se: "nesw-resize",
    };

    if (rot === 90 || rot === 270) {
        return map90[direction];
    }

    return map0[direction];
};

const InlineImageElement = ({
    attributes,
    element,
    editor,
    active,
    onActivate,
}) => {
    const rotation = element.rotation || 0;
    const width = element.width || 64;
    const height = element.height || 64;

    const isSideways = rotation === 90 || rotation === 270;

    const layoutWidth = isSideways ? height : width;
    const layoutHeight = isSideways ? width : height;

    return (
        <span
            {...attributes}
            data-inline-image
            contentEditable={false}
            className="inline-block relative align-middle mx-1"
            style={{ width: layoutWidth, height: layoutHeight }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onActivate(); // ✅ АКТИВАЦИЯ
            }}
        >
            <span
                className="absolute"
                style={{
                    width,
                    height,
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
            >
                <img
                    src={element.url}
                    draggable={false}
                    className="pointer-events-none select-none"
                    style={{ width, height }}
                />

                {active && (
                    <span className="absolute inset-0 border border-blue-500 pointer-events-none" />
                )}

                {active && (
                    <InlineResizeHandles element={element} editor={editor} />
                )}
            </span>

            {active && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                    <button
                        onMouseDown={(e) => {
                            e.preventDefault();
                            rotateInlineImage(editor, element, -90);
                        }}
                        className="px-1 text-xs bg-white border"
                    >
                        ↺
                    </button>
                    <button
                        onMouseDown={(e) => {
                            e.preventDefault();
                            rotateInlineImage(editor, element, 90);
                        }}
                        className="px-1 text-xs bg-white border"
                    >
                        ↻
                    </button>
                </span>
            )}
        </span>
    );
};

const insertInlineImage = (editor, url) => {
    const inlineImage = {
        type: "inline-image",
        id: crypto.randomUUID(), // 🔥 ОБЯЗАТЕЛЬНО
        url,
        width: 32,
        height: 32,
        rotation: 0,
        children: [{ text: "" }],
    };

    Transforms.insertNodes(editor, inlineImage);
    Transforms.insertText(editor, " ");
};

const InlineResizeHandles = ({ element, editor }) => {
    const directions = ["n", "s", "e", "w", "nw", "ne", "sw", "se"];

    return directions.map((dir) => (
        <InlineResizeHandle
            key={dir}
            direction={dir}
            element={element}
            editor={editor}
        />
    ));
};

const InlineResizeHandle = ({ direction, element, editor }) => {
    const startResize = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;

        const startWidth = element.width;
        const startHeight = element.height;

        const aspect = startWidth / startHeight;
        const isCorner = ["nw", "ne", "sw", "se"].includes(direction);

        const path = ReactEditor.findPath(editor, element);
        const angle = ((element.rotation || 0) * Math.PI) / 180;

        const onMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const localDx = dx * Math.cos(angle) + dy * Math.sin(angle);
            const localDy = -dx * Math.sin(angle) + dy * Math.cos(angle);

            let width = startWidth;
            let height = startHeight;

            if (isCorner) {
                const delta =
                    Math.abs(localDx) > Math.abs(localDy) ? localDx : localDy;

                if (direction.includes("e")) width = startWidth + delta;
                if (direction.includes("w")) width = startWidth - delta;

                width = Math.max(16, width);
                height = Math.round(width / aspect);
            } else {
                if (direction.includes("e")) width += localDx;
                if (direction.includes("w")) width -= localDx;
                if (direction.includes("s")) height += localDy;
                if (direction.includes("n")) height -= localDy;
            }

            width = Math.max(16, Math.round(width));
            height = Math.max(16, Math.round(height));

            Transforms.setNodes(editor, { width, height }, { at: path });
        };

        const stop = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", stop);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", stop);
    };

    return (
        <span
            onMouseDown={startResize}
            className={`handle handle-${direction}`}
            style={{
                cursor: getResizeCursor(direction, element.rotation),
            }}
        />
    );
};

const rotateInlineImage = (editor, element, delta) => {
    const path = ReactEditor.findPath(editor, element);
    const current = element.rotation || 0;

    let next = (current + delta) % 360;
    if (next < 0) next += 360;

    Transforms.setNodes(editor, { rotation: next }, { at: path });
};

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

export default function SlateEditor({ value, onChange, chapterPosition }) {
    const [activeImageId, setActiveImageId] = useState(null);

    const inputRef = useRef(null);

    const editor = useMemo(() => {
        const e = withHistory(withReact(createEditor()));

        const { isVoid, isInline } = e;

        e.isInline = (element) =>
            element.type === "inline-image" || element.type === "math"
                ? true
                : isInline(element);

        // e.isVoid = (element) =>
        //     element.type === "inline-image" ? true : isVoid(element);

        return e;
    }, []);

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
                case "math":
                    return <MathElement {...props} />;
                case "inline-image":
                    return (
                        <InlineImageElement
                            {...props}
                            editor={editor}
                            active={activeImageId === element.id}
                            onActivate={() => setActiveImageId(element.id)}
                        />
                    );

                // case "image":
                //     return (
                //         <ImageElement
                //             {...props}
                //             editor={editor}
                //             active={activeImageId === element.id}
                //             onActivate={() => setActiveImageId(element.id)}
                //         />
                //     );
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

        if (event.key === " ") {
            // ⛔ не preventDefault — пробел должен вставиться
            HistoryEditor.withoutMerging(editor, () => {
                Editor.insertText(editor, " ");
            });

            event.preventDefault();
            return;
        }

        if (event.key === "Enter" && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();

            HistoryEditor.withoutMerging(editor, () => {
                Editor.insertText(editor, "\n");
            });

            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === "z") {
            event.preventDefault();

            if (event.shiftKey) {
                HistoryEditor.redo(editor);
            } else {
                HistoryEditor.undo(editor);
            }
            return;
        }

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

        // ENTER → перенос строки ВНУТРИ пункта
        if (event.key === "Enter" && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            Editor.insertText(editor, "\n");
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();

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
                    at: Path.next(path),
                    select: true,
                }
            );
        }

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
            <Toolbar
                editor={editor}
                onImageClick={() => inputRef.current.click()}
            />

            <input
                type="file"
                accept="image/*"
                hidden
                ref={inputRef}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();

                    reader.onload = () => {
                        insertInlineImage(editor, reader.result);
                    };

                    reader.readAsDataURL(file);

                    e.target.value = "";
                }}
            />

            <Editable
                className="border rounded p-3 min-h-[120px]"
                placeholder="Начните писать..."
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={handleKeyDown}
                onMouseDownCapture={(e) => {
                    if (
                        !e.target.closest("[data-image]") &&
                        !e.target.closest("[data-inline-image]")
                    ) {
                        setActiveImageId(null);
                    }
                }}
            />
        </Slate>
    );
}
