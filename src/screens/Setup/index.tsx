import { locale, setLocale, useI18n } from "@/i18n";
import { createSignal, type Component, Show, onMount } from "solid-js";
import ProgressDots from "./components/Progress";
import { type ManageCompanyData, createCompany, migrateAndPopulate } from "@/bindings";
import { LANG } from "@/constants";
import { open } from "@tauri-apps/plugin-shell";
import { useNavigate, useParams } from "@solidjs/router";
import { createForm } from "@tanstack/solid-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Form from "@/shared/components/Form";
import Input from "@/shared/components/Form/Input";
import LanguageBox from "./components/LanguageBox";
import Button from "@/shared/components/Button";
import { Title } from "./components/Title";
import { z } from "zod";
import toast from "solid-toast";
import Section from "@/shared/components/Form/Section";
import { useSelector } from "@/store";

const SetupWizard: Component = () => {
  const params = useParams<{ readonly step?: string }>();

  const [t] = useI18n();
  const [currentStep, setCurrentStep] = createSignal(Number(params.step) || 0);
  const navigate = useNavigate();
  const updateState = useSelector((state) => state.stateService.updateState);

  const form = createForm(() => ({
    defaultValues: {
      name: "",
      cin: "",
      vatId: undefined,
      email: undefined,
      phone: undefined,
      address: "",
      city: "",
      zip: "",
      bankAccount: undefined,
      bankIban: undefined,
      newPassword: undefined,
      passwordConfirmation: undefined,
    } as ManageCompanyData,
    validatorAdapter: zodValidator(),
    onSubmitInvalid: (e) => {
      console.log("invalid", e.formApi.state.errors);
    },
    onSubmit: async (userData) => {
      try {
        const result = await createCompany(userData.value);

        updateState({ companyId: result });
        toast.success(t("setup.company_created"));
        navigate("/");
      } catch (error) {
        console.error("Error creating company:", error);
        toast.error(t("setup.error_creating_ompany"));
      }
    },
  }));

  onMount(async () => {
    await migrateAndPopulate();
  });

  return (
    <div class="flex justify-center items-end w-screen h-screen px-3 pt-37px pb-3" data-tauri-drag-region>
      <div class="absolute top-0 left-0 w-full bg-transparent h-37px z-30 " data-tauri-drag-region>
        <Show when={!params.step}>
          <ProgressDots count={3} active={currentStep()} />
        </Show>
      </div>

      <div class="w-full h-full bg-primary rounded-xl drop-shadow-xl relative p-8 flex items-center justify-center">
        <Show when={currentStep() === 0}>
          <div class="flex flex-col items-center space-y-8 text-white">
            <img src="logo.png" alt="Welcome Icon" class="w-24 h-24" />
            <div class="flex flex-col items-center space-y-3">
              <Title>{t("setup.welcome")}</Title>
              <p class="text-lg text-center max-w-md text-secondary">{t("setup.welcome_message")}</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              class="mt-8 px-8 py-3 bg-default rounded-full transition-colors text-white"
            >
              {t("setup.get_started")}
            </button>
          </div>
        </Show>

        <Show when={currentStep() === 1}>
          <div class="flex justify-center items-center h-full flex-col gap-8">
            <Title>{t("setup.step1.select_language")}</Title>
            <div>
              <div class="flex gap-4">
                <LanguageBox onClick={() => setLocale(LANG.CS)} active={locale() === LANG.CS}>
                  🇨🇿
                </LanguageBox>
                <LanguageBox onClick={() => setLocale(LANG.EN)} active={locale() === LANG.EN}>
                  🇬🇧
                </LanguageBox>
              </div>
              <p
                class="text-primary text-center cursor-pointer text-lightgrey mt-2"
                onClick={() => open("https://github.com/dfrnoch/accounting")}
              >
                {t("setup.step1.improve")}
              </p>
            </div>
            <Button onClick={() => setCurrentStep(2)}>{t("setup.continue")}</Button>
          </div>
        </Show>

        <Show when={currentStep() === 2}>
          <Form class="overflow-auto h-full">
            <div class="gap-4 flex flex-row items-center">
              <Title>{t("setup.step2.create_company")}</Title>
              <Show when={params.step}>
                <Button type="danger" class="w-40" onClick={() => navigate("/login")}>
                  {t("setup.step2.backToLogin")}
                </Button>
              </Show>
            </div>
            <Section title={t("setup.step2.sections.details")}>
              <form.Field
                name="name"
                validators={{ onChange: z.string().min(2).max(100), onChangeAsyncDebounceMs: 500 }}
              >
                {(field) => (
                  <Input
                    type="text"
                    placeholder="Acme Inc"
                    label={t("setup.step2.company_name")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>
              <form.Field name="cin" validators={{ onChange: z.string().min(2), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="text"
                    placeholder="12345678"
                    label={t("setup.step2.CIN")}
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
                    placeholder="CZ12345678"
                    label={t("setup.step2.vatID")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>
            </Section>
            <Section title={t("setup.step2.sections.bank")}>
              <form.Field
                name="bankAccount"
                validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}
              >
                {(field) => (
                  <Input
                    type="text"
                    placeholder="123456789/1234"
                    label={t("setup.step2.account")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>
              <form.Field
                name="bankIban"
                validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}
              >
                {(field) => (
                  <Input
                    type="text"
                    label={t("setup.step2.iban")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>
            </Section>
            <Section title={t("setup.step2.sections.contact")}>
              <form.Field
                name="address"
                validators={{ onChange: z.string().min(2).max(100), onChangeAsyncDebounceMs: 500 }}
              >
                {(field) => (
                  <Input
                    type="text"
                    placeholder="123 Main St"
                    label={t("setup.step2.street")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>
              <form.Field name="city" validators={{ onChange: z.string(), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="text"
                    placeholder="Springfield"
                    label={t("setup.step2.city")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>
              <form.Field name="zip" validators={{ onChange: z.string(), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="text"
                    placeholder="12345"
                    label={t("setup.step2.zip")}
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
                    placeholder="john@acme.com"
                    label={t("setup.step2.email")}
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
                    placeholder="+420 123 456 789"
                    label={t("setup.step2.phone")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>
            </Section>
            <Section title={t("setup.step2.sections.password")}>
              <form.Field
                name="newPassword"
                validators={{ onChange: z.string().min(8).max(100).optional(), onChangeAsyncDebounceMs: 500 }}
              >
                {(field) => (
                  <Input
                    type="password"
                    label={t("setup.step2.password")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>

              <form.Field
                name="passwordConfirmation"
                validators={{
                  onChange: z
                    .string()
                    .min(8)
                    .max(100)
                    .optional()
                    .refine((data) => data === form.state.values.newPassword, {
                      message: t("setup.step2.passwordMatch"),
                    }),
                  onChangeAsyncDebounceMs: 500,
                }}
              >
                {(field) => (
                  <Input
                    type="password"
                    label={t("setup.step2.passwordConfirm")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.errors}
                  />
                )}
              </form.Field>
            </Section>
            <Button class="my-8" onClick={form.handleSubmit}>
              {t("setup.finalize")}
            </Button>
          </Form>
        </Show>
      </div>
    </div>
  );
};

export default SetupWizard;
