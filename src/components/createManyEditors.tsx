import "../pages/BasicEditor.css";
import { CodingameEditor } from "./CodingameEditor";
import { MicrosoftMonaco43Editor } from "./MicrosoftMonaco43Editor";
import { MicrosoftMonacoEditor } from "./MicrosoftMonacoEditor";

const NUM_EDITORS = 30;

export const createManyEditors = (
  title: string,
  Component:
    | typeof CodingameEditor
    | typeof MicrosoftMonacoEditor
    | typeof MicrosoftMonaco43Editor
) => {
  return (
    <div id="many-editors-root">
      <h1>{title}</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
        }}
      >
        {Array.from({ length: NUM_EDITORS }).map((_, index) => (
          <Component
            key={index}
            initialValue={`// Editor ${
              index + 1
            }\nconst num = 3; num++; an error // num`}
            className="editor-container-shorter"
            containerClassName="h2-and-editor-container-shorter"
            provideCodeActions
            registerFocusEvents
            measureInit={NUM_EDITORS}
          />
        ))}
      </div>
    </div>
  );
};
