import type {
  editor as codingameEditorLib,
  languages as codingameLanguagesLib,
} from "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.api";
import type {
  editor as monacoEditorLib,
  languages as monacoLanguagesLib,
} from "monaco-editor/esm/vs/editor/editor.api";
import type {
  editor as monacoEditorLib43,
  languages as monacoLanguagesLib43,
} from "monaco-editor43/esm/vs/editor/editor.api";

export const EDITOR_OPTIONS: codingameEditorLib.IStandaloneEditorConstructionOptions &
  monacoEditorLib43.IStandaloneEditorConstructionOptions = {
  value: `const x = 3; // comment
console.log("Hello, World!");
this is an error`,
  language: "javascript",
  theme: "vs-light",
};

type MonacoLibs = "codingame" | "monaco" | "monaco43";

type LibToArgs = {
  codingame: {
    editorLib: typeof codingameEditorLib;
    languagesLib: typeof codingameLanguagesLib;
    editorRef: React.RefObject<codingameEditorLib.IStandaloneCodeEditor | null>;
    options: codingameEditorLib.IStandaloneEditorConstructionOptions;
  };
  monaco: {
    editorLib: typeof monacoEditorLib;
    languagesLib: typeof monacoLanguagesLib;
    editorRef: React.RefObject<monacoEditorLib.IStandaloneCodeEditor | null>;
    options: monacoEditorLib.IStandaloneEditorConstructionOptions;
  };
  monaco43: {
    editorLib: typeof monacoEditorLib43;
    languagesLib: typeof monacoLanguagesLib43;
    editorRef: React.RefObject<monacoEditorLib43.IStandaloneCodeEditor | null>;
    options: monacoEditorLib43.IStandaloneEditorConstructionOptions;
  };
};

export const createEditor = async <Lib extends MonacoLibs>({
  editorLib,
  languagesLib,
  containerRef,
  editorRef,
  options,
  provideCodeActions,
  measurementRef,
  initLib,
}: {
  editorLib:
    | typeof codingameEditorLib
    | typeof monacoEditorLib
    | typeof monacoEditorLib43;
  languagesLib:
    | typeof codingameLanguagesLib
    | typeof monacoLanguagesLib
    | typeof monacoLanguagesLib43;
  editorRef: React.RefObject<
    | codingameEditorLib.IStandaloneCodeEditor
    | monacoEditorLib.IStandaloneCodeEditor
    | monacoEditorLib43.IStandaloneCodeEditor
    | null
  >;
  options: codingameEditorLib.IStandaloneEditorConstructionOptions &
    monacoEditorLib.IStandaloneEditorConstructionOptions &
    monacoEditorLib43.IStandaloneEditorConstructionOptions;
  containerRef: React.RefObject<HTMLDivElement | null>;
  provideCodeActions?: boolean;
  measurementRef?: { count: number; totalTime: number; totalNumber: number };
  initLib?: () => Promise<void>;
}) => {
  if (editorRef.current) return;

  if (!containerRef.current) {
    throw new Error("Container not found");
  }

  if (initLib) await initLib();

  if (measurementRef) {
    const editorIndex = measurementRef.count++;
    const editorId = `editor-${editorIndex}`;
    performance.mark(`${editorId}-start`);

    editorRef.current = editorLib.create(containerRef.current, options);

    if (provideCodeActions) registerCodeActionProvider<Lib>(languagesLib);

    performance.mark(`${editorId}-end`);
    performance.measure(
      `Editor ${measurementRef.count} init`,
      `${editorId}-start`,
      `${editorId}-end`
    );

    const measure = performance
      .getEntriesByName(`Editor ${editorIndex} init`)
      .pop();
    if (measure) {
      measurementRef.totalTime += measure.duration;
      if (editorIndex === measurementRef.totalNumber - 1) {
        console.log(
          `${measurementRef.count} editors loaded in ${measurementRef.totalTime}ms`
        );
        performance.clearMarks();
        performance.clearMeasures();
      }
    }
  } else {
    editorRef.current = editorLib.create(containerRef.current, options);

    if (provideCodeActions) registerCodeActionProvider<Lib>(languagesLib);
  }
};

const registerCodeActionProvider = <Lib extends MonacoLibs>(
  lib: LibToArgs[Lib]["languagesLib"]
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
