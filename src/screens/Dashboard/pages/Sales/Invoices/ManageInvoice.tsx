import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useNavigate, useParams } from "@solidjs/router";
import { For, Show, Suspense, createResource, onMount, type Component } from "solid-js";
import { createForm } from "@tanstack/solid-form";
import Input from "@/shared/components/Form/Input";
import Dropdown from "@/shared/components/Form/Dropdown";
import {
  createDocument,
  deleteDocument,
  getClients,
  getDocument,
  getTemplates,
  updateDocument,
  type Document,
} from "@/bindings";
import Form from "@/shared/components/Form";
import Section from "@/shared/components/Form/Section";
import toast from "solid-toast";
import { FiTrash } from "solid-icons/fi";
import SearchDropdown from "@/shared/components/Form/SearchDropdown";
import Button from "@/shared/components/Button";

const ManageInvoice: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const [t] = useI18n();
  const navigate = useNavigate();
  const [templates] = createResource({ skip: 0, take: 1000 }, getTemplates);
  const [clients] = createResource({ skip: 0, take: 1000 }, getClients);

  const form = createForm<Document>(() => ({
    defaultValues: {
      id: 0,
      number: "",
      clientId: 0,
      templateId: 0,
      currency: "",
      issueDate: new Date(),
      taxDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "DRAFT",
      items: [],
    },
    onSubmit: async (invoice) => {
      console.log(invoice.value);
      try {
        if (invoice.value.id > 0) {
          await updateDocument(invoice.value);
          toast.success("Invoice updated");
        } else {
          await createDocument(invoice.value);
          toast.success("Invoice saved");
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
      form.update({ ...form.options, defaultValues: invoice });
      console.log(form.state.values);
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
                  onSelect={(data) => field().handleChange(data.id as number)}
                />
              </Show>
            )}
          </form.Field>
          <form.Field name="templateId">
            {(field) => (
              <Input
                type="number"
                label="Template ID"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>

          <form.Field name="currency">
            {(field) => (
              <Input
                type="text"
                label="Currency"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
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
          <form.Field name="taxDate">
            {(field) => (
              <Input
                type="date"
                label="Tax Date"
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
        <Section title="Invoice Items" columns={1}>
          <form.Field name="items">
            {(field) => (
              <>
                <For each={field().state.value}>
                  {(item, i) => (
                    <Section columns={4}>
                      <form.Field name={`items[${i()}].description`}>
                        {(subField) => (
                          <Input
                            type="text"
                            label={`Description for item ${i() + 1}`}
                            defaultValue={subField().state.value}
                            onChange={(data) => subField().handleChange(data)}
                          />
                        )}
                      </form.Field>
                      <form.Field name={`items[${i()}].quantity`}>
                        {(subField) => (
                          <Input
                            type="number"
                            label={`Quantity for item ${i() + 1}`}
                            defaultValue={subField().state.value}
                            onChange={(data) => subField().handleChange(Number(data))}
                          />
                        )}
                      </form.Field>
                      <form.Field name={`items[${i()}].price`}>
                        {(subField) => (
                          <Input
                            type="number"
                            label={`Price for item ${i() + 1}`}
                            defaultValue={subField().state.value}
                            onChange={(data) => subField().handleChange(Number(data))}
                          />
                        )}
                      </form.Field>
                      <form.Field name={`items[${i()}].tax`}>
                        {(subField) => (
                          <Input
                            type="number"
                            label={`Tax for item ${i() + 1}`}
                            defaultValue={subField().state.value}
                            onChange={(data) => subField().handleChange(Number(data))}
                          />
                        )}
                      </form.Field>
                    </Section>
                  )}
                </For>

                <Button onClick={() => field().pushValue({ id: 0, description: "", quantity: 0, price: 0, tax: 0 })}>
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
