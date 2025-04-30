import "./BasicEditor.css";
import { CodingameEditor } from "../components/CodingameEditor";

export const BasicCodingameEditor = ({
  provideCodeActions,
}: {
  provideCodeActions?: boolean;
}) => {
  return (
    <div id="basic-codingame-root">
      <h1>Basic Codingame Editor</h1>
      <CodingameEditor provideCodeActions={!!provideCodeActions} />
    </div>
  );
};
