import type {
  editor as monacoEditorLib,
  languages as codingameLanguagesLib,
} from "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.api";

export const EDITOR_OPTIONS: monacoEditorLib.IStandaloneEditorConstructionOptions =
  {
    value: `const x = 3; // comment
console.log("Hello, World!");
this is an error`,
    language: "javascript",
    theme: "vs-light",
  };

export const registerCodeActionProvider = (
  lib: typeof codingameLanguagesLib
) => {
  lib.registerCodeActionProvider("javascript", {
    provideCodeActions: (model, range, context, token) => {
      // console.log("provideCodeActions", model, range, context, token);
      return {
        actions: [
          {
            title: "Hello",
            diagnostics: [
              {
                ...range,
                message: "Could not find token",
                code: "no-token",
                severity: 8,
              },
            ],
            kind: "quickfix",
            edit: {
              edits: [
                {
                  resource: model.uri,
                  textEdit: { range, text: "hello" },
                  versionId: undefined,
                },
              ],
            },
          },
        ],
        dispose: () => {},
      };
    },
  });
};
