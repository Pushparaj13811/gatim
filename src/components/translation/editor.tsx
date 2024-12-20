import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  ArrowBigDownIcon,
  AlignRight,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useRef, useEffect } from "react";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const editorRef = useRef<HTMLDivElement | null>(null);

  // Update editor content when the `content` prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    const handleFocus = () => {
      editorRef.current?.classList.add("ProseMirror-focused");
    };

    const handleBlur = () => {
      editorRef.current?.classList.remove("ProseMirror-focused");
    };

    const editorElement = editor?.view.dom;
    if (editorElement) {
      editorElement.addEventListener("focus", handleFocus);
      editorElement.addEventListener("blur", handleBlur);

      if (editorRef.current) {
        editorRef.current.addEventListener("click", () => editor?.chain().focus().run());
      }
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("focus", handleFocus);
        editorElement.removeEventListener("blur", handleBlur);
      }
      if (editorRef.current) {
        const currentEditor = editorRef.current;
        currentEditor.removeEventListener("click", () => editor?.chain().focus().run());
      }
    };
  }, [editor]);


  const handleDownload = async () => {
    if (!editor) return;

    const htmlContent = editor.getHTML();
    if (!htmlContent) return;
    try {
      const zip = new PizZip();
      zip.file('word/document.xml', htmlContent);

      const doc = new Docxtemplater();
      doc.loadZip(zip);

      const generatedDocx = doc.getZip().generate({ type: 'blob' });

      const url = URL.createObjectURL(generatedDocx);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.docx';
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating .docx file:", error);
    }
  };

  if (!editor) return null;

  return (
    <div ref={editorRef} className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex flex-wrap gap-2 bg-muted/30">
        {/* Text Formatting Buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-accent" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-accent" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "bg-accent" : ""}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-accent" : ""}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* List Formatting Buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-accent" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-accent" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment Buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={editor.isActive("textAlign", { textAlign: "left" }) ? "bg-accent" : ""}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={editor.isActive("textAlign", { textAlign: "center" }) ? "bg-accent" : ""}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={editor.isActive("textAlign", { textAlign: "right" }) ? "bg-accent" : ""}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Download Button */}
        <div className="ml-auto">
          <Button variant="ghost" onClick={handleDownload}>
            <ArrowBigDownIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="overflow-y-auto max-h-[500px] prose prose-sm dark:prose-invert max-w-none">
        <EditorContent
          editor={editor}
          className="p-4 min-h-[500px] outline-none focus:outline-none"
        />
      </div>
    </div>
  );
}
