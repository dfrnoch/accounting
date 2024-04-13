import { locale, setLocale, useI18n } from "@/i18n";
import { createSignal, type Component, Show, onMount } from "solid-js";
import ProgressDots from "./components/Progress";
import { createCompany, migrateAndPopulate } from "@/bindings";
import { LANG } from "@/constants";
import { open } from "@tauri-apps/plugin-shell";
import { useNavigate } from "@solidjs/router";
import { useSelector } from "@/store";
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

interface UserData {
  companyName: string;
  cin: string;
  vatID: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
}

const SetupWizard: Component = () => {
  const [t] = useI18n();
  const [currentStep, setCurrentStep] = createSignal(0);
  const stateService = useSelector((state) => state.stateService);
  const navigate = useNavigate();

  const form = createForm(() => ({
    defaultValues: {
      companyName: "",
      cin: "",
      vatID: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      zip: "",
    } as UserData,
    validatorAdapter: zodValidator,
    onSubmitInvalid: (e) => {
      console.log("invalid", e.formApi.state.errors);
    },
    onSubmit: async (userData) => {
      try {
        const result = await createCompany({
          cin: userData.value.cin,
          name: userData.value.companyName,
          vatId: userData.value.vatID,
          email: userData.value.email,
          phoneNumber: userData.value.phone,
          city: userData.value.city,
          postalCode: userData.value.zip,
          streetAddress: userData.value.street,
        });

        stateService.updateState({ companyId: result.id });
        toast.success(t("setup.company_created"));
        navigate("/");
      } catch (error) {
        console.error("Error creating company:", error);
        toast.error(t("setup.error_creating_ompany"));
      }
    },
  }));

  onMount(() => {
    migrateAndPopulate();
  });

  return (
    <div class="flex justify-center items-end w-screen h-screen px-3 pt-37px pb-3" data-tauri-drag-region>
      <div class="absolute top-0 left-0 w-full bg-transparent h-37px z-30 " data-tauri-drag-region>
        <ProgressDots count={3} active={currentStep()} />
      </div>

      <div class="w-full h-full bg-primary rounded-xl drop-shadow-xl relative overflow-scroll mx-auto p-8 px-15% lg:px-23%">
        <Show when={currentStep() === 0}>
          <div class="flex justify-center items-center h-full flex-col gap-8">
            <Title>{t("setup.welcome")}</Title>
            <Button onClick={() => setCurrentStep(1)}>{t("setup.get_started")}</Button>
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
          <Form>
            <Title>{t("setup.step2.create_company")}</Title>
            <Section title="Ahoj">
              <form.Field
                name="companyName"
                validators={{ onChange: z.string().min(2).max(100), onChangeAsyncDebounceMs: 500 }}
              >
                {(field) => (
                  <Input
                    type="text"
                    placeholder="Company Name"
                    label={t("setup.step2.company_name")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.touchedErrors}
                  />
                )}
              </form.Field>
              <form.Field name="cin" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="text"
                    label={t("setup.step2.CIN")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.touchedErrors}
                  />
                )}
              </form.Field>
              <form.Field name="vatID" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="text"
                    label={t("setup.step2.vatID")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.touchedErrors}
                  />
                )}
              </form.Field>
            </Section>
            <Section title="Contact">
              <form.Field name="street" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="text"
                    label={t("setup.step2.street")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.touchedErrors}
                  />
                )}
              </form.Field>
              <form.Field name="city" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="text"
                    label={t("setup.step2.city")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.touchedErrors}
                  />
                )}
              </form.Field>
              <form.Field name="zip" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="text"
                    label={t("setup.step2.zip")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.touchedErrors}
                  />
                )}
              </form.Field>
            </Section>
            <Section title="Contact">
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
                    label={t("setup.step2.email")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.touchedErrors}
                  />
                )}
              </form.Field>
              <form.Field name="phone" validators={{ onChange: z.string().optional(), onChangeAsyncDebounceMs: 500 }}>
                {(field) => (
                  <Input
                    type="tel"
                    label={t("setup.step2.phone")}
                    defaultValue={field().state.value}
                    onChange={(data) => field().handleChange(data)}
                    errors={field().state.meta.touchedErrors}
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
