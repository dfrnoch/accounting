import {
  type Accessor,
  type Setter,
  createEffect,
  createSignal,
  on,
  onMount,
  type Component,
  Show,
  type ParentComponent,
} from "solid-js";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import { useI18n } from "@/i18n";
import { useNavigate, useParams } from "@solidjs/router";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { createCodeMirror, createEditorControlledValue } from "solid-codemirror";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { liquid } from "@codemirror/lang-liquid";
import { material } from "@uiw/codemirror-theme-material";
import { createTemplate, deleteTemplate, getTemplate, updateTemplate } from "@/bindings";
import { FiList, FiSettings, FiTrash } from "solid-icons/fi";
import toast from "solid-toast";
import TemplateHint from "@/screens/Dashboard/components/TemplateHint";
import { createForm } from "@tanstack/solid-form";
import Form from "@/shared/components/Form";
import Input from "@/shared/components/Form/Input";
import Section from "@/shared/components/Form/Section";
import Dropdown from "@/shared/components/Form/Dropdown";

const ManageTemplate: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const navigate = useNavigate();
  const [t] = useI18n();
  const [showRender, setShowRender] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [showHints, setShowHints] = createSignal(false);

  const [templateCode, setTemplateCode] = createSignal(`
  {% assign people = "alice, bob, carol" | split: ", " -%}

  <ul>
  {%- for person in people %}
    <li>
      <a href="{{person | prepend: "http://example.com/"}}">
        {{ person | capitalize }}
      </a>
    </li>
  {%- endfor%}
  </ul>
  
`);
  const form = createForm<{
    name: string;
    html: string;
    templateType: "INVOICE" | "ESTIMATE" | "RECEIPT";
  }>(() => ({
    defaultValues: {
      name: "",
      html: templateCode(),
      templateType: "INVOICE",
    },
    onSubmitInvalid: (e) => {
      console.log("invalid", e.formApi.state.errors);
    },

    onSubmit: async (template) => {
      try {
        if (params.id) {
          await updateTemplate(Number.parseInt(params.id), template.value);
          toast.success("Template updated");
        } else {
          await createTemplate(template.value);
          toast.success("Template saved");
        }
        navigate("/dashboard/other/templates");
      } catch (e) {
        toast.error("Failed to save template");
        console.error(e);
      }
    },
  }));

  onMount(async () => {
    if (params.id) {
      const data = await getTemplate(Number(params.id));
      form.update({ ...form.options, defaultValues: data });
    }
  });

  return (
    <>
      <PageHeader
        title={[
          t("sidebar.section.other"),
          t("sidebar.button.templates"),
          params.id ? params.id : t("pageHeaader.new"),
        ]}
        actionElements={[
          <HeaderButton onClick={form.handleSubmit} buttonType="primary">
            Save
          </HeaderButton>,
          <HeaderButton onClick={() => setShowRender(!showRender())} buttonType="secondary">
            {showRender() ? "Edit" : "Preview"}
          </HeaderButton>,
          <HeaderButton buttonType="secondary" onClick={() => setShowSettings(!showSettings())}>
            <FiSettings />
          </HeaderButton>,
          <HeaderButton buttonType="secondary" onClick={() => setShowHints(!showHints())}>
            <FiList />
          </HeaderButton>,
          <Show when={params.id}>
            <HeaderButton
              buttonType="secondary"
              onClick={async () => {
                try {
                  await deleteTemplate(Number(params.id));
                  toast.success("Template deleted"); // TODO: i18n
                  navigate("/dashboard/other/templates");
                } catch (e) {
                  toast.error(e as string);
                }
              }}
            >
              <FiTrash />
            </HeaderButton>
          </Show>,
        ]}
      />

      <div class="relative h-full">
        <Editor code={templateCode} onValueChange={setTemplateCode} />
        <SidePopup show={showHints()} onClickOutside={() => setShowHints(false)}>
          <h2 class="text-lg font-bold mb-4">Data Hints</h2>
          <TemplateHint />
        </SidePopup>
        <SidePopup show={showSettings()} onClickOutside={() => setShowSettings(false)}>
          <Form>
            <Section title="Template Information" columns={1}>
              <form.Field name="name">
                {(field) => (
                  <Input
                    label="Name"
                    type="text"
                    placeholder="Invoice"
                    defaultValue={field().state.value}
                    onChange={(e) => field().handleChange(e)}
                  />
                )}
              </form.Field>
              <form.Field name="templateType">
                {(field) => (
                  <Dropdown
                    label="Template Type"
                    defaultValueId={form.state.values.templateType}
                    data={[
                      { id: "INVOICE", label: "Invoice" },
                      { id: "ESTIMATE", label: "Estimate" },
                      { id: "RECEIPT", label: "Receipt" },
                    ]}
                    onSelect={(data) => field().handleChange(data.id as "INVOICE" | "ESTIMATE" | "RECEIPT")}
                  />
                )}
              </form.Field>
            </Section>
          </Form>
        </SidePopup>
      </div>
    </>
  );
};

const SidePopup: ParentComponent<{ show: boolean; onClickOutside: () => void }> = (props) => {
  return (
    <Show when={props.show}>
      <div class="fixed top-0 left-0 w-full h-full grid grid-cols-6 grid-rows-1 justify-between z-999">
        <div class="bg-black bg-opacity-20 w-full col-span-4" onClick={props.onClickOutside} />
        <div class="bg-primary col-span-2 p-4 overflow-scroll pt-44px">{props.children}</div>
      </div>
    </Show>
  );
};

export default ManageTemplate;

const Editor: Component<{ onValueChange: Setter<string>; code: Accessor<string> }> = (props) => {
  const {
    editorView,
    ref: editorRef,
    createExtension,
  } = createCodeMirror({
    /**
     * The initial value of the editor
     */
    value: props.code(),
    /**
     * Fired whenever the editor code value changes.
     */
    onValueChange: (value) => {
      props.onValueChange(value);
    },
  });
  const extensions = (): Extension => {
    return [lineNumbers(), highlightActiveLineGutter(), liquid(), material];
  };

  createEditorControlledValue(editorView, props.code);

  createEffect(on(extensions, (extensions) => reconfigure(extensions)));

  const reconfigure = createExtension(extensions());
  return (
    <div
      class="h-full w-full"
      ref={(el) => {
        onMount(() => {
          editorRef(el);
        });
      }}
    />
  );
};
