import {
  editor as codingameEditorLib,
  languages as codingameLanguagesLib,
} from "@codingame/monaco-vscode-editor-api";
import { useEffect, useRef } from "react";
import { EDITOR_OPTIONS, registerCodeActionProvider } from "../utils/utils";
import { setupCodingameServices } from "../utils/setupCodingameMonacoConfig";

interface CodingameEditorProps {
  initialValue?: string;
  className?: string;
  containerClassName?: string;
  provideCodeActions?: boolean;
  measureInit?: number;
}

let numEditorsLoaded = 0;
let totalInitTime = 0;

export const CodingameEditor = ({
  initialValue,
  className = "editor-container",
  containerClassName = "h2-and-editor-container",
  provideCodeActions,
  measureInit,
}: CodingameEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<codingameEditorLib.IStandaloneCodeEditor>(null);

  useEffect(() => {
    const setup = async () => {
      if (!containerRef.current) {
        throw new Error("Container not found");
      }

      await setupCodingameServices();

      const startTime = performance.now();

      editorRef.current = codingameEditorLib.create(containerRef.current, {
        ...EDITOR_OPTIONS,
        value: initialValue ?? EDITOR_OPTIONS.value,
      });

      if (provideCodeActions) registerCodeActionProvider(codingameLanguagesLib);

      const endTime = performance.now();
      numEditorsLoaded++;
      totalInitTime += endTime - startTime;
      if (numEditorsLoaded === measureInit) {
        console.log(`${numEditorsLoaded} editors loaded in ${totalInitTime}ms`);
      }
    };

    setup();

    return () => {
      editorRef.current?.dispose();
    };
  }, [initialValue, measureInit]);

  return (
    <div className={containerClassName}>
      <div ref={containerRef} className={className} />
    </div>
  );
};
