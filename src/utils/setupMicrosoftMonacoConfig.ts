import { languages as monacoLanguagesLib } from "monaco-editor/esm/vs/editor/editor.api";

import "monaco-editor/esm/vs/editor/editor.all";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

type WorkerFactoryMap = { [k: string]: (() => Worker) | undefined };

const getSimpleWorker = () =>
  new Worker(
    new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
    { type: "module" }
  );

const workerLoaders: WorkerFactoryMap = {
  TextEditorWorker: getSimpleWorker,
  editorWorkerService: getSimpleWorker,
  javascript: () =>
    new Worker(
      new URL(
        "monaco-editor/esm/vs/language/typescript/ts.worker.js",
        import.meta.url
      ),
      { type: "module" }
    ),
};

window.MonacoEnvironment = {
  getWorker: (_workerId: unknown, label: string) => {
    console.log("getting worker for", label);
    const workerFactory = workerLoaders[label];
    if (workerFactory) {
      return workerFactory();
    }
    throw new Error(`Monaco requested worker ${label} not found`);
  },
  createTrustedTypesPolicy: () => undefined,
};

monacoLanguagesLib.typescript.javascriptDefaults.setCompilerOptions({
  target: monacoLanguagesLib.typescript.ScriptTarget.ES2020,
  allowNonTsExtensions: true,
});
