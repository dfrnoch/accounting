import TemplateRenderer from "@/shared/components/PdfRenderer";
import { Hr } from "@/shared/components/Menu/Hr";
import { type Accessor, type Setter, createEffect, createSignal, on, onMount, type Component, Show } from "solid-js";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import { useI18n } from "@/i18n";
import { useNavigate, useParams } from "@solidjs/router";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { createCodeMirror, createEditorControlledValue } from "solid-codemirror";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { liquid } from "@codemirror/lang-liquid";
import { material } from "@uiw/codemirror-theme-material";
import Popover from "@/shared/components/Popover";
import { createTemplate, getTemplate, updateTemplate } from "@/bindings";
import { FiSettings } from "solid-icons/fi";
import toast from "solid-toast";

const ManageTemplate: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const navigate = useNavigate();
  const [t] = useI18n();
  const [showRender, setShowRender] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);

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

  onMount(async () => {
    if (params.id) {
      const data = await getTemplate(Number(params.id));
      setTemplateCode(data.html);
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
          <HeaderButton
            onClick={async () => {
              if (params.id) {
                try {
                  await updateTemplate(Number(params.id), templateCode());
                  toast.success("Template updated"); // TODO: i18n
                  navigate("/dashboard/other/templates");
                } catch (e) {
                  toast.error(e as string);
                }
              } else {
                try {
                  await createTemplate({ templateType: "INVOICE", html: templateCode(), name: "Cus" });
                  toast.success("Template created"); // TODO: i18n
                  navigate("/dashboard/other/templates");
                } catch (e) {
                  toast.error(e as string);
                }
              }
            }}
            buttonType="primary"
          >
            Save
          </HeaderButton>,
          <HeaderButton onClick={() => setShowRender(!showRender())} buttonType="secondary">
            {showRender() ? "Edit" : "Preview"}
          </HeaderButton>,
          <HeaderButton buttonType="secondary" onClick={() => setShowSettings(!showSettings())}>
            <FiSettings />
          </HeaderButton>,
        ]}
      />

      <div class="relative h-full">
        <Editor code={templateCode} onValueChange={setTemplateCode} />
        <Show when={showSettings()}>
          <div class="absolute top-0 left-0 w-full  h-full grid grid-cols-6 grid-rows-1 justify-between z-999">
            <div class="bg-black bg-opacity-20 w-full col-span-4" onClick={() => setShowSettings(false)} />
            <div class="bg-red col-span-2">dada</div>
          </div>
        </Show>
      </div>

      <Popover show={showRender()} onClose={() => setShowRender(false)} title="cus">
        <div class="w-full lg:w-1/2 bg-red rounded-xl gap-4 flex flex-col p-4">
          <h1 class="text-xl font-bold">Preview</h1>
          <Hr />
          <TemplateRenderer template={templateCode()} data={{ email: "joe@aa.cz", phone: "12122212" }} />
        </div>
      </Popover>
    </>
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
