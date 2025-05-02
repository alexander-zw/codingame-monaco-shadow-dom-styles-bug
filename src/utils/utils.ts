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

const createEditorAndRegister = ({
  editorLib,
  languagesLib,
  containerRef,
  editorRef,
  options,
  provideCodeActions,
  registerFocusEvents,
}: Pick<
  Parameters<typeof createEditor>[0],
  | "editorLib"
  | "languagesLib"
  | "containerRef"
  | "editorRef"
  | "options"
  | "provideCodeActions"
  | "registerFocusEvents"
>) => {
  if (!containerRef.current) {
    throw new Error("Container not found");
  }

  editorRef.current = editorLib.create(containerRef.current, options as never);

  if (provideCodeActions) registerCodeActionProvider(languagesLib);

  const dispose = registerFocusEvents
    ? registerHighlightOnFocus(
        editorRef.current,
        registerFocusEvents === "string"
      )
    : undefined;

  return () => dispose?.();
};

export const createEditor = async ({
  editorLib,
  languagesLib,
  containerRef,
  editorRef,
  options,
  provideCodeActions,
  registerFocusEvents,
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
  registerFocusEvents?: "string" | "boolean";
  measurementRef?: {
    started: number;
    finished: number;
    totalTime: number;
    totalNumber: number;
  };
  initLib: () => Promise<void>;
}) => {
  if (initLib) await initLib();

  if (editorRef.current) return;

  if (measurementRef) {
    if (measurementRef.started === 0) performance.mark("idle-start");

    const editorIndex = measurementRef.started++;
    const editorId = `editor-${editorIndex}`;
    performance.mark(`${editorId}-start`);

    createEditorAndRegister({
      editorLib,
      languagesLib,
      containerRef,
      editorRef,
      options,
      provideCodeActions,
      registerFocusEvents,
    });

    performance.mark(`${editorId}-end`);
    performance.measure(
      `Editor ${editorIndex} init`,
      `${editorId}-start`,
      `${editorId}-end`
    );

    const measure = performance
      .getEntriesByName(`Editor ${editorIndex} init`)
      .pop();
    if (measure) {
      measurementRef.totalTime += measure.duration;
      measurementRef.finished++;
      if (measurementRef.finished === measurementRef.totalNumber) {
        console.log(
          `${measurementRef.finished} editors loaded in ${measurementRef.totalTime}ms`
        );

        requestIdleCallback(() => {
          performance.mark("idle-end");
          performance.measure("Time until idle", "idle-start", "idle-end");
          const measure = performance.getEntriesByName("Time until idle").pop();
          console.log(`Time until idle: ${measure?.duration}ms`);

          performance.clearMarks();
          performance.clearMeasures();
        });
      }
    }
  } else {
    createEditorAndRegister({
      editorLib,
      languagesLib,
      containerRef,
      editorRef,
      options,
      provideCodeActions,
      registerFocusEvents,
    });
  }
};

const registerCodeActionProvider = (
  lib:
    | typeof codingameLanguagesLib
    | typeof monacoLanguagesLib
    | typeof monacoLanguagesLib43
) => {
  lib.registerCodeActionProvider("javascript", {
    provideCodeActions: (model, range) => {
      // provideCodeActions: (model, range, context, token) => {
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

export const registerHighlightOnFocus = <IsString extends boolean>(
  editor: IsString extends true
    ?
        | monacoEditorLib.IStandaloneCodeEditor
        | codingameEditorLib.IStandaloneCodeEditor
    : monacoEditorLib43.IStandaloneCodeEditor,
  isString: IsString
) => {
  const listeners = [
    editor.onDidFocusEditorText(() => {
      editor.updateOptions({
        occurrencesHighlight: (isString ? "singleFile" : true) as never,
        selectionHighlight: true,
      });
    }),
    editor.onDidBlurEditorText(() => {
      editor.updateOptions({
        occurrencesHighlight: (isString ? "off" : false) as never,
        selectionHighlight: false,
      });
    }),
  ];

  return () => listeners.forEach((listener) => listener.dispose());
};
