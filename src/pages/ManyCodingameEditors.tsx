import "./BasicEditor.css";
import { CodingameEditor } from "../components/CodingameEditor";
import { createManyEditors } from "../components/createManyEditors";

export const ManyCodingameEditors = () => {
  return createManyEditors("Multiple Codingame Editors", CodingameEditor);
};
