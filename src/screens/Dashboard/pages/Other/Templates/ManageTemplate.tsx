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
  For,
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
import toast from "solid-toast";
import { FiEye, FiList, FiSettings, FiTrash } from "solid-icons/fi";
import TemplateHint from "@/screens/Dashboard/components/TemplateHint";
import { createForm } from "@tanstack/solid-form";
import Form from "@/shared/components/Form";
import Section from "@/shared/components/Form/Section";
import Input from "@/shared/components/Form/Input";
import PdfRenderer from "@/shared/components/PdfRenderer";
import Dropdown from "@/shared/components/Form/Dropdown";
import Box from "@/shared/components/Box";
import { templatesHtml } from "@/constants";

const ManageTemplate: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const navigate = useNavigate();
  const [t] = useI18n();
  const [showSettings, setShowSettings] = createSignal(false);
  const [showHints, setShowHints] = createSignal(false);
  const [activeTemplate, setActiveTemplate] = createSignal(1);

  const templates = [
    { id: 1, name: t("setup.step2.template.basic"), icon: "📄" },
    { id: 2, name: t("setup.step2.template.modern"), icon: "📊" },
    { id: 3, name: t("setup.step2.template.creative"), icon: "🎨" },
  ];

  createEffect(() => {
    const template = templatesHtml.cz.find((t) => t.id === activeTemplate());
    if (template) {
      setTemplateCode(template.code);
    }
  });

  const [templateCode, setTemplateCode] = createSignal(templatesHtml.cz[0].code);

  const form = createForm<{
    name: string;
    templateType: "INVOICE" | "PROFORMA" | "RECEIVE";
  }>(() => ({
    defaultValues: {
      name: "",
      templateType: "INVOICE",
    },
    onSubmitInvalid: (e) => {
      console.log("invalid", e.formApi.state.errors);
    },

    onSubmit: async (template) => {
      try {
        if (params.id) {
          await updateTemplate(Number.parseInt(params.id), {
            ...template.value,
            html: templateCode(),
          });
          toast.success(t("pages.other.templates.toast.updated"));
        } else {
          await createTemplate({
            ...template.value,
            html: templateCode(),
          });
          toast.success(t("pages.other.templates.toast.saved"));
        }
        navigate("/dashboard/other/templates");
      } catch (e) {
        toast.error(t("pages.other.templates.toast.saveFailed"));
        console.error(e);
      }
    },
  }));

  onMount(async () => {
    if (params.id) {
      const data = await getTemplate(Number(params.id));
      setTemplateCode(data.html);
      form.update({
        ...form.options,
        defaultValues: data,
      });
    }
  });

  return (
    <>
      <PageHeader
        title={[t("sidebar.section.other"), t("sidebar.button.templates"), params.id ? params.id : t("pageHeader.new")]}
        actionElements={[
          <HeaderButton onClick={form.handleSubmit} buttonType="primary">
            {t("pages.other.templates.save")}
          </HeaderButton>,
          <HeaderButton buttonType="secondary" onClick={() => setShowSettings(!showSettings())}>
            <FiSettings />
          </HeaderButton>,
          <HeaderButton buttonType="secondary" onClick={() => setShowHints(!showHints())}>
            <FiList />
          </HeaderButton>,
          // <HeaderButton buttonType="secondary" onClick={() => setShowPreview(!showPreview())}>
          //   <FiEye />
          // </HeaderButton>,
          <Show when={params.id}>
            <HeaderButton
              buttonType="secondary"
              onClick={async () => {
                try {
                  await deleteTemplate(Number(params.id));
                  toast.success(t("pages.other.templates.toast.deleted"));
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
          <h2 class="text-lg font-bold mb-4">{t("pages.other.templates.dataHints")}</h2>
          <TemplateHint />
        </SidePopup>
        <SidePopup show={showSettings()} onClickOutside={() => setShowSettings(false)}>
          <Form>
            <Section title={t("pages.other.templates.sections.information")} columns={1}>
              <form.Field name="name">
                {(field) => (
                  <Input
                    label={t("pages.other.templates.name")}
                    type="text"
                    placeholder={t("pages.other.templates.namePlaceholder")}
                    defaultValue={field().state.value}
                    onChange={(e) => field().handleChange(e)}
                  />
                )}
              </form.Field>
              <form.Field name="templateType">
                {(field) => (
                  <Dropdown
                    label={t("pages.other.templates.templateType")}
                    defaultValueId={form.state.values.templateType}
                    data={[
                      { id: "INVOICE", label: t("pages.other.templates.templateTypes.invoice") },
                      { id: "PROFORMA", label: t("pages.other.templates.templateTypes.proforma") },
                      { id: "RECEIVE", label: t("pages.other.templates.templateTypes.receive") },
                    ]}
                    onSelect={(data) => field().handleChange(data.id as "INVOICE" | "PROFORMA" | "RECEIVE")}
                  />
                )}
              </form.Field>
            </Section>
            <Section title={t("pages.other.templates.sections.selectTemplate")} columns={1}>
              <For each={templates}>
                {(template) => (
                  <Box
                    active={activeTemplate() === template.id}
                    onClick={() => setActiveTemplate(template.id)}
                    icon={template.icon}
                  >
                    {template.name}
                  </Box>
                )}
              </For>
            </Section>
          </Form>
        </SidePopup>
      </div>
      {/* <Show when={showPreview()}>
        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div class="bg-white rounded max-w-4xl p-4 shadow-xl w-full max-h-full overflow-auto">
            <PdfRenderer data={mockData} />
          </div>
        </div>
      </Show> */}
    </>
  );
};

export default ManageTemplate;

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
