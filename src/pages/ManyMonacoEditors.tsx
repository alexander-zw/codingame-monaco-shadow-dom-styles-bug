import "./BasicEditor.css";
import { MicrosoftMonacoEditor } from "../components/MicrosoftMonacoEditor";
import { createManyEditors } from "../components/createManyEditors";

export const ManyMonacoEditors = () => {
  return createManyEditors(
    "Multiple Monaco 0.51 Editors",
    MicrosoftMonacoEditor
  );
};
