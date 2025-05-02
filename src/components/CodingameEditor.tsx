import {
  editor as codingameEditorLib,
  languages as codingameLanguagesLib,
} from "@codingame/monaco-vscode-editor-api";
import { useEffect, useRef } from "react";
import { EDITOR_OPTIONS, createEditor } from "../utils/utils";
import { setupCodingameServices } from "../utils/setupCodingameMonacoConfig";

interface CodingameEditorProps {
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

export const CodingameEditor = ({
  initialValue,
  className = "editor-container",
  containerClassName = "h2-and-editor-container",
  provideCodeActions,
  registerFocusEvents,
  measureInit,
}: CodingameEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<codingameEditorLib.IStandaloneCodeEditor>(null);
  useEffect(() => {
    if (measureInit) measurementRef.totalNumber = measureInit;

    createEditor({
      editorLib: codingameEditorLib,
      languagesLib: codingameLanguagesLib,
      containerRef,
      editorRef,
      options: {
        ...EDITOR_OPTIONS,
        value: initialValue ?? EDITOR_OPTIONS.value,
      },
      provideCodeActions,
      registerFocusEvents: registerFocusEvents ? "string" : undefined,
      measurementRef: measureInit ? measurementRef : undefined,
      initLib: setupCodingameServices,
    });
  }, [initialValue, measureInit, provideCodeActions, registerFocusEvents]);

  return (
    <div className={containerClassName}>
      <div ref={containerRef} className={className} />
    </div>
  );
};
