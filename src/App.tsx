import { Suspense, lazy } from "react";

// Import lazily to avoid side effect imports from affecting each other.
const BasicCodingameEditor = lazy(() =>
  import("./pages/BasicCodingameEditor").then((module) => ({
    default: module.BasicCodingameEditor,
  }))
);
const BasicMicrosoftMonacoEditor = lazy(() =>
  import("./pages/BasicMicrosoftMonacoEditor").then((module) => ({
    default: module.BasicMicrosoftMonacoEditor,
  }))
);
const CodingameVsMonacoInShadowDomComparison = lazy(() =>
  import("./pages/CodingameVsMonacoInShadowDomComparison").then((module) => ({
    default: module.CodingameVsMonacoInShadowDomComparison,
  }))
);
const SideBySideDiffEditor = lazy(() =>
  import("./pages/SideBySideDiffEditor").then((module) => ({
    default: module.SideBySideDiffEditor,
  }))
);
const ManyMonacoEditors = lazy(() =>
  import("./pages/ManyMonacoEditors").then((module) => ({
    default: module.ManyMonacoEditors,
  }))
);
const ManyCodingameEditors = lazy(() =>
  import("./pages/ManyCodingameEditors").then((module) => ({
    default: module.ManyCodingameEditors,
  }))
);

type CurrentView =
  | "BasicCodingameEditor"
  | "BasicMicrosoftMonacoEditor"
  | "CodingameEditorWithCodeActions"
  | "MicrosoftMonacoEditorWithCodeActions"
  | "CodingameVsMonacoInShadowDomComparison"
  | "SideBySideDiffEditor"
  | "ManyMonacoEditors"
  | "ManyCodingameEditors";

const CURRENT_VIEW: CurrentView = "ManyMonacoEditors";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewSwitcher view={CURRENT_VIEW} />
    </Suspense>
  );
}

const ViewSwitcher = ({ view }: { view: CurrentView }) => {
  switch (view) {
    case "BasicCodingameEditor":
      return <BasicCodingameEditor />;
    case "BasicMicrosoftMonacoEditor":
      return <BasicMicrosoftMonacoEditor />;
    case "CodingameEditorWithCodeActions":
      return <BasicCodingameEditor provideCodeActions />;
    case "MicrosoftMonacoEditorWithCodeActions":
      return <BasicMicrosoftMonacoEditor provideCodeActions />;
    case "CodingameVsMonacoInShadowDomComparison":
      return <CodingameVsMonacoInShadowDomComparison />;
    case "SideBySideDiffEditor":
      return <SideBySideDiffEditor />;
    case "ManyMonacoEditors":
      return <ManyMonacoEditors />;
    case "ManyCodingameEditors":
      return <ManyCodingameEditors />;
    default:
      unreachable(view);
  }
};

const unreachable = (_: never) => {
  throw new Error("Unreachable code");
};

export default App;
