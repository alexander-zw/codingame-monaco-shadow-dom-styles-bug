import { useEffect, useRef } from "react";
import "./SideBySideDiffEditor.css";
import { editor as codingameMonacoEditorLib } from "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.api";
import { editor as monacoEditorLib } from "monaco-editor/esm/vs/editor/editor.api";

import "@codingame/monaco-vscode-standalone-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js";

const EDITOR_OPTIONS = {
  original: {
    value: `const x = 3; // comment
console.log("Hello, World!");`,
    language: "javascript",
  },
  modified: {
    value: `const x = 4;
let y = x + 3;
y = x + y; // new comment`,
    language: "javascript",
  },
};

const DiffEditorTemplate = ({
  editorLib,
  title,
}: {
  editorLib: typeof codingameMonacoEditorLib | typeof monacoEditorLib;
  title: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<
    | codingameMonacoEditorLib.IStandaloneDiffEditor
    | monacoEditorLib.IStandaloneDiffEditor
  >(null);

  useEffect(() => {
    if (editorRef.current) {
      return; // Editor already created.
    }

    if (!containerRef.current) {
      throw new Error("Container not found");
    }

    editorRef.current = editorLib.createDiffEditor(containerRef.current, {
      theme: "vs-dark",
      automaticLayout: true,
      renderSideBySide: true,
      useInlineViewWhenSpaceIsLimited: false,
    });

    const originalModel = editorLib.createModel(
      EDITOR_OPTIONS.original.value,
      EDITOR_OPTIONS.original.language
    );
    const modifiedModel = editorLib.createModel(
      EDITOR_OPTIONS.modified.value,
      EDITOR_OPTIONS.modified.language
    );

    editorRef.current.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  }, [editorLib]);

  return (
    <div className="h2-and-editor-container">
      <div className="editor-title">{title}</div>
      <div ref={containerRef} className="editor-container">
        {/* Shadow DOM content will go here. */}
      </div>
    </div>
  );
};

const CodingameDiffEditor = () => {
  return (
    <DiffEditorTemplate
      editorLib={codingameMonacoEditorLib}
      title="This is the Codingame diff editor"
    />
  );
};

const MonacoDiffEditor = () => {
  return (
    <DiffEditorTemplate
      editorLib={monacoEditorLib}
      title="This is the Monaco diff editor"
    />
  );
};

export const SideBySideDiffEditor = () => {
  return (
    <div>
      <h1>This is outside the Shadow DOM</h1>
      <CodingameDiffEditor />
      <MonacoDiffEditor />
    </div>
  );
};
