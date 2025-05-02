import { initialize as initializeMonacoServices } from "vscode/services";

import "vscode/localExtensionHost";

import "./codingame-editor.all";
import {
  // getJavaScriptWorker,
  javascriptDefaults,
  ScriptTarget,
  // @ts-expect-error Has no types.
} from "@codingame/monaco-vscode-standalone-typescript-language-features";
// import "@codingame/monaco-vscode-standalone-languages/javascript/javascript.contribution";

javascriptDefaults.setCompilerOptions({
  target: ScriptTarget.ES2020,
  allowNonTsExtensions: true,
});

type WorkerFactoryMap = {
  [k: string]: (() => Worker | Promise<Worker>) | undefined;
};

const getSimpleWorker = () => {
  const worker = new Worker(new URL("./editor.worker", import.meta.url), {
    type: "module",
  });
  const originalOnMessage = worker.onmessage;
  if (originalOnMessage)
    worker.onmessage = (event) => {
      console.log("Worker message:", event);
      if (event.data.method !== "$loadForeignModule")
        originalOnMessage.call(worker, event);
    };
  return worker;
};

const workerLoaders: WorkerFactoryMap = {
  TextEditorWorker: getSimpleWorker,
  editorWorkerService: getSimpleWorker,
  javascript: () =>
    new Worker(new URL("./ts.worker", import.meta.url), { type: "module" }),
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

let alreadyInitialized = false;

export const setupCodingameServices = async () => {
  if (alreadyInitialized) {
    return;
  }
  alreadyInitialized = true;

  await initializeMonacoServices({}).catch((error) => {
    console.log("Error initializing Monaco services:", error);
  });

  // const { javascriptDefaults, ScriptTarget } = await import(
  //   // @ts-expect-error Has no types.
  //   "@codingame/monaco-vscode-standalone-typescript-language-features"
  // );
  // javascriptDefaults.setCompilerOptions({
  //   target: ScriptTarget.ES2020,
  //   allowNonTsExtensions: true,
  // });
  await import(
    // @ts-expect-error Has no types.
    "@codingame/monaco-vscode-standalone-languages/javascript/javascript.contribution"
  );
};
