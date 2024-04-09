import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useParams } from "@solidjs/router";
import type { Component } from "solid-js";
import { createForm } from "@tanstack/solid-form";
import Input from "@/screens/Dashboard/components/Form/Input";
import Dropdown from "@/screens/Dashboard/components/Form/Dropdown";
import type { Client } from "@/bindings";
import Form from "@/screens/Dashboard/components/Form";

const ManageClient: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const [t] = useI18n();
  const form = createForm<Client>(() => ({
    defaultValues: {
      id: 0,
      name: "",
      cin: "",
      vatId: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      email: "",
      phoneNumber: "",
      companyId: 0,
    },
    onSubmit: (client) => alert(JSON.stringify(client)),
  }));

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.clients"), params.id ? params.id : t("pageHeaader.new")]}
        actionElements={[
          <HeaderButton onClick={() => {}} buttonType="primary">
            Save
          </HeaderButton>,
        ]}
      />
      <Form form={form}>
        <div class="flex flex-col gap-8">
          <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1">
              <div class="flex flex-col gap-4">
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
              </div>
            </div>
            <div class="flex-1">
              <div class="flex flex-col gap-4">
                <form.Field name="streetAddress">
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
                <form.Field name="postalCode">
                  {(field) => (
                    <Input
                      type="text"
                      label="Postal Code"
                      defaultValue={field().state.value}
                      onChange={(data) => field().handleChange(data)}
                    />
                  )}
                </form.Field>
              </div>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1">
              <div class="flex flex-col gap-4">
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
                <form.Field name="phoneNumber">
                  {(field) => (
                    <Input
                      type="tel"
                      label="Phone Number"
                      defaultValue={field().state.value}
                      onChange={(data) => field().handleChange(data)}
                    />
                  )}
                </form.Field>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex flex-col gap-4">
                <form.Field name="companyId">
                  {(field) => (
                    <Dropdown
                      data={[
                        { name: "Company 1", id: 1 },
                        { name: "Company 2", id: 2 },
                        { name: "Company 3", id: 3 },
                      ]}
                      onSelect={(data) => field().handleChange(data.id)}
                    />
                  )}
                </form.Field>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default ManageClient;
