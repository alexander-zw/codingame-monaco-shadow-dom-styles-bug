import { createManyEditors } from "../components/createManyEditors";
import { MicrosoftMonaco43Editor } from "../components/MicrosoftMonaco43Editor";

export const ManyMonaco43Editors = () => {
  return createManyEditors(
    "Multiple Monaco 0.43 Editors",
    MicrosoftMonaco43Editor
  );
};
