import { editor as monacoEditorLib } from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect, useRef } from "react";
import { EDITOR_OPTIONS } from "../utils/utils";

interface MonacoEditorProps {
  initialValue?: string;
  className?: string;
}

export const MonacoEditor = ({
  initialValue,
  className = "editor-container",
}: MonacoEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monacoEditorLib.IStandaloneCodeEditor>(null);

  useEffect(() => {
    if (editorRef.current) {
      return; // Editor already created
    }

    if (!containerRef.current) {
      throw new Error("Container not found");
    }

    editorRef.current = monacoEditorLib.create(containerRef.current, {
      ...EDITOR_OPTIONS,
      value: initialValue ?? EDITOR_OPTIONS.value,
    });

    return () => {
      editorRef.current?.dispose();
    };
  }, [initialValue]);

  return (
    <div className="h2-and-editor-container">
      <div ref={containerRef} className={className} />
    </div>
  );
};
