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
const ToolbarDivider = () => <div className="w-px h-8 bg-gray-300 mx-1" />;

const Toolbar = ({ editor, onImageClick }) => {
    const canUndo = editor.history.undos.length > 0;
    const canRedo = editor.history.redos.length > 0;
    return (
        <div className="flex gap-2 mb-2 border-b pb-2">
            <ToolbarButton
                active={false}
                onMouseDown={() => canUndo && HistoryEditor.undo(editor)}
            >
                <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.53033 3.46967C7.82322 3.76256 7.82322 4.23744 7.53033 4.53033L5.81066 6.25H15C18.1756 6.25 20.75 8.82436 20.75 12C20.75 15.1756 18.1756 17.75 15 17.75H8.00001C7.58579 17.75 7.25001 17.4142 7.25001 17C7.25001 16.5858 7.58579 16.25 8.00001 16.25H15C17.3472 16.25 19.25 14.3472 19.25 12C19.25 9.65279 17.3472 7.75 15 7.75H5.81066L7.53033 9.46967C7.82322 9.76256 7.82322 10.2374 7.53033 10.5303C7.23744 10.8232 6.76256 10.8232 6.46967 10.5303L3.46967 7.53033C3.17678 7.23744 3.17678 6.76256 3.46967 6.46967L6.46967 3.46967C6.76256 3.17678 7.23744 3.17678 7.53033 3.46967Z"
                        fill="#21397d"
                    />
                </svg>
                {/* назад */}
            </ToolbarButton>

            <ToolbarButton
                active={false}
                onMouseDown={() => canRedo && HistoryEditor.redo(editor)}
            >
                <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 7H9.00001C6.23858 7 4 9.23857 4 12C4 14.7614 6.23858 17 9 17H16M20 7L17 4M20 7L17 10"
                        stroke="#21397d"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                {/* вперед */}
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
                active={isMarkActive(editor, "bold")}
                onMouseDown={() => toggleMark(editor, "bold")}
            >
                <b style={{ color: "#21397d" }}>Ж</b>
            </ToolbarButton>

            <ToolbarButton
                active={isMarkActive(editor, "italic")}
                onMouseDown={() => toggleMark(editor, "italic")}
            >
                <i style={{ color: "#21397d" }}>К</i>
            </ToolbarButton>

            <ToolbarButton
                active={isMarkActive(editor, "underline")}
                onMouseDown={() => toggleMark(editor, "underline")}
            >
                <u style={{ color: "#21397d" }}>Ч</u>
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton onMouseDown={() => insertTable(editor, 2, 2)}>
                <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#21397d"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                            d="M4 12L20 12M12 4L12 20M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z"
                            stroke="#21397d"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>{" "}
                    </g>
                </svg>
            </ToolbarButton>

            {/* <ToolbarButton onMouseDown={() => insertInlineTable(editor, 2, 2)}>
                ⧉ Inline таблица
            </ToolbarButton> */}

            <ToolbarButton onMouseDown={() => addRowBelow(editor)}>
                <svg
                    fill="#21397d"
                    width="25px"
                    height="25px"
                    viewBox="0 0 1920 1920"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                            d="M180 1800h1560c33 0 60-26.88 60-60V720H120v1020c0 33.12 27 60 60 60ZM120 180v420h480V120H180c-33 0-60 26.88-60 60Zm600-60v480h480V120H720Zm1080 60c0-33.12-27-60-60-60h-420v480h480V180Zm120 1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560c99.24 0 180 80.76 180 180v1560Zm-510-596.484v240h-330v330H840v-330H510v-240h330v-330h240v330h330Z"
                            fill-rule="evenodd"
                        ></path>{" "}
                    </g>
                </svg>
                {/* ➕ Строка */}
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => addColumnRight(editor)}>
                <svg
                    fill="#21397d"
                    width="25px"
                    height="25px"
                    viewBox="0 0 1920 1920"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                            d="M1740 0c99.24 0 180 80.76 180 180v1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560Zm60 1740V180c0-33-26.88-60-60-60H720v1680h1020c33.12 0 60-27 60-60Zm-1620 60h420v-480H120v420c0 33 26.88 60 60 60Zm-60-600h480V720H120v480Zm60-1080c-33.12 0-60 27-60 60v420h480V120H180Zm963.516 390h240v330h330v240h-330v330h-240v-330h-330V840h330V510Z"
                            fill-rule="evenodd"
                        ></path>{" "}
                    </g>
                </svg>
                {/* ➕ Колонна */}
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => removeRow(editor)}>
                <svg
                    fill="#21397d"
                    width="25px"
                    height="25px"
                    viewBox="0 0 1920 1920"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                            d="M180 1800h1560c33 0 60-26.88 60-60V720H120v1020c0 33.12 27 60 60 60ZM120 180v420h480V120H180c-33 0-60 26.88-60 60Zm600-60v480h480V120H720Zm1080 60c0-33.12-27-60-60-60h-420v480h480V180Zm120 1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560c99.24 0 180 80.76 180 180v1560Zm-510-476h-900v-240h900v240Z"
                            fill-rule="evenodd"
                        />{" "}
                    </g>
                </svg>
                {/* ➖ Строка */}
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => removeColumn(editor)}>
                <svg
                    fill="#21397d"
                    width="25px"
                    height="25px"
                    viewBox="0 0 1920 1920"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                            d="M1740 0c99.24 0 180 80.76 180 180v1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560Zm60 1740V180c0-33-26.88-60-60-60H720v1680h1020c33.12 0 60-27 60-60Zm-1620 60h420v-480H120v420c0 33 26.88 60 60 60Zm-60-600h480V720H120v480Zm60-1080c-33.12 0-60 27-60 60v420h480V120H180Zm633.516 840h900v240h-900Z"
                            fill-rule="evenodd"
                        />{" "}
                    </g>
                </svg>
                {/* ➖ Колонна */}
            </ToolbarButton>

            <ToolbarButton onMouseDown={() => removeTable(editor)}>
                <svg
                    fill="#21397d"
                    width="25px"
                    height="25px"
                    viewBox="0 0 1920 1920"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M1800 1740c0 33-27 60-60 60h-420v-300h-120v300H720v-300H600v300H180c-33.12 0-60-27-60-60V180c0-33 26.88-60 60-60h420v300h120V120h480v300h120V120h420c33 0 60 27 60 60v1560ZM1740 0H180C80.76 0 0 80.76 0 180v1560c0 99.24 80.76 180 180 180h1560c99.24 0 180-80.76 180-180V180c0-99.24-80.76-180-180-180Zm-305.16 654.84-169.68-169.68L960 790.32 654.84 485.16 485.16 654.84 790.32 960l-305.16 305.16 169.68 169.68L960 1129.68l305.16 305.16 169.68-169.68L1129.68 960l305.16-305.16Z"
                            fill-rule="evenodd"
                        />

                        <path
                            d="M180 1800c-33 0-60-27-60-60v-420h300v-120H120V720h300V600H120V180c0-33.12 27-60 60-60h1560c33 0 60 26.88 60 60v420h-300v120h300v480h-300v120h300v420c0 33-27 60-60 60H180Zm1740-60V180c0-99.24-80.76-180-180-180H180C80.76 0 0 80.76 0 180v1560c0 99.24 80.76 180 180 180h1560c99.24 0 180-80.76 180-180ZM485.32 1265 655 1434.68l305.16-305.16 305.16 305.16L1435 1265l-305.16-305.16L1435 654.68 1265.32 485 960.16 790.16 655 485 485.32 654.68l305.16 305.16L485.32 1265Z"
                            fill-rule="evenodd"
                        />
                    </g>
                </svg>

                {/* 🗑 Таблица */}
            </ToolbarButton>

            {/* <ToolbarButton onMouseDown={() => insertMath(editor)}>
                ∑
            </ToolbarButton> */}

            <ToolbarDivider />

            <ToolbarButton onMouseDown={onImageClick}>
                <svg
                    fill="none"
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g id="Media / Image_01">
                            {" "}
                            <path
                                id="Vector"
                                d="M3.00005 17.0001C3 16.9355 3 16.8689 3 16.8002V7.2002C3 6.08009 3 5.51962 3.21799 5.0918C3.40973 4.71547 3.71547 4.40973 4.0918 4.21799C4.51962 4 5.08009 4 6.2002 4H17.8002C18.9203 4 19.4801 4 19.9079 4.21799C20.2842 4.40973 20.5905 4.71547 20.7822 5.0918C21 5.5192 21 6.07899 21 7.19691V16.8031C21 17.2881 21 17.6679 20.9822 17.9774M3.00005 17.0001C3.00082 17.9884 3.01337 18.5058 3.21799 18.9074C3.40973 19.2837 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H17.8036C18.9215 20 19.4805 20 19.9079 19.7822C20.2842 19.5905 20.5905 19.2837 20.7822 18.9074C20.9055 18.6654 20.959 18.3813 20.9822 17.9774M3.00005 17.0001L7.76798 11.4375L7.76939 11.436C8.19227 10.9426 8.40406 10.6955 8.65527 10.6064C8.87594 10.5282 9.11686 10.53 9.33643 10.6113C9.58664 10.704 9.79506 10.9539 10.2119 11.4541L12.8831 14.6595C13.269 15.1226 13.463 15.3554 13.6986 15.4489C13.9065 15.5313 14.1357 15.5406 14.3501 15.4773C14.5942 15.4053 14.8091 15.1904 15.2388 14.7607L15.7358 14.2637C16.1733 13.8262 16.3921 13.6076 16.6397 13.5361C16.8571 13.4734 17.0896 13.4869 17.2988 13.5732C17.537 13.6716 17.7302 13.9124 18.1167 14.3955L20.9822 17.9774M20.9822 17.9774L21 17.9996M15 10C14.4477 10 14 9.55228 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10Z"
                                stroke="#21397d"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>{" "}
                        </g>{" "}
                    </g>
                </svg>
                {/* 🖼 Фото */}
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
