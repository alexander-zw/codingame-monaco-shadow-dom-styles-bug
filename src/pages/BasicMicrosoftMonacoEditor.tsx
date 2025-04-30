import "./BasicEditor.css";
import { MicrosoftMonacoEditor } from "../components/MicrosoftMonacoEditor";

export const BasicMicrosoftMonacoEditor = ({
  provideCodeActions,
}: {
  provideCodeActions?: boolean;
}) => {
  return (
    <div id="basic-codingame-root">
      <h1>Basic Microsoft Monaco Editor</h1>
      <MicrosoftMonacoEditor provideCodeActions={!!provideCodeActions} />
    </div>
  );
};
