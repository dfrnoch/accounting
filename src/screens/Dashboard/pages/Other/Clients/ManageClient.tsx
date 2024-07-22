import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useNavigate, useParams } from "@solidjs/router";
import { Show, onMount, type Component } from "solid-js";
import { createForm } from "@tanstack/solid-form";
import Input from "@/shared/components/Form/Input";
import Dropdown from "@/shared/components/Form/Dropdown";
import { type Client, createClient, deleteClient, getClient, updateClient } from "@/bindings";
import Form from "@/shared/components/Form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import Section from "@/shared/components/Form/Section";
import toast from "solid-toast";
import { FiTrash } from "solid-icons/fi";

const ManageClient: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const [t] = useI18n();
  const navigate = useNavigate();
  const form = createForm(() => ({
    defaultValues: {
      id: 0,
      name: "",
      clientType: "BOTH",
      cin: "",
      vatId: undefined,
      address: "",
      city: "",
      zip: "",
      phone: undefined,
      email: undefined,
      bankAccount: undefined,
      bankIban: undefined,
    } as Client,
    validatorAdapter: zodValidator(),
    onSubmitInvalid: (e) => {
      console.log("invalid", e.formApi.state.errors);
    },
    onSubmit: async (client) => {
      console.log(client.value);
      try {
        if (client.value.id > 0) {
          await updateClient(client.value);
          toast.success(t("pages.other.clients.form.toast.updated"));
        } else {
          await createClient(client.value);
          toast.success(t("pages.other.clients.form.toast.saved"));
        }
        navigate("/dashboard/other/clients");
      } catch (e) {
        toast.error(t("pages.other.clients.form.toast.saveFailed"));
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
        title={[t("sidebar.section.sales"), t("sidebar.button.clients"), params.id ? params.id : t("pageHeader.new")]}
        actionElements={[
          <HeaderButton onClick={() => form.handleSubmit()} buttonType="primary">
            {t("pages.other.clients.form.save")}
          </HeaderButton>,
          <Show when={params.id}>
            <HeaderButton
              onClick={async () => {
                try {
                  await deleteClient(Number.parseInt(params.id as string));
                  toast.success(t("pages.other.clients.form.toast.deleted"));
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
      <Form>
        <Section title={t("pages.other.clients.form.sections.information")}>
          <form.Field name="name" validators={{ onChange: z.string().min(2).max(100), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.clients.form.name")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
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
                label={t("pages.other.clients.form.email")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
          <form.Field name="clientType">
            {(field) => (
              <Dropdown
                defaultValueId={field().state.value}
                label={t("pages.other.clients.form.clientType")}
                data={[
                  { id: "BOTH", label: t("pages.other.clients.form.clientTypes.both") },
                  { id: "SUPPLIER", label: t("pages.other.clients.form.clientTypes.supplier") },
                  { id: "CUSTOMER", label: t("pages.other.clients.form.clientTypes.customer") },
                ]}
                onSelect={(data) => field().handleChange(data.id as "BOTH" | "SUPPLIER" | "CUSTOMER")}
              />
            )}
          </form.Field>
          <form.Field name="cin" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.clients.form.cin")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
          <form.Field name="vatId" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.clients.form.vatId")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
        </Section>
        <Section title={t("pages.other.clients.form.sections.address")}>
          <form.Field name="address" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.clients.form.address")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
          <form.Field name="city" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.clients.form.city")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
          <form.Field name="zip" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.clients.form.zip")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
          <form.Field name="phone" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="tel"
                label={t("pages.other.clients.form.phone")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
        </Section>
        <Section title={t("pages.other.clients.form.sections.bank")}>
          <form.Field name="bankAccount" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.clients.form.bankAccount")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
          <form.Field name="bankIban" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.clients.form.bankIban")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.errors}
              />
            )}
          </form.Field>
        </Section>
      </Form>
    </Container>
  );
};

export default ManageClient;
