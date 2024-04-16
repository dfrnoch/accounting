import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useNavigate, useParams } from "@solidjs/router";
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
} from "@/bindings";
import Form from "@/shared/components/Form";
import Section from "@/shared/components/Form/Section";
import toast from "solid-toast";
import { FiDownload, FiTrash } from "solid-icons/fi";
import SearchDropdown from "@/shared/components/Form/SearchDropdown";
import Button from "@/shared/components/Button";
import { useSelector } from "@/store";
import { generateDocumentNumber } from "@/utils/handleDocumentNumber";
import { getInitializedPrintWindow } from "@/utils/savePDF";

const ManageInvoice: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const [t] = useI18n();
  const navigate = useNavigate();
  const settingsService = useSelector((state) => state.settingsService);

  const [templates] = createResource({ skip: 0, take: 1000 }, getTemplates);
  const [clients] = createResource({ skip: 0, take: 1000 }, getClients);
  const [currencies] = createResource({ skip: 0, take: 1000 }, getCurrencies);

  const form = createForm<ManageDocumentData>(() => ({
    defaultValues: {
      id: 0,
      number: generateDocumentNumber(
        settingsService.settings.invoicePrefix,
        settingsService.settings.invoiceCounter + 1,
      ),
      clientId: 0,
      templateId: settingsService.settings.defaultTemplate.id,
      documentType: "INVOICE",
      currencyId: settingsService.settings.defaultCurrency.id,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "DRAFT",
      items: [],
    },
    onSubmit: async (invoice) => {
      console.log(invoice.value);
      try {
        if (params.id) {
          await updateDocument({
            ...invoice.value,
            id: Number.parseInt(params.id),
          });
          toast.success("Invoice updated");
        } else {
          await createDocument(invoice.value);
          toast.success("Invoice saved");
          await settingsService.updateSettings();
        }
        navigate("/dashboard/sales/invoices");
      } catch (e) {
        toast.error("Failed to save invoice");
        console.error(e);
      }
    },
  }));

  onMount(async () => {
    if (params.id) {
      const invoice = await getDocument(Number.parseInt(params.id));
      console.log(invoice);
      form.update({
        ...form.options,
        defaultValues: {
          ...invoice,
          dueDate: new Date(invoice.dueDate),
          issueDate: new Date(invoice.issueDate),
        },
      });
    }
  });

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.invoices"), params.id ? params.id : t("pageHeaader.new")]}
        actionElements={[
          <HeaderButton onClick={() => form.handleSubmit()} buttonType="primary">
            Save
          </HeaderButton>,
          <Show when={params.id}>
            <HeaderButton
              onClick={async () => {
                try {
                  await deleteDocument(Number.parseInt(params.id as string));
                  toast.success("Invoice deleted");
                  navigate("/dashboard/sales/invoices");
                } catch (e) {
                  toast.error(e as string);
                }
              }}
              buttonType="secondary"
            >
              <FiTrash />
            </HeaderButton>
          </Show>,
          <Show when={params.id}>
            <HeaderButton
              onClick={async () => {
                getInitializedPrintWindow(params.id as unknown as number);
              }}
              buttonType="secondary"
            >
              <FiDownload />
            </HeaderButton>
          </Show>,
        ]}
      />
      <Form>
        <Section title="Invoice Information">
          <form.Field name="number">
            {(field) => (
              <Input
                type="text"
                label="Number"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
          <form.Field name="clientId">
            {(field) => (
              <Show when={clients()}>
                <SearchDropdown
                  data={clients()?.map((client) => ({ id: client.id, label: client.name })) ?? []}
                  label="Client"
                  defaultValueId={field().state.value}
                  onSelect={(data) => field().handleChange(data.id as number)}
                />
              </Show>
            )}
          </form.Field>
          <form.Field name="templateId">
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

          <form.Field name="currencyId">
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
          <form.Field name="issueDate">
            {(field) => (
              <Input
                type="date"
                label="Issue Date"
                defaultValue={field().state.value.toISOString().split("T")[0]}
                onChange={(data) => field().handleChange(new Date(data))}
              />
            )}
          </form.Field>
          <form.Field name="dueDate">
            {(field) => (
              <Input
                type="date"
                label="Due Date"
                defaultValue={field().state.value.toISOString().split("T")[0]}
                onChange={(data) => field().handleChange(new Date(data))}
              />
            )}
          </form.Field>
        </Section>
        <Section title="Invoice Items" columns={1}>
          <form.Field name="items">
            {(field) => (
              <>
                <Index each={field().state.value}>
                  {(_item, i) => (
                    <Section columns={3}>
                      <form.Field name={`items[${i}].description`}>
                        {(subField) => (
                          <Input
                            type="text"
                            label={`Description for item ${i + 1}`}
                            defaultValue={subField().state.value}
                            onChange={(data) => subField().handleChange(data)}
                          />
                        )}
                      </form.Field>
                      <form.Field name={`items[${i}].quantity`}>
                        {(subField) => (
                          <Input
                            type="number"
                            label={`Quantity for item ${i + 1}`}
                            defaultValue={subField().state.value}
                            onChange={(data) => subField().handleChange(Number(data))}
                          />
                        )}
                      </form.Field>
                      <form.Field name={`items[${i}].price`}>
                        {(subField) => (
                          <Input
                            type="number"
                            label={`Price for item ${i + 1}`}
                            defaultValue={subField().state.value}
                            onChange={(data) => subField().handleChange(Number(data))}
                          />
                        )}
                      </form.Field>
                    </Section>
                  )}
                </Index>

                <Button
                  onClick={() => field().pushValue({ id: 0, description: "", quantity: 0, price: 0, documentId: 0 })}
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

export default ManageInvoice;
