import { type Component, createSignal, createResource, Show } from "solid-js";
import Toolbar from "./components/Toolbar";
import { FiFileText, FiSettings } from "solid-icons/fi";
import { useI18n } from "@/i18n";
import Input from "@/shared/components/Form/Input";
import PageHeader from "../../components/PageHeader";
import Form from "@/shared/components/Form";
import { createForm } from "@tanstack/solid-form";
import { type ManageSettingsData, getCurrencies, getTemplates, updateSettings } from "@/bindings";
import { useSelector } from "@/store";
import toast from "solid-toast";
import SearchDropdown from "@/shared/components/Form/SearchDropdown";
import Button from "@/shared/components/Button";
import Container from "../../components/Container";
import Section from "@/shared/components/Form/Section";

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
          text={t("settings.invoice.title")}
          icon={<FiFileText />}
          active={currentSection() === 1}
          onClick={() => setCurrentSection(1)}
        />
        <Toolbar
          text="Nastavení"
          icon={<FiSettings />}
          active={currentSection() === 2}
          onClick={() => setCurrentSection(2)}
        />
      </div>
      <div class="w-full h-full">
        <Show when={currentSection() === 0}>
          <DocumentPage />
        </Show>
      </div>
    </Container>
  );
};

export default Settings;

const DocumentPage: Component = () => {
  const [templates] = createResource({ skip: 0, take: 1000 }, getTemplates);
  const [currencies] = createResource({ skip: 0, take: 1000 }, getCurrencies);

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
      <Button onClick={() => form.handleSubmit()}>Save</Button>
    </Form>
  );
};
