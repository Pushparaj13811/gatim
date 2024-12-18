interface TextViewerProps {
  content: string;
}

export function TextViewer({ content }: TextViewerProps) {
  return (
    <pre className="text-viewer whitespace-pre-wrap font-mono text-sm p-4 bg-muted/30 rounded-md text-foreground">
      {content}
    </pre>
  );
}