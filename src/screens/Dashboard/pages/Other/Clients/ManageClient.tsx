import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useNavigate, useParams } from "@solidjs/router";
import { For, Show, onMount, type Component } from "solid-js";
import { createForm } from "@tanstack/solid-form";
import Input from "@/screens/Dashboard/components/Form/Input";
import Dropdown from "@/screens/Dashboard/components/Form/Dropdown";
import { type Client, createClient, deleteClient, getClient, updateClient } from "@/bindings";
import Form from "@/screens/Dashboard/components/Form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import Section from "@/screens/Dashboard/components/Form/Section";
import toast from "solid-toast";
import { FiTrash } from "solid-icons/fi";

const schema = z.object({
  id: z.number(),
  name: z.string().min(20),
  clientType: z.enum(["BOTH", "SUPPLIER", "CUSTOMER"]),
  email: z.string().optional(),
  cin: z.string(),
  vatId: z.string(),
  address: z.string(),
  city: z.string(),
  zip: z.string(),
  phone: z.string(),
});

const ManageClient: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const [t] = useI18n();
  const navigate = useNavigate();
  const form = createForm(() => ({
    defaultValues: {
      id: 0,
      name: "",
      clientType: "BOTH",
      email: "",
      cin: "",
      vatId: "",
      address: "",
      city: "",
      zip: "",
      phone: "",
    } as Client,
    validatorAdapter: zodValidator,
    validators: {
      onSubmit: schema,
    },
    onSubmitInvalid: (e) => {
      console.log("invalid", e.formApi.state.errors);
    },
    onSubmit: async (client) => {
      console.log(client.value);
      try {
        if (client.value.id > 0) {
          await updateClient(client.value);
          toast.success("Client updated");
        } else {
          await createClient(client.value);
          toast.success("Client saved");
        }
        navigate("/dashboard/other/clients");
      } catch (e) {
        toast.error("Failed to save client");
        console.error(e);
      }
    },
  }));

  onMount(async () => {
    if (params.id) {
      const client = await getClient(Number.parseInt(params.id));
      form.update({ ...form.options, defaultValues: client });
      console.log(form.state.values);
    }
  });

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.clients"), params.id ? params.id : t("pageHeaader.new")]}
        actionElements={[
          <HeaderButton onClick={() => form.handleSubmit()} buttonType="primary">
            Save
          </HeaderButton>,
          <Show when={params.id}>
            <HeaderButton
              onClick={async () => {
                try {
                  await deleteClient(Number.parseInt(params.id as string));
                  toast.success("Client deleted");
                  navigate("/dashboard/other/clients");
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
      <Form form={form}>
        <Section title="Client Information">
          <form.Field name="name" validators={{ onChange: z.string().min(20), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <>
                <Input
                  type="text"
                  label="Name"
                  defaultValue={field().state.value}
                  onChange={(data) => field().handleChange(data)}
                  errors={field().state.meta.touchedErrors}
                />
              </>
            )}
          </form.Field>
          <form.Field
            name="email"
            validators={{
              onChange: z.string().email().optional(),
              onChangeAsyncDebounceMs: 500,
            }}
          >
            {(field) => (
              <Input
                type="email"
                label="Email"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.touchedErrors}
              />
            )}
          </form.Field>
          <form.Field name="clientType">
            {(field) => (
              <Dropdown
                defaultValueId={field().state.value}
                label="Client Type"
                data={[
                  { id: "BOTH", label: "Both" },
                  { id: "SUPPLIER", label: "Supplier" },
                  { id: "CUSTOMER", label: "Customer" },
                ]}
                onSelect={(data) => field().handleChange(data.id as "BOTH" | "SUPPLIER" | "CUSTOMER")}
              />
            )}
          </form.Field>
          <form.Field name="cin">
            {(field) => (
              <Input
                type="text"
                label="CIN"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
          <form.Field name="vatId">
            {(field) => (
              <Input
                type="text"
                label="VAT ID"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
        </Section>
        <Section title="Adress">
          <form.Field name="address">
            {(field) => (
              <Input
                type="text"
                label="Street Address"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
          <form.Field name="city">
            {(field) => (
              <Input
                type="text"
                label="City"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
          <form.Field name="zip">
            {(field) => (
              <Input
                type="text"
                label="Postal Code"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
          <form.Field name="phone">
            {(field) => (
              <Input
                type="tel"
                label="Phone Number"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
        </Section>
      </Form>
    </Container>
  );
};

export default ManageClient;
