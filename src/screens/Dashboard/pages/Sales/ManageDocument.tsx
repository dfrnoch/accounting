import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useNavigate } from "@solidjs/router";
import { Index, Show, createResource, onMount, type Component } from "solid-js";
import { createForm } from "@tanstack/solid-form";
import Input from "@/shared/components/Form/Input";
import Dropdown from "@/shared/components/Form/Dropdown";
import {
  type ManageDocumentData,
  createDocument,
  deleteDocument,
  getClients,
  getCurrencies,
  getDocument,
  getTemplates,
  updateDocument,
  DocumentType,
} from "@/bindings";
import Form from "@/shared/components/Form";
import Section from "@/shared/components/Form/Section";
import toast from "solid-toast";
import { FiDownload, FiTrash, FiX } from "solid-icons/fi";
import SearchDropdown from "@/shared/components/Form/SearchDropdown";
import Button from "@/shared/components/Button";
import { useSelector } from "@/store";
import { generateDocumentNumber } from "@/utils/handleDocumentNumber";
import { getInitializedPrintWindow } from "@/utils/savePDF";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

interface ManageDocumentProps {
  id?: string;
  type: DocumentType;
  url: string;
}

const ManageDocument: Component<ManageDocumentProps> = (props) => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const settingsService = useSelector((state) => state.settingsService);

  const [templates] = createResource(async () => await getTemplates({ skip: 0, take: 1000 }, props.type));
  const [clients] = createResource({ skip: 0, take: 1000 }, getClients);
  const [currencies] = createResource({ skip: 0, take: 1000 }, getCurrencies);

  const form = createForm(() => ({
    defaultValues: {
      id: 0,
      number: generateDocumentNumber(
        props.type === DocumentType.INVOICE
          ? settingsService.settings.invoicePrefix
          : props.type === DocumentType.PROFORMA
            ? settingsService.settings.proformaPrefix
            : settingsService.settings.receivePrefix,
        props.type === DocumentType.INVOICE
          ? settingsService.settings.invoiceCounter + 1
          : props.type === DocumentType.RECEIVE
            ? settingsService.settings.proformaCounter + 1
            : settingsService.settings.receiveCounter + 1,
      ),
      clientId: undefined as number | undefined,
      templateId: settingsService.settings.defaultTemplate.id,
      documentType: props.type,
      currencyId: settingsService.settings.defaultCurrency.id,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "DRAFT",
      items: [],
    } as ManageDocumentData,
    validatorAdapter: zodValidator,
    onSubmit: async (document) => {
      console.log(document.value);
      try {
        if (props.id) {
          await updateDocument({
            ...document.value,
            id: Number.parseInt(props.id),
          });
          toast.success(`${props.type} updated`);
        } else {
          await createDocument(document.value);
          toast.success(`${props.type} saved`);
          await settingsService.updateSettings();
        }
        navigate(props.url);
      } catch (e) {
        toast.error(`Failed to save ${props.type}`);
        console.error(e);
      }
    },
  }));

  onMount(async () => {
    if (props.id) {
      const document = await getDocument(Number.parseInt(props.id));
      console.log(document);
      form.update({
        ...form.options,
        defaultValues: {
          ...document,
          documentType: props.type,
          dueDate: new Date(document.dueDate),
          issueDate: new Date(document.issueDate),
        },
      });
    }
  });

  return (
    <Container>
      <PageHeader
        title={[
          t("sidebar.section.sales"),
          props.type === DocumentType.INVOICE
            ? t("sidebar.button.invoices")
            : props.type === DocumentType.PROFORMA
              ? t("sidebar.button.proformas")
              : t("sidebar.button.receivedInvoices"),
          props.id ? props.id : t("pageHeader.new"),
        ]}
        actionElements={[
          <HeaderButton onClick={() => form.handleSubmit()} buttonType="primary">
            Save
          </HeaderButton>,
          <Show when={props.id}>
            <HeaderButton
              onClick={async () => {
                try {
                  await deleteDocument(Number.parseInt(props.id as string));
                  toast.success(`${props.type} deleted`);
                  navigate(props.url);
                } catch (e) {
                  toast.error(e as string);
                }
              }}
              buttonType="secondary"
            >
              <FiTrash />
            </HeaderButton>
          </Show>,
          <Show when={props.id}>
            <HeaderButton
              onClick={async () => {
                getInitializedPrintWindow(props.id as unknown as number);
              }}
              buttonType="secondary"
            >
              <FiDownload />
            </HeaderButton>
          </Show>,
        ]}
      />
      <Form>
        <Section title={`${props.type} Information`}>
          <form.Field name="number" validators={{ onChange: z.string().min(1, "Number is required") }}>
            {(field) => (
              <Input
                type="text"
                label="Number"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.touchedErrors}
              />
            )}
          </form.Field>
          <form.Field name="clientId" validators={{ onChange: z.number().min(1, "Client is required") }}>
            {(field) => (
              <Show when={clients()}>
                <SearchDropdown
                  data={clients()?.map((client) => ({ id: client.id, label: client.name })) ?? []}
                  label="Client"
                  defaultValueId={field().state.value}
                  onSelect={(data) => field().handleChange(data.id as number)}
                  errors={field().state.meta.touchedErrors}
                />
              </Show>
            )}
          </form.Field>
          <form.Field name="templateId" validators={{ onChange: z.number().min(1, "Template is required") }}>
            {(field) => (
              <Show when={templates()}>
                <SearchDropdown
                  data={templates()?.map((template) => ({ id: template.id, label: template.name })) ?? []}
                  defaultValueId={field().state.value}
                  label="Template"
                  onSelect={(data) => field().handleChange(data.id as number)}
                />
              </Show>
            )}
          </form.Field>

          <form.Field name="currencyId" validators={{ onChange: z.string().min(1, "Currency is required") }}>
            {(field) => (
              <Show when={currencies()}>
                <SearchDropdown
                  data={currencies()?.map((currency) => ({ id: currency.id, label: currency.name })) ?? []}
                  defaultValueId={field().state.value}
                  label="Currency"
                  onSelect={(data) => field().handleChange(data.id as string)}
                />
              </Show>
            )}
          </form.Field>

          <form.Field name="status">
            {(field) => (
              <Dropdown
                defaultValueId={field().state.value}
                label="Status"
                data={[
                  { id: "DRAFT", label: "Draft" },
                  { id: "SENT", label: "Sent" },
                  { id: "PAID", label: "Paid" },
                  { id: "CANCELLED", label: "Cancelled" },
                  { id: "OVERDUE", label: "Overdue" },
                ]}
                onSelect={(data) =>
                  field().handleChange(data.id as "DRAFT" | "SENT" | "PAID" | "CANCELLED" | "OVERDUE")
                }
              />
            )}
          </form.Field>
        </Section>
        <Section title="Dates">
          <form.Field name="issueDate" validators={{ onChange: z.date() }}>
            {(field) => (
              <Input
                type="date"
                label="Issue Date"
                defaultValue={field().state.value.toISOString().split("T")[0]}
                onChange={(data) => field().handleChange(new Date(data))}
                errors={field().state.meta.touchedErrors}
              />
            )}
          </form.Field>
          <form.Field
            name="dueDate"
            validators={{ onChange: z.date().min(new Date(), "Due date must be today or later") }}
          >
            {(field) => (
              <Input
                type="date"
                label="Due Date"
                defaultValue={field().state.value.toISOString().split("T")[0]}
                onChange={(data) => field().handleChange(new Date(data))}
                errors={field().state.meta.touchedErrors}
              />
            )}
          </form.Field>
        </Section>
        <Section title={`${props.type} Items`} columns={1}>
          <form.Field name="items">
            {(field) => (
              <>
                <Index each={field().state.value}>
                  {(_item, i) => (
                    <div class="flex gap-4 items-end">
                      <form.Field name={`items[${i}].description`} validators={{ onChange: z.string().min(1) }}>
                        {(subField) => (
                          <Input
                            type="text"
                            class="w-full"
                            label={`Description for item ${i + 1}`}
                            defaultValue={subField().state.value}
                            errors={subField().state.meta.touchedErrors}
                            onChange={(data) => subField().handleChange(data)}
                          />
                        )}
                      </form.Field>
                      <form.Field name={`items[${i}].quantity`} validators={{ onChange: z.number().min(1) }}>
                        {(subField) => (
                          <Input
                            type="number"
                            label={`Quantity for item ${i + 1}`}
                            defaultValue={subField().state.value}
                            errors={subField().state.meta.touchedErrors}
                            onChange={(data) => subField().handleChange(Number(data))}
                          />
                        )}
                      </form.Field>
                      <form.Field name={`items[${i}].price`} validators={{ onChange: z.number().min(0) }}>
                        {(subField) => (
                          <Input
                            type="number"
                            label={`Price for item ${i + 1}`}
                            defaultValue={subField().state.value}
                            onChange={(data) => subField().handleChange(Number(data))}
                            errors={subField().state.meta.touchedErrors}
                          />
                        )}
                      </form.Field>

                      <FiX onClick={() => field().removeValue(i)} class="text-danger w-5 h-5 cursor-pointer mb-2" />
                    </div>
                  )}
                </Index>

                <Button
                  onClick={() => field().pushValue({ id: 0, description: "", quantity: 1, price: 0, documentId: 0 })}
                >
                  Add item
                </Button>
              </>
            )}
          </form.Field>
        </Section>
      </Form>
    </Container>
  );
};

export default ManageDocument;
