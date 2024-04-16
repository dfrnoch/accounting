import { type Currency, createCurrency, updateCurrency, deleteCurrency, getCurrency } from "@/bindings";
import { useI18n } from "@/i18n";
import { FiTrash } from "solid-icons/fi";
import type { Component } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import { createForm } from "@tanstack/solid-form";
import Input from "@/shared/components/Form/Input";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import Section from "@/shared/components/Form/Section";
import toast from "solid-toast";
import { Show, onMount } from "solid-js";
import Form from "@/shared/components/Form";

const ManageCurrency: Component = () => {
  const params = useParams<{ readonly code?: string }>();
  const [t] = useI18n();
  const navigate = useNavigate();
  const form = createForm(() => ({
    defaultValues: {
      id: "",
      name: "",
      code: "",
      rate: 1,
    } as Currency,
    validatorAdapter: zodValidator,
    onSubmitInvalid: (e) => {
      console.log("invalid", e.formApi.state.errors);
    },
    onSubmit: async (currency) => {
      console.log(currency.value);
      try {
        if (currency.value.id) {
          await updateCurrency(currency.value.id, currency.value);
          toast.success("Currency updated");
        } else {
          await createCurrency(currency.value);
          toast.success("Currency saved");
        }
        navigate("/dashboard/other/currencies");
      } catch (e) {
        toast.error("Failed to save currency");
        console.error(e);
      }
    },
  }));

  onMount(async () => {
    if (params.code) {
      const currency = await getCurrency(params.code);
      form.update({ ...form.options, defaultValues: currency });
      console.log(form.state.values);
    }
  });

  return (
    <Container>
      <PageHeader
        title={[
          t("sidebar.section.other"),
          t("sidebar.button.currencies"),
          params.code ? params.code : t("pageHeaader.new"),
        ]}
        actionElements={[
          <HeaderButton onClick={() => form.handleSubmit()} buttonType="primary">
            Save
          </HeaderButton>,
          <Show when={params.code}>
            <HeaderButton
              onClick={async () => {
                try {
                  await deleteCurrency(form.state.values.id);
                  toast.success("Currency deleted");
                  navigate("/dashboard/other/currencies");
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
        <Section title="Currency Information">
          <form.Field name="name" validators={{ onChange: z.string().min(2).max(100), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label="Name"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.touchedErrors}
              />
            )}
          </form.Field>
          <form.Field name="code" validators={{ onChange: z.string().min(2).max(10), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label="Code"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.touchedErrors}
              />
            )}
          </form.Field>
          <form.Field name="rate" validators={{ onChange: z.number().min(0), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="number"
                label="Rate (from EURO)"
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(Number(data))}
                errors={field().state.meta.touchedErrors}
              />
            )}
          </form.Field>
        </Section>
      </Form>
    </Container>
  );
};

export default ManageCurrency;
