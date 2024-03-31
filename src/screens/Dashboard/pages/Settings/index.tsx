import { type Component, createSignal } from "solid-js";
import Toolbar from "./components/Toolbar";
import { FiFileText, FiSettings } from "solid-icons/fi";
import { useI18n } from "@/i18n";
import Input from "@/shared/components/Menu/Input";
import { createCodeMirror } from "solid-codemirror";
import Dropdown from "@/shared/components/Menu/Dropdown";
import type { EditorView } from "@codemirror/view";
import type { Transaction } from "@codemirror/state";

const Settings: Component = () => {
  const [t] = useI18n();
  const [currentSection, setCurrentSection] = createSignal(0);

  const { editorView, ref: editorRef } = createCodeMirror({
    /**
     * The initial value of the editor
     */
    value: "console.log('hello world!')",
    /**
     * Fired whenever the editor code value changes.
     */
    onValueChange: (value) => console.log("value changed", value),
    /**
     * Fired whenever a change occurs to the document, every time the view updates.
     */
    onModelViewUpdate: (modelView) => console.log("modelView updated", modelView),
    /**
     * Fired whenever a transaction has been dispatched to the view.
     * Used to add external behavior to the transaction [dispatch function](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) for this editor view, which is the way updates get routed to the view
     */
    onTransactionDispatched: (tr: Transaction, view: EditorView) => console.log("Transaction", tr),
  });

  return (
    <div class="">
      <div class="w-full h-20 gap-2 flex justify-center items-center border-b border-black/20">
        <Toolbar
          text={t("settings.general.title")}
          icon={<FiSettings />}
          active={currentSection() === 0}
          onClick={() => setCurrentSection(0)}
        />
        <Toolbar
          text={t("settings.invoice.title")}
          icon={<FiFileText />}
          active={currentSection() === 1}
          onClick={() => setCurrentSection(1)}
        />
        <Toolbar
          text="Nastavení"
          icon={<FiSettings />}
          active={currentSection() === 2}
          onClick={() => setCurrentSection(2)}
        />
        <Toolbar text="Nastavení" icon={<FiSettings />} />
        <Toolbar text="Nastavení" icon={<FiSettings />} />
        <Toolbar text="Nastavení" icon={<FiSettings />} />
      </div>
      <div class="w-full h-full px-20">
        <Input label="Název" id="name" placeholder="Název" />
        <Dropdown />
        <div ref={editorRef} class="h-96" />
      </div>
    </div>
  );
};

export default Settings;
