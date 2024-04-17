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
  const [showSettings, setShowSettings] = createSignal(false);
  const [showHints, setShowHints] = createSignal(false);

  const [templateCode, setTemplateCode] = createSignal(`
  <div class="bg-white p-8 rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Invoice</h1>
  
  <div class="mb-8"> 
    <p class="text-gray-600">Invoice Number: {{ number }}</p>
    <p class="text-gray-600">Issue Date: {{ issueDate }}</p>
    <p class="text-gray-600">Due Date: {{ dueDate }}</p>
  </div>
    
  <div class="grid grid-cols-2 gap-8 mb-8">
    <div>
      <h2 class="text-xl font-bold mb-2">Client Details</h2>
      <p>{{ client.name }}</p>
      <p>CIN: {{ client.cin }}</p>
      <p>VAT ID: {{ client.vatId }}</p>
      <p>{{ client.address }}</p>
      <p>{{ client.city }}, {{ client.zip }}</p>
      <p>Email: {{ client.email }}</p>
      <p>Phone: {{ client.phone }}</p>
      <p>Bank Account: {{ client.bankAccount }}</p>
      <p>IBAN: {{ client.IBAN }}</p>
    </div>
    
    <div>
      <h2 class="text-xl font-bold mb-2">Company Details</h2>
      <p>{{ company.name }}</p>
      <p>CIN: {{ company.cin }}</p>
      <p>VAT ID: {{ company.vatId }}</p>
      <p>{{ company.address }}</p>
      <p>{{ company.city }}, {{ company.zip }}</p>
      <p>Email: {{ company.email }}</p>
      <p>Phone: {{ company.phone }}</p>
      <p>Bank Account: {{ company.bankAccount }}</p>
      <p>IBAN: {{ company.IBAN }}</p>
    </div>
  </div>
  
  <table class="w-full mb-8">
    <thead>
      <tr class="bg-gray-100">
        <th class="px-4 py-2">Description</th>
        <th class="px-4 py-2">Quantity</th>
        <th class="px-4 py-2">Price</th>
        <th class="px-4 py-2">Total</th>
      </tr>
    </thead>
    <tbody>
      {% for item in items %}
        <tr>
          <td class="border px-4 py-2">{{ item.description }}</td>
          <td class="border px-4 py-2">{{ item.quantity }}</td>
          <td class="border px-4 py-2">{{ item.price }} {{ currency.code }}</td>
          <td class="border px-4 py-2">{{ item.quantity | times: item.price }} {{ currency.code }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
  
  <div class="text-right">
    <p class="text-xl font-bold">Total: {{ items | map: 'price' | sum }} {{ currency.code }}</p>
  </div>
</div>
`);
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
          toast.success("Template updated");
        } else {
          await createTemplate({
            ...template.value,
            html: templateCode(),
          });
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
            Save
          </HeaderButton>,
          // <HeaderButton onClick={() => setShowRender(!showRender())} buttonType="secondary">
          //   {showRender() ? "Edit" : "Preview"}
          // </HeaderButton>,
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
                      { id: "PROFORMA", label: "Proforma Invoice" },
                      { id: "RECEIVE", label: "Received Invoice" },
                    ]}
                    onSelect={(data) => field().handleChange(data.id as "INVOICE" | "PROFORMA" | "RECEIVE")}
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
