import { type Component, createSignal, createResource, Show } from "solid-js";
import Toolbar from "./components/Toolbar";
import { FiFileText, FiFlag, FiSettings } from "solid-icons/fi";
import { locale, setLocale, useI18n } from "@/i18n";
import Input from "@/shared/components/Form/Input";
import PageHeader from "../../components/PageHeader";
import Form from "@/shared/components/Form";
import { createForm } from "@tanstack/solid-form";
import {
  type ManageSettingsData,
  getCurrencies,
  getTemplates,
  updateSettings,
  type ManageCompanyData,
  updateCompany,
} from "@/bindings";
import { useSelector } from "@/store";
import toast from "solid-toast";
import SearchDropdown from "@/shared/components/Form/SearchDropdown";
import Button from "@/shared/components/Button";
import Container from "../../components/Container";
import Section from "@/shared/components/Form/Section";
import LanguageBox from "@/screens/Setup/components/LanguageBox";
import { LANG } from "@/constants";

const Settings: Component = () => {
  const [t] = useI18n();
  const [currentSection, setCurrentSection] = createSignal(0);

  return (
    <Container>
      <PageHeader title={[t("sidebar.button.settings")]} />
      <div class="w-full h-20 gap-2 flex justify-center items-center border-b border-black/20">
        <Toolbar
          text={t("settings.general.title")}
          icon={<FiSettings />}
          active={currentSection() === 0}
          onClick={() => setCurrentSection(0)}
        />
        <Toolbar
          text={t("settings.document.title")}
          icon={<FiFileText />}
          active={currentSection() === 1}
          onClick={() => setCurrentSection(1)}
        />
        <Toolbar
          text={t("settings.language")}
          icon={<FiFlag />}
          active={currentSection() === 2}
          onClick={() => setCurrentSection(2)}
        />
      </div>
      <div class="w-full h-full">
        <Show when={currentSection() === 0}>
          <CompanyPage />
        </Show>
        <Show when={currentSection() === 1}>
          <DocumentPage />
        </Show>
        <Show when={currentSection() === 2}>
          <div class="flex gap-4 justify-center items-center mt-20">
            <LanguageBox onClick={() => setLocale(LANG.CS)} active={locale() === LANG.CS}>
              🇨🇿
            </LanguageBox>
            <LanguageBox onClick={() => setLocale(LANG.EN)} active={locale() === LANG.EN}>
              🇬🇧
            </LanguageBox>
          </div>
        </Show>
      </div>
    </Container>
  );
};

export default Settings;

const DocumentPage: Component = () => {
  const [templates] = createResource(async () => await getTemplates({ skip: 0, take: 1000 }));
  const [currencies] = createResource({ skip: 0, take: 1000 }, getCurrencies);
  const [t] = useI18n();

  const settingsService = useSelector((state) => state.settingsService);

  const form = createForm(() => ({
    defaultValues: {
      id: settingsService.settings.id,
      defaultCurrencyId: settingsService.settings.defaultCurrency.id,
      defaultTemplateId: settingsService.settings.defaultTemplate.id,

      invoicePrefix: settingsService.settings.invoicePrefix,
      receivePrefix: settingsService.settings.receivePrefix,
      proformaPrefix: settingsService.settings.proformaPrefix,

      invoiceCounter: settingsService.settings.invoiceCounter,
      receiveCounter: settingsService.settings.receiveCounter,
      proformaCounter: settingsService.settings.proformaCounter,
    } as ManageSettingsData,
    onSubmit: async (data) => {
      try {
        await updateSettings(data.value);
        await settingsService.updateSettings();
        toast.success("Settings saved");
      } catch (e) {
        console.error(e);
        toast.error("Failed to save settings");
      }
    },
  }));

  return (
    <Form>
      <Section title="Defaults">
        <form.Field name="defaultTemplateId">
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

        <form.Field name="defaultCurrencyId">
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
      </Section>
      <Section title="Prefixes & Counters">
        <form.Field name="invoicePrefix">
          {(field) => (
            <Input
              type="text"
              label="Invoice Prefix"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
        <form.Field name="invoiceCounter">
          {(field) => (
            <Input
              type="number"
              label="Invoice Counter"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
        <form.Field name="proformaPrefix">
          {(field) => (
            <Input
              type="text"
              label="Proforma Prefix"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
        <form.Field name="proformaCounter">
          {(field) => (
            <Input
              type="number"
              label="Proforma Counter"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
        <form.Field name="receivePrefix">
          {(field) => (
            <Input
              type="text"
              label="Receive Prefix"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
        <form.Field name="receiveCounter">
          {(field) => (
            <Input
              type="number"
              label="Receive Counter"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
      </Section>
      <Button onClick={() => form.handleSubmit()}>{t("settings.document.save")}</Button>
    </Form>
  );
};

const CompanyPage: Component = () => {
  const [t] = useI18n();

  const companyService = useSelector((state) => state.companyService);

  const form = createForm(() => ({
    defaultValues: {
      name: companyService.company.name,
      cin: companyService.company.cin,
      vatId: companyService.company.vatId,
      address: companyService.company.address,
      city: companyService.company.city,
      zip: companyService.company.zip,
      phone: companyService.company.phone,
      email: companyService.company.email,
      bankAccount: companyService.company.bankAccount,
      bankIBAN: companyService.company.bankIBAN,
    } as ManageCompanyData,
    onSubmit: async (data) => {
      try {
        await updateCompany(data.value);
        await companyService.updateCompany();
        toast.success("Company information saved");
      } catch (e) {
        console.error(e);
        toast.error("Failed to save company information");
      }
    },
  }));

  return (
    <Form>
      <Section title="Company Information">
        <form.Field name="name">
          {(field) => (
            <Input
              type="text"
              label="Company Name"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
        <form.Field name="cin">
          {(field) => (
            <Input
              type="text"
              label="Company Identification Number (CIN)"
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
        <form.Field name="address">
          {(field) => (
            <Input
              type="text"
              label="Address"
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
              label="ZIP Code"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
        <form.Field name="phone">
          {(field) => (
            <Input
              type="text"
              label="Phone"
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
      </Section>
      <Section title="Bank Information">
        <form.Field name="bankAccount">
          {(field) => (
            <Input
              type="text"
              label="Bank Account"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
        <form.Field name="bankIBAN">
          {(field) => (
            <Input
              type="text"
              label="Bank IBAN"
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
            />
          )}
        </form.Field>
      </Section>
      <Button onClick={() => form.handleSubmit()}>{t("settings.document.save")}</Button>
    </Form>
  );
};
