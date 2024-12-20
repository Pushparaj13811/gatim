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
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { useRef, useEffect } from "react";
import PizZip from 'pizzip';

const templateFiles = {
  "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,

  "word/document.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {{content}}
  </w:body>
</w:document>`,

  "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml/document.main+xml"/>
</Types>`,
};

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

  const getHeadingStyle = (level: number): string => {
    const sizes = {
      1: '36',  // ~24pt
      2: '32',  // ~16pt
      3: '28',  // ~14pt
    };
    return `<w:pPr><w:pStyle w:val="Heading${level}"/><w:sz w:val="${sizes[level as keyof typeof sizes]}"/></w:pPr>`;
  };

  const getAlignmentStyle = (html: string): string => {
    if (html.includes('style="text-align: center;"')) return '<w:jc w:val="center"/>';
    if (html.includes('style="text-align: right;"')) return '<w:jc w:val="right"/>';
    return '<w:jc w:val="left"/>';
  };

  const convertHtmlToWordML = (html: string): string => {
    let wordML = '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Process each block element
    doc.body.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        let paragraph = '';
        
        // Handle headings
        if (element.tagName.match(/^H[1-3]$/)) {
          const level = parseInt(element.tagName[1]);
          paragraph = `<w:p>${getHeadingStyle(level)}${getAlignmentStyle(element.outerHTML)}<w:r><w:t>${element.textContent}</w:t></w:r></w:p>`;
        }
        // Handle paragraphs and other block elements
        else {
          let content = '';
          element.childNodes.forEach((childNode) => {
            if (childNode.nodeType === Node.TEXT_NODE) {
              content += `<w:r><w:t>${childNode.textContent}</w:t></w:r>`;
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
              const childElement = childNode as Element;
              let rPr = '<w:rPr>';
              
              // Handle inline styles
              if (childElement.tagName === 'STRONG') rPr += '<w:b/>';
              if (childElement.tagName === 'EM') rPr += '<w:i/>';
              if (childElement.tagName === 'U') rPr += '<w:u w:val="single"/>';
              if (childElement.tagName === 'STRIKE') rPr += '<w:strike/>';
              
              rPr += '</w:rPr>';
              content += `<w:r>${rPr}<w:t>${childElement.textContent}</w:t></w:r>`;
            }
          });
          
          // Add paragraph with alignment
          paragraph = `<w:p><w:pPr>${getAlignmentStyle(element.outerHTML)}</w:pPr>${content}</w:p>`;
        }
        
        wordML += paragraph;
      }
    });
    
    return wordML;
  };

  const handleDownload = async () => {
    if (!editor) return;

    const htmlContent = editor.getHTML();
    if (!htmlContent) return;

    try {
      const zip = new PizZip();

      Object.entries(templateFiles).forEach(([path, content]) => {
        if (path === 'word/document.xml') {
          const documentContent = content.replace('{{content}}', convertHtmlToWordML(htmlContent));
          zip.file(path, documentContent);
        } else {
          zip.file(path, content);
        }
      });

      const docx = zip.generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      const url = URL.createObjectURL(docx);
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
        {/* Heading Buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

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