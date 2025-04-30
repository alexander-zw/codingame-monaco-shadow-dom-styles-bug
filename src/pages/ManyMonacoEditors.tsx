import "./BasicEditor.css";
import { MicrosoftMonacoEditor } from "../components/MicrosoftMonacoEditor";

const NUM_EDITORS = 30;

export const ManyMonacoEditors = () => {
  return (
    <div id="many-editors-root">
      <h1>Multiple Monaco Editors</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
        }}
      >
        {Array.from({ length: NUM_EDITORS }).map((_, index) => (
          <MicrosoftMonacoEditor
            key={index}
            initialValue={`// Editor ${
              index + 1
            }\nconst x = 3; an error // comment`}
            className="editor-container-shorter"
            containerClassName="h2-and-editor-container-shorter"
            provideCodeActions
            measureInit={NUM_EDITORS}
          />
        ))}
      </div>
    </div>
  );
};

export default ManyMonacoEditors;
