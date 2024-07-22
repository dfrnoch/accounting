import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useNavigate } from "@solidjs/router";
import { Index, Show, createResource, onMount, type Component } from "solid-js";
import { createForm } from "@tanstack/solid-form";
import Input from "@/shared/components/Form/Input";
import Dropdown from "@/shared/components/Form/Dropdown";
import {
  type ManageDocumentData,
  createDocument,
  deleteDocument,
  getClients,
  getCurrencies,
  getDocument,
  getTemplates,
  updateDocument,
  DocumentType,
} from "@/bindings";
import Form from "@/shared/components/Form";
import Section from "@/shared/components/Form/Section";
import toast from "solid-toast";
import { FiDownload, FiTrash, FiX } from "solid-icons/fi";
import SearchDropdown from "@/shared/components/Form/SearchDropdown";
import Button from "@/shared/components/Button";
import { useSelector } from "@/store";
import { generateDocumentNumber } from "@/utils/handleDocumentNumber";
import { getInitializedPrintWindow } from "@/utils/savePDF";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

interface ManageDocumentProps {
  id?: string;
  type: DocumentType;
  url: string;
}

const ManageDocument: Component<ManageDocumentProps> = (props) => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const settingsService = useSelector((state) => state.settingsService);

  const [templates] = createResource(() => getTemplates({ skip: 0, take: 1000 }, props.type));
  const [clients] = createResource(() => getClients({ skip: 0, take: 1000 }));
  const [currencies] = createResource(() => getCurrencies({ skip: 0, take: 1000 }));

  const getDocumentPrefix = () => {
    switch (props.type) {
      case DocumentType.INVOICE:
        return settingsService.settings.invoicePrefix;
      case DocumentType.PROFORMA:
        return settingsService.settings.proformaPrefix;
      case DocumentType.RECEIVE:
        return settingsService.settings.receivePrefix;
      default:
        return "";
    }
  };

  const getDocumentCounter = () => {
    switch (props.type) {
      case DocumentType.INVOICE:
        return settingsService.settings.invoiceCounter + 1;
      case DocumentType.PROFORMA:
        return settingsService.settings.proformaCounter + 1;
      case DocumentType.RECEIVE:
        return settingsService.settings.receiveCounter + 1;
      default:
        return 1;
    }
  };

  const form = createForm(() => ({
    defaultValues: {
      id: 0,
      number: generateDocumentNumber(getDocumentPrefix(), getDocumentCounter()),
      clientId: undefined as number | undefined,
      templateId: settingsService.settings.defaultTemplate.id,
      documentType: props.type,
      currencyId: settingsService.settings.defaultCurrency.id,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "DRAFT",
      items: [],
    } as ManageDocumentData,
    validatorAdapter: zodValidator(),
    onSubmit: async (document) => {
      try {
        if (props.id) {
          await updateDocument({
            ...document.value,
            id: Number.parseInt(props.id),
          });
          toast.success(t("pages.sales.document.toast.updated"));
        } else {
          await createDocument(document.value);
          toast.success(t("pages.sales.document.toast.saved"));
          await settingsService.updateSettings();
        }
        navigate(props.url);
      } catch (e) {
        toast.error(t("pages.sales.document.toast.saveFailed"));
        console.error(e);
      }
    },
  }));

  onMount(async () => {
    if (props.id) {
      const document = await getDocument(Number.parseInt(props.id));
      form.update({
        ...form.options,
        defaultValues: {
          ...document,
          documentType: props.type,
          dueDate: new Date(document.dueDate),
          issueDate: new Date(document.issueDate),
        },
      });
    }
  });

  const handleDeleteDocument = async () => {
    if (!props.id) return;
    try {
      await deleteDocument(Number.parseInt(props.id));
      toast.success(t("pages.sales.document.toast.deleted"));
      navigate(props.url);
    } catch (e) {
      toast.error(e as string);
    }
  };

  const renderFormFields = () => (
    <>
      <Section title={t("pages.sales.document.information")}>
        <form.Field
          name="number"
          validators={{ onChange: z.string().min(1, t("pages.sales.document.numberRequired")) }}
        >
          {(field) => (
            <Input
              type="text"
              label={t("pages.sales.document.number")}
              defaultValue={field().state.value}
              onChange={(data) => field().handleChange(data)}
              errors={field().state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field
          name="clientId"
          validators={{ onChange: z.number().min(1, t("pages.sales.document.clientRequired")) }}
        >
          {(field) => (
            <Show when={clients()}>
              <SearchDropdown
                data={clients()?.map((client) => ({ id: client.id, label: client.name })) ?? []}
                label={t("pages.sales.document.client")}
                defaultValueId={field().state.value}
                onSelect={(data) => field().handleChange(data.id as number)}
                errors={field().state.meta.errors}
              />
            </Show>
          )}
        </form.Field>
        <form.Field
          name="templateId"
          validators={{ onChange: z.number().min(1, t("pages.sales.document.templateRequired")) }}
        >
          {(field) => (
            <Show when={templates()}>
              <SearchDropdown
                data={templates()?.map((template) => ({ id: template.id, label: template.name })) ?? []}
                defaultValueId={field().state.value}
                label={t("pages.sales.document.template")}
                onSelect={(data) => field().handleChange(data.id as number)}
              />
            </Show>
          )}
        </form.Field>
        <form.Field
          name="currencyId"
          validators={{ onChange: z.string().min(1, t("pages.sales.document.currencyRequired")) }}
        >
          {(field) => (
            <Show when={currencies()}>
              <SearchDropdown
                data={currencies()?.map((currency) => ({ id: currency.id, label: currency.name })) ?? []}
                defaultValueId={field().state.value}
                label={t("pages.sales.document.currency")}
                onSelect={(data) => field().handleChange(data.id as string)}
              />
            </Show>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <Dropdown
              defaultValueId={field().state.value}
              label={t("pages.sales.document.status.label")}
              data={[
                { id: "DRAFT", label: t("pages.sales.document.status.draft") },
                { id: "SENT", label: t("pages.sales.document.status.sent") },
                { id: "PAID", label: t("pages.sales.document.status.paid") },
                { id: "CANCELLED", label: t("pages.sales.document.status.cancelled") },
                { id: "OVERDUE", label: t("pages.sales.document.status.overdue") },
              ]}
              onSelect={(data) => field().handleChange(data.id as "DRAFT" | "SENT" | "PAID" | "CANCELLED" | "OVERDUE")}
            />
          )}
        </form.Field>
      </Section>
      <Section title={t("pages.sales.document.dates")}>
        <form.Field name="issueDate" validators={{ onChange: z.date() }}>
          {(field) => (
            <Input
              type="date"
              label={t("pages.sales.document.issueDate")}
              defaultValue={field().state.value.toISOString().split("T")[0]}
              onChange={(data) => field().handleChange(new Date(data))}
              errors={field().state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field
          name="dueDate"
          validators={{ onChange: z.date().min(new Date(), t("pages.sales.document.dueDateError")) }}
        >
          {(field) => (
            <Input
              type="date"
              label={t("pages.sales.document.dueDate")}
              defaultValue={field().state.value.toISOString().split("T")[0]}
              onChange={(data) => field().handleChange(new Date(data))}
              errors={field().state.meta.errors}
            />
          )}
        </form.Field>
      </Section>
      <Section title={t("pages.sales.document.items")} columns={1}>
        <form.Field name="items">
          {(field) => (
            <>
              <Index each={field().state.value}>
                {(_item, i) => (
                  <div class="flex gap-4 items-end">
                    <form.Field name={`items[${i}].description`} validators={{ onChange: z.string().min(1) }}>
                      {(subField) => (
                        <Input
                          type="text"
                          class="w-full"
                          label={t("pages.sales.document.itemDescription", { number: i + 1 })}
                          defaultValue={subField().state.value}
                          errors={subField().state.meta.errors}
                          onChange={(data) => subField().handleChange(data)}
                        />
                      )}
                    </form.Field>
                    <form.Field name={`items[${i}].quantity`} validators={{ onChange: z.number().min(1) }}>
                      {(subField) => (
                        <Input
                          type="number"
                          label={t("pages.sales.document.itemQuantity", { number: i + 1 })}
                          defaultValue={subField().state.value}
                          errors={subField().state.meta.errors}
                          onChange={(data) => subField().handleChange(Number(data))}
                        />
                      )}
                    </form.Field>
                    <form.Field name={`items[${i}].price`} validators={{ onChange: z.number().min(0) }}>
                      {(subField) => (
                        <Input
                          type="number"
                          label={t("pages.sales.document.itemPrice", { number: i + 1 })}
                          defaultValue={subField().state.value}
                          onChange={(data) => subField().handleChange(Number(data))}
                          errors={subField().state.meta.errors}
                        />
                      )}
                    </form.Field>
                    <FiX onClick={() => field().removeValue(i)} class="text-danger w-5 h-5 cursor-pointer mb-2" />
                  </div>
                )}
              </Index>
              <Button
                onClick={() => field().pushValue({ id: 0, description: "", quantity: 1, price: 0, documentId: 0 })}
              >
                {t("pages.sales.document.addItem")}
              </Button>
            </>
          )}
        </form.Field>
      </Section>
    </>
  );

  return (
    <Container>
      <PageHeader
        title={[
          t("sidebar.section.sales"),
          t(`pages.sales.document.title.${props.type.toLowerCase()}`),
          props.id ? props.id : t("pageHeader.new"),
        ]}
        actionElements={[
          <HeaderButton onClick={() => form.handleSubmit()} buttonType="primary">
            {t("other.save")}
          </HeaderButton>,
          <Show when={props.id}>
            <HeaderButton onClick={handleDeleteDocument} buttonType="secondary">
              <FiTrash />
            </HeaderButton>
          </Show>,
          <Show when={props.id}>
            <HeaderButton onClick={() => getInitializedPrintWindow(Number(props.id))} buttonType="secondary">
              <FiDownload />
            </HeaderButton>
          </Show>,
        ]}
      />
      <Form>{renderFormFields()}</Form>
    </Container>
  );
};

export default ManageDocument;
