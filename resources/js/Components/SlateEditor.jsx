import { useMemo, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";

const EMPTY_VALUE = [
    {
        type: "paragraph",
        children: [{ text: "" }],
    },
];

export default function SlateEditor({ value, onChange }) {
    const editor = useMemo(() => withReact(createEditor()), []);

    const safeValue =
        Array.isArray(value) && value.length > 0 ? value : EMPTY_VALUE;

    return (
        <Slate editor={editor} initialValue={safeValue} onChange={onChange}>
            <Editable
                className="border rounded p-3 min-h-[120px]"
                placeholder="Начните писать..."
            />
        </Slate>
    );
}
