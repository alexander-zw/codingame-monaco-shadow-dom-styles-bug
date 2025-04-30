import {
  editor as monacoEditorLib,
  languages as monacoLanguagesLib,
} from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect, useRef } from "react";
import { EDITOR_OPTIONS, registerCodeActionProvider } from "../utils/utils";

import "../utils/setupMicrosoftMonacoConfig";

interface MonacoEditorProps {
  initialValue?: string;
  className?: string;
  containerClassName?: string;
  provideCodeActions?: boolean;
  measureInit?: number;
}

let numEditorsLoaded = 0;
let totalInitTime = 0;

export const MicrosoftMonacoEditor = ({
  initialValue,
  className = "editor-container",
  containerClassName = "h2-and-editor-container",
  provideCodeActions,
  measureInit,
}: MonacoEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monacoEditorLib.IStandaloneCodeEditor>(null);

  useEffect(() => {
    if (!containerRef.current) {
      throw new Error("Container not found");
    }

    const start = performance.now();

    editorRef.current = monacoEditorLib.create(containerRef.current, {
      ...EDITOR_OPTIONS,
      value: initialValue ?? EDITOR_OPTIONS.value,
    });

    if (provideCodeActions) registerCodeActionProvider(monacoLanguagesLib);

    const end = performance.now();
    numEditorsLoaded++;
    totalInitTime += end - start;
    if (numEditorsLoaded === measureInit) {
      console.log(`${numEditorsLoaded} editors loaded in ${totalInitTime}ms`);
    }

    return () => {
      editorRef.current?.dispose();
    };
  }, [initialValue]);

  return (
    <div className={containerClassName}>
      <div ref={containerRef} className={className} />
    </div>
  );
};
