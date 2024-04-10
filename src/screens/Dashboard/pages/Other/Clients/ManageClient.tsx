import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useNavigate, useParams } from "@solidjs/router";
import type { Component } from "solid-js";
import { createForm } from "@tanstack/solid-form";
import Input from "@/screens/Dashboard/components/Form/Input";
import Dropdown from "@/screens/Dashboard/components/Form/Dropdown";
import { createClient, type Client } from "@/bindings";
import Form from "@/screens/Dashboard/components/Form";
import Section from "@/screens/Dashboard/components/Form/Section";
import toast from "solid-toast";

const ManageClient: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const [t] = useI18n();
  const navigate = useNavigate();
  const form = createForm<Client>(() => ({
    defaultValues: {
      id: params.id ? Number.parseInt(params.id) : 0,
      name: "",
      clientType: "BOTH",
      email: "",
      cin: "",
      vatId: "",
      address: "",
      city: "",
      zip: "",
      phone: "",
    },
    onSubmit: async (client) => {
      try {
        await createClient(client.value);
        toast.success("Client saved");
        navigate("/dashboard/other/clients");
      } catch (e) {
        toast.error("Failed to save client");
        console.error(e);
      }
    },
  }));

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.clients"), params.id ? params.id : t("pageHeaader.new")]}
        actionElements={[
          <HeaderButton onClick={() => form.handleSubmit()} buttonType="primary">
            Save
          </HeaderButton>,
        ]}
      />
      <Form form={form}>
        <Section title="Client Information">
          <form.Field name="name">
            {(field) => (
              <Input
                type="text"
                label="Name"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <Input
                type="email"
                label="Email"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
              />
            )}
          </form.Field>
          <form.Field name="clientType">
            {(field) => (
              <Dropdown
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
