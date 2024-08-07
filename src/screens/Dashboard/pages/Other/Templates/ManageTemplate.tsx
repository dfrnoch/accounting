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
import toast from "solid-toast";
import { FiEye, FiList, FiSettings, FiTrash } from "solid-icons/fi";
import TemplateHint from "@/screens/Dashboard/components/TemplateHint";
import { createForm } from "@tanstack/solid-form";
import Form from "@/shared/components/Form";
import Section from "@/shared/components/Form/Section";
import Input from "@/shared/components/Form/Input";
import PdfRenderer from "@/shared/components/PdfRenderer";
import Dropdown from "@/shared/components/Form/Dropdown";

const ManageTemplate: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const navigate = useNavigate();
  const [t] = useI18n();
  const [showSettings, setShowSettings] = createSignal(false);
  const [showHints, setShowHints] = createSignal(false);
  const [showPreview, setShowPreview] = createSignal(false);

  const mockData = {
    number: "INV-123",
    issueDate: "2023-01-01T00:00:00.000Z",
    dueDate: "2023-01-15T00:00:00.000Z",
    client: {
      name: "John Doe",
      cin: "123456789",
      vatId: "US12345678",
      address: "123 Main St",
      city: "Metropolis",
      zip: "12345",
      email: "john.doe@example.com",
      phone: "+1234567890",
      bankAccount: "123456789012345",
      IBAN: "US123456789012345",
    },
    company: {
      name: "Example Corp",
      cin: "987654321",
      vatId: "US98765432",
      address: "456 Elsewhere St",
      city: "Gotham",
      zip: "54321",
      email: "info@example.com",
      phone: "+0987654321",
      bankAccount: "543210987654321",
      IBAN: "US543210987654321",
    },
    items: [
      { description: "Product 1", quantity: 2, price: 19.99 },
      { description: "Service 1", quantity: 5, price: 49.99 },
    ],
    currency: { code: "USD" },
    template: {
      html: `
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
  `,
    },
  };

  const [templateCode, setTemplateCode] = createSignal(mockData.template.html);

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
          <HeaderButton buttonType="secondary" onClick={() => setShowPreview(!showPreview())}>
            <FiEye />
          </HeaderButton>,
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
          </Form>
        </SidePopup>
      </div>
      <Show when={showPreview()}>
        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center ">
          <div class="bg-white rounded max-w-4xl p-4 shadow-xl w-full max-h-full overflow-auto">
            <PdfRenderer data={mockData} />
          </div>
        </div>
      </Show>
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
