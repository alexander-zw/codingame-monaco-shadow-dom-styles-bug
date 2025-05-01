import {
  editor as monacoEditorLib,
  languages as monacoLanguagesLib,
} from "monaco-editor43/esm/vs/editor/editor.api";
import { useEffect, useRef } from "react";
import { createEditor, EDITOR_OPTIONS } from "../utils/utils";

import "../utils/setupMicrosoftMonaco43Config";

interface MonacoEditorProps {
  initialValue?: string;
  className?: string;
  containerClassName?: string;
  provideCodeActions?: boolean;
  measureInit?: number;
}

const measurementRef = {
  count: 0,
  totalTime: 0,
  totalNumber: 0,
};

export const MicrosoftMonaco43Editor = ({
  initialValue,
  className = "editor-container",
  containerClassName = "h2-and-editor-container",
  provideCodeActions,
  measureInit,
}: MonacoEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monacoEditorLib.IStandaloneCodeEditor>(null);

  useEffect(() => {
    if (measureInit) measurementRef.totalNumber = measureInit;

    createEditor({
      editorLib: monacoEditorLib,
      languagesLib: monacoLanguagesLib,
      containerRef,
      editorRef,
      options: {
        ...EDITOR_OPTIONS,
        value: initialValue ?? EDITOR_OPTIONS.value,
      },
      provideCodeActions,
      measurementRef: measureInit ? measurementRef : undefined,
    });
  }, [initialValue]);

  return (
    <div className={containerClassName}>
      <div ref={containerRef} className={className} />
    </div>
  );
};
