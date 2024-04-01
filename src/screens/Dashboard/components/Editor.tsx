import { createEffect, on, onMount, type Component } from "solid-js";
import { createCodeMirror } from "solid-codemirror";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { liquid } from "@codemirror/lang-liquid";
import { material } from "@uiw/codemirror-theme-material";

const Editor: Component<{ onValueChange: (value: string) => void; defaultValue: string }> = (props) => {
  const {
    // editorView,
    ref: editorRef,
    createExtension,
  } = createCodeMirror({
    /**
     * The initial value of the editor
     */
    value: props.defaultValue,
    /**
     * Fired whenever the editor code value changes.
     */
    onValueChange: (value) => {
      console.log("value changed", value);
      props.onValueChange(value);
    },
  });
  const extensions = (): Extension => {
    return [lineNumbers(), highlightActiveLineGutter(), liquid(), material];
  };

  createEffect(on(extensions, (extensions) => reconfigure(extensions)));

  const reconfigure = createExtension(extensions());
  return (
    <div
      ref={(el) => {
        onMount(() => {
          editorRef(el);
        });
      }}
    />
  );
};

export default Editor;
