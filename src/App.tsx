import { CodingameVsMonacoInShadowDomComparison } from "./CodingameVsMonacoInShadowDomComparison";
import { SideBySideDiffEditor } from "./SideBySideDiffEditor";

type CurrentView =
  | "CodingameVsMonacoInShadowDomComparison"
  | "SideBySideDiffEditor";

const CURRENT_VIEW: CurrentView = "CodingameVsMonacoInShadowDomComparison";

function App() {
  switch (CURRENT_VIEW) {
    case "CodingameVsMonacoInShadowDomComparison":
      return <CodingameVsMonacoInShadowDomComparison />;
    case "SideBySideDiffEditor":
      return <SideBySideDiffEditor />;
  }
}

export default App;
