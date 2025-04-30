// import {
//   IInstantiationService,
//   ILanguageConfigurationService,
//   ILanguageFeaturesService,
//   ILanguageService,
//   IThemeService,
//   StandaloneServices,
// } from "vscode/services";
import { initialize as initializeMonacoServices } from "vscode/services";
// import { errorHandler } from "vscode/vscode/vs/base/common/errors";

import "./codingame-editor.all";
// import "vscode/services";
import {
  // getJavaScriptWorker,
  javascriptDefaults,
  ScriptTarget,
  // @ts-expect-error Has no types.
} from "@codingame/monaco-vscode-standalone-typescript-language-features";
// import "@codingame/monaco-vscode-standalone-languages/javascript/javascript.contribution";
// import TsWorker from "./ts.worker.js?worker";
// import EditorWorker from "./editor.worker.js?worker";

import "vscode/localExtensionHost";

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
  // return new EditorWorker();
};

// let resolveJavascriptWorkerPromise: ((value: Worker) => void) | null = null;
// const javascriptWorkerPromise = new Promise<Worker>((resolve) => {
//   resolveJavascriptWorkerPromise = resolve;
// }).catch((error) => {
//   console.log("Error initializing JavaScript worker:", error);
//   return new Worker(
//     new URL(
//       "@codingame/monaco-vscode-standalone-typescript-language-features/worker",
//       import.meta.url
//     ),
//     { type: "module" }
//   );
// });

const workerLoaders: WorkerFactoryMap = {
  TextEditorWorker: getSimpleWorker,
  editorWorkerService: getSimpleWorker,
  javascript: () =>
    new Worker(new URL("./ts.worker", import.meta.url), { type: "module" }),
  // new TsWorker(),
  // javascript: () => javascriptWorkerPromise,
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

javascriptDefaults.setCompilerOptions({
  target: ScriptTarget.ES2020,
  allowNonTsExtensions: true,
});

// const rootElement = document.getElementById("basic-codingame-root");
// const initializePromise = initializeMonacoServices({
//   domElement: rootElement,
// });

let alreadyInitialized = false;

export const setupCodingameServices = async () => {
  if (alreadyInitialized) {
    return;
  }
  alreadyInitialized = true;

  // const originalErrorHandler = errorHandler.unexpectedErrorHandler;
  // errorHandler.unexpectedErrorHandler = (error: any) => {
  //   if (
  //     error.message === "Unexpected usage" &&
  //     error.stack?.includes("$loadForeignModule")
  //   ) {
  //     console.log('caught "Unexpected usage" error');
  //     return;
  //   }
  //   originalErrorHandler(error);
  // };

  // StandaloneServices.initialize(IThemeService);
  // StandaloneServices.initialize(IInstantiationService);
  // StandaloneServices.initialize(ILanguageService);
  // StandaloneServices.initialize(ILanguageConfigurationService);
  // StandaloneServices.initialize(ILanguageFeaturesService);
  await initializeMonacoServices({}).catch((error) => {
    console.log("Error initializing Monaco services:", error);
  });
  // console.log(
  //   "Setting up Codingame services",
  //   StandaloneServices.get(IThemeService),
  //   StandaloneServices.get(IInstantiationService),
  //   StandaloneServices.get(ILanguageService),
  //   StandaloneServices.get(ILanguageConfigurationService),
  //   StandaloneServices.get(ILanguageFeaturesService)
  // );

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

  // resolveJavascriptWorkerPromise!(getJavaScriptWorker());

  // return initializeMonacoServices({
  //   ...StandaloneServices.get(IThemeService),
  //   ...StandaloneServices.get(IInstantiationService),
  //   ...StandaloneServices.get(ILanguageFeaturesService),
  // });
};
