import { useEffect, useMemo, useRef } from "react";
import "./App.css";
import { editor as codingameMonacoEditorLib } from "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.api";
import { editor as monacoEditorLib } from "monaco-editor/esm/vs/editor/editor.api";

import "@codingame/monaco-vscode-standalone-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js";

const SHADOW_DOM_CSS = `
  .editor-title {
    padding: 0 4rem;
    height: 25px;
  }

  .h2-and-editor-container {
    border: 1px solid #ccc;
    margin: 1rem;
    height: 200px;
  }

  .shadow-container {
    height: 200px;
  }

  .editor-container {
    overflow: hidden;
    width: 100%;
    height: 175px;
  }
`;

const EDITOR_OPTIONS = {
  value: `const x = 3; // comment
console.log("Hello, World!");`,
  language: "javascript",
};

type FixStylesOption =
  | { fixStylesApproach: "copy_all_tags" }
  | { fixStylesApproach: "provide_link"; styleLinkHref: string };

const appendStyles = (
  shadowRoot: ShadowRoot,
  fixStylesOption: FixStylesOption
) => {
  if (fixStylesOption.fixStylesApproach === "copy_all_tags") {
    // This adds all style tags. It does work, but seems quite heavy-handed. Surely this isn't the intended way?
    // I noticed in https://github.com/microsoft/monaco-editor/issues/4679 this was the approach, but at least
    // there we had a specific tag attr to filter by, I couldn't find any such tag for codingame.
    const rootStyles = document.querySelectorAll("style");
    for (const style of rootStyles) {
      shadowRoot.appendChild(style.cloneNode(true));
    }
  } else {
    // This adds the style link. This is the approach used in https://github.com/microsoft/monaco-editor/issues/4548.
    // However, I did not find any such link in the Codingame node modules.
    // It seems that for some reason, Codingame changed CSS to be injected inline in style tags, which makes adding
    // them to the shadow DOM more difficult. Cleanest fix I can think of is a Yarn patch. See ./codingame-patch-for-css.patch.
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = fixStylesOption.styleLinkHref;
    shadowRoot.appendChild(styleLink);
    // This adds styles defined by us.
    const ourStyle = document.createElement("style");
    ourStyle.textContent = SHADOW_DOM_CSS;
    shadowRoot.appendChild(ourStyle);
  }
};

const ShadowDomEditorTemplate = ({
  editorLib,
  title,
  fixStylesOption,
}: {
  editorLib: typeof codingameMonacoEditorLib | typeof monacoEditorLib;
  title: string;
  fixStylesOption: FixStylesOption;
}) => {
  const shadowContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<
    | codingameMonacoEditorLib.IStandaloneCodeEditor
    | monacoEditorLib.IStandaloneCodeEditor
  >(null);

  useEffect(() => {
    if (editorRef.current) {
      return; // Shadow elements already attached and editor already created.
    }

    if (!shadowContainerRef.current) {
      throw new Error("Shadow container not found");
    }

    // Attach Shadow DOM to the specified container.
    const shadowRoot = shadowContainerRef.current.attachShadow({
      mode: "open",
    });

    // Add styles to the shadow DOM since it's isolated from the main DOM.
    appendStyles(shadowRoot, fixStylesOption);

    // Add inner HTML structure with H2 heading and editor container.
    const shadowRootContainer = document.createElement("div");
    shadowRootContainer.className = "h2-and-editor-container";
    shadowRootContainer.innerHTML = `
      <div class="editor-title">${title}</div>
      <div class="editor-container"></div>
    `;
    shadowRoot.appendChild(shadowRootContainer);

    // Select the editor container from the shadow DOM.
    const editorContainer = shadowRoot.querySelector(".editor-container");

    // Create the Monaco editor inside the shadow DOM container.
    if (editorContainer) {
      editorRef.current = editorLib.create(
        editorContainer as HTMLElement,
        EDITOR_OPTIONS
      );
    }
  }, [editorLib, fixStylesOption, title]);

  return (
    <div ref={shadowContainerRef} className="shadow-container">
      {/* Shadow DOM content will go here. */}
    </div>
  );
};

const ShadowDomMonacoEditorWithLink = () => {
  return (
    <ShadowDomEditorTemplate
      editorLib={monacoEditorLib}
      title="This is the shadow DOM Monaco editor linking stylesheet"
      fixStylesOption={useMemo(
        () => ({
          fixStylesApproach: "provide_link",
          styleLinkHref:
            "node_modules/monaco-editor/min/vs/editor/editor.main.css",
        }),
        []
      )}
    />
  );
};

const ShadowDomCodingameEditorWithLink = () => {
  return (
    <ShadowDomEditorTemplate
      editorLib={codingameMonacoEditorLib}
      title="This is the shadow DOM Codingame editor linking stylesheet"
      // Neither link works.
      fixStylesOption={useMemo(
        () => ({
          fixStylesApproach: "provide_link",
          styleLinkHref:
            "node_modules/@codingame/monaco-vscode-editor-api/min/vs/editor/editor.main.css",
          // styleLinkHref:
          //   "node_modules/@codingame/monaco-vscode-api/min/vs/editor/editor.main.css",
        }),
        []
      )}
    />
  );
};

const ShadowDomMonacoEditorWithCopy = () => {
  return (
    <ShadowDomEditorTemplate
      editorLib={monacoEditorLib}
      title="This is the shadow DOM Monaco editor copying tags"
      fixStylesOption={useMemo(
        () => ({ fixStylesApproach: "copy_all_tags" }),
        []
      )}
    />
  );
};

const ShadowDomCodingameEditorWithCopy = () => {
  return (
    <ShadowDomEditorTemplate
      editorLib={codingameMonacoEditorLib}
      title="This is the shadow DOM Codingame editor copying tags"
      // Neither link works.
      fixStylesOption={useMemo(
        () => ({ fixStylesApproach: "copy_all_tags" }),
        []
      )}
    />
  );
};

const RootCodingameEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef =
    useRef<codingameMonacoEditorLib.IStandaloneCodeEditor>(null);

  useEffect(() => {
    if (editorRef.current) {
      return; // Editor already created.
    }

    if (!containerRef.current) {
      throw new Error("Container not found");
    }

    // Create the Monaco editor inside the shadow DOM container.
    editorRef.current = codingameMonacoEditorLib.create(
      containerRef.current,
      EDITOR_OPTIONS
    );
  }, []);

  return (
    <div className="h2-and-editor-container">
      <div className="editor-title">This is the root Codingame editor</div>
      <div ref={containerRef} className="editor-container">
        {/* Shadow DOM content will go here. */}
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <h1>This is outside the Shadow DOM</h1>
      <RootCodingameEditor />
      <ShadowDomCodingameEditorWithLink />
      <ShadowDomCodingameEditorWithCopy />
      <ShadowDomMonacoEditorWithLink />
      <ShadowDomMonacoEditorWithCopy />
    </div>
  );
}

export default App;
