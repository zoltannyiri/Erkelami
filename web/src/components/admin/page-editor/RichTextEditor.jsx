import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { sanitizeLinkUrl } from "../../../config/pageSectionStyles";

function plainTextDocument(text) {
  if (!text) return { type: "doc", content: [{ type: "paragraph" }] };

  return {
    type: "doc",
    content: String(text)
      .split(/\n{2,}/)
      .map((paragraph) => ({
        type: "paragraph",
        content: paragraph ? [{ type: "text", text: paragraph }] : undefined,
      })),
  };
}

function ToolbarButton({ active = false, disabled = false, onClick, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`min-w-9 border px-2.5 py-1.5 text-sm font-medium transition disabled:opacity-30 ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, fallbackText, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
    ],
    content: value?.type === "doc" ? value : plainTextDocument(fallbackText),
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getJSON()),
    editorProps: {
      attributes: {
        class: "rich-text rich-text-editor min-h-44 px-4 py-3 outline-none",
      },
    },
  });

  if (!editor) return <div className="min-h-44 border border-slate-300 bg-white" />;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const requestedUrl = window.prompt("Link URL", previousUrl);
    if (requestedUrl === null) return;
    if (!requestedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const href = sanitizeLinkUrl(requestedUrl);
    if (href) editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  return (
    <div className="border border-slate-300 bg-white focus-within:border-slate-950">
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 bg-slate-50 p-2">
        <ToolbarButton active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} title="Bekezdés">P</ToolbarButton>
        <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Címsor 2">H2</ToolbarButton>
        <ToolbarButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Címsor 3">H3</ToolbarButton>
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Félkövér">B</ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Dőlt"><em>I</em></ToolbarButton>
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Felsorolás">• Lista</ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Számozott lista">1. Lista</ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Idézet">❝</ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} onClick={setLink} title="Link">Link</ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
