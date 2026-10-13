import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

import { sanitizeImageUrl, sanitizeLinkUrl } from "../../../config/pageSectionStyles";
import RichTextImage from "./RichTextImage";

const IMAGE_ALIGNMENT_OPTIONS = [
  ["left", "Balra + körbefuttatás"],
  ["center", "Középre"],
  ["right", "Jobbra + körbefuttatás"],
  ["full", "Teljes szélesség"],
];

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
  const imageInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
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
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      RichTextImage,
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

  useEffect(() => {
    if (!editor) return;
    const nextDocument = value?.type === "doc" ? value : plainTextDocument(fallbackText);

    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(nextDocument)) {
      editor.commands.setContent(nextDocument, { emitUpdate: false });
    }
  }, [editor, fallbackText, value]);

  if (!editor) return <div className="min-h-44 border border-slate-300 bg-white" />;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const requestedUrl = window.prompt("Hivatkozás URL-je", previousUrl);
    if (requestedUrl === null) return;
    if (!requestedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const href = sanitizeLinkUrl(requestedUrl);
    if (href) editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const insertImage = (src, alt = "") => {
    const safeSrc = sanitizeImageUrl(src);
    if (!safeSrc) {
      setImageError("A kép URL-je nem használható.");
      return;
    }

    editor.chain().focus().setImage({ src: safeSrc, alt, align: "center" }).run();
    setImageError("");
  };

  const insertImageFromUrl = () => {
    const requestedUrl = window.prompt("Kép URL-je");
    if (requestedUrl === null || !requestedUrl.trim()) return;
    const alt = window.prompt("Kép rövid leírása (alt szöveg)", "") || "";
    insertImage(requestedUrl, alt);
  };

  const uploadAndInsertImage = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "image");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/uploads`,
        formData,
      );

      insertImage(response.data.url, file.name.replace(/\.[^.]+$/, ""));
    } catch (error) {
      console.error("Szerkesztőbe illesztett kép feltöltési hibája:", error);
      setImageError(
        error.response?.data?.message || "A kép feltöltése nem sikerült.",
      );
    } finally {
      setUploadingImage(false);
      input.value = "";
    }
  };

  const setImageAlignment = (align) => {
    const attributes = { align };
    if (align === "full") {
      attributes.width = null;
      attributes.height = null;
    }
    editor.chain().focus().updateAttributes("image", attributes).run();
  };

  const editImageAlt = () => {
    const currentAlt = editor.getAttributes("image").alt || "";
    const alt = window.prompt("Kép rövid leírása (alt szöveg)", currentAlt);
    if (alt !== null) editor.chain().focus().updateAttributes("image", { alt }).run();
  };

  const imageSelected = editor.isActive("image");

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
        <ToolbarButton active={editor.isActive("link")} onClick={setLink} title="Hivatkozás">Hivatkozás</ToolbarButton>
        <span className="mx-1 h-8 w-px bg-slate-300" aria-hidden="true" />
        <ToolbarButton active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Szöveg balra igazítása">Balra</ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Szöveg középre igazítása">Közép</ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Szöveg jobbra igazítása">Jobbra</ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Sorkizárt szöveg">Sorkizárt</ToolbarButton>
        <span className="mx-1 h-8 w-px bg-slate-300" aria-hidden="true" />
        <ToolbarButton disabled={uploadingImage} onClick={() => imageInputRef.current?.click()} title="Kép feltöltése és beszúrása">{uploadingImage ? "Feltöltés…" : "+ Kép"}</ToolbarButton>
        <ToolbarButton onClick={insertImageFromUrl} title="Kép beszúrása URL-ről">Kép URL-ről</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Visszavonás">↶</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Mégis">↷</ToolbarButton>
      </div>
      {imageSelected && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-amber-200 bg-amber-50 p-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-amber-900">Kép:</span>
          {IMAGE_ALIGNMENT_OPTIONS.map(([align, label]) => (
            <ToolbarButton key={align} active={editor.getAttributes("image").align === align} onClick={() => setImageAlignment(align)} title={label}>{label}</ToolbarButton>
          ))}
          <ToolbarButton onClick={editImageAlt} title="Alt szöveg szerkesztése">Alt szöveg</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().deleteSelection().run()} title="Kép törlése">Törlés</ToolbarButton>
        </div>
      )}
      <EditorContent editor={editor} />
      <input ref={imageInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={uploadAndInsertImage} />
      <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
        A képet kijelölve átméretezheted a sarkainál, és húzással másik szövegrészhez mozgathatod. Balra vagy jobbra igazítva a szöveg körbefutja.
      </div>
      {imageError && <p className="border-t border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{imageError}</p>}
    </div>
  );
}
