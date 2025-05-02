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
  registerFocusEvents?: boolean;
  measureInit?: number;
}

const measurementRef = {
  started: 0,
  finished: 0,
  totalTime: 0,
  totalNumber: 0,
};

export const MicrosoftMonaco43Editor = ({
  initialValue,
  className = "editor-container",
  containerClassName = "h2-and-editor-container",
  provideCodeActions,
  measureInit,
  registerFocusEvents,
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
      registerFocusEvents: registerFocusEvents ? "boolean" : undefined,
      measurementRef: measureInit ? measurementRef : undefined,
      initLib: async () => {},
    });
  }, [initialValue, measureInit, provideCodeActions]);

  return (
    <div className={containerClassName}>
      <div ref={containerRef} className={className} />
    </div>
  );
};
