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
  const params = useParams<{ readonly id?: string }>();
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
          toast.success(t("pages.other.currencies.form.toast.updated"));
        } else {
          await createCurrency(currency.value);
          toast.success(t("pages.other.currencies.form.toast.saved"));
        }
        navigate("/dashboard/other/currencies");
      } catch (e) {
        toast.error(t("pages.other.currencies.form.toast.saveFailed"));
        console.error(e);
      }
    },
  }));

  onMount(async () => {
    if (params.id) {
      const currency = await getCurrency(params.id);
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
          params.id ? params.id : t("pageHeader.new"),
        ]}
        actionElements={[
          <HeaderButton onClick={() => form.handleSubmit()} buttonType="primary">
            {t("pages.other.currencies.form.save")}
          </HeaderButton>,
          <Show when={params.id}>
            <HeaderButton
              onClick={async () => {
                try {
                  await deleteCurrency(form.state.values.id);
                  toast.success(t("pages.other.currencies.form.toast.deleted"));
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
        <Section title={t("pages.other.currencies.form.sections.information")}>
          <form.Field name="name" validators={{ onChange: z.string().min(2).max(100), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                type="text"
                label={t("pages.other.currencies.form.name")}
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
                label={t("pages.other.currencies.form.code")}
                defaultValue={field().state.value}
                onChange={(data) => field().handleChange(data)}
                errors={field().state.meta.touchedErrors}
              />
            )}
          </form.Field>
          <form.Field name="rate" validators={{ onChange: z.number().min(0), onChangeAsyncDebounceMs: 500 }}>
            {(field) => (
              <Input
                float
                type="number"
                label={t("pages.other.currencies.form.rate")}
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
