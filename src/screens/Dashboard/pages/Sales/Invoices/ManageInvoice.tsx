import TemplateRenderer from "@/shared/components/PdfRenderer";
import { Hr } from "@/shared/components/Menu/Hr";
import { Index, Show, onMount, type Component } from "solid-js";
import { createForm } from "@tanstack/solid-form";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import { useI18n } from "@/i18n";
import { useParams } from "@solidjs/router";
import Form from "@/screens/Dashboard/components/Form";
import type { Invoice } from "@/bindings";
import Container from "@/screens/Dashboard/components/Container";
import Input from "@/screens/Dashboard/components/Form/Input";
import Dropdown from "@/screens/Dashboard/components/Form/Dropdown";

const ManageInvoice: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const [t] = useI18n();
  const form = createForm<Invoice>(() => ({
    defaultValues: {
      id: 0,
      number: "",
      clientId: 0,
      templateId: "",
      currency: "",
      issueDate: new Date(),
      taxDate: new Date(),
      dueDate: new Date(),
      status: "DRAFT",
      items: [],
      companyId: 0,
    },
    onSubmit: (invoice) => alert(JSON.stringify(invoice)),
  }));
  onMount(async () => {});

  const template = `
  {% assign people = "alice, bob, carol" | split: ", " -%}

  <ul>
  {%- for person in people %}
    <li>
      <a href="{{person | prepend: "http://example.com/"}}">
        {{ person | capitalize }}
      </a>
    </li>
  {%- endfor%}
  </ul>
  
`;

  return (
    <Container>
      <PageHeader title={[t("sidebar.section.sales"), t("sidebar.button.invoices"), t("pageHeaader.new")]} />
      <div class="flex flex-col lg:flex-row w-full gap-5 ">
        <div class="w-full lg:w-1/2 flex flex-col">
          <div class="h-20 bg-green-300">cuspus</div>
          <Form form={form}>
            <form.Field name="number">
              {(field) => (
                <Input
                  type="text"
                  label="Number"
                  defaultValue={field().state.value}
                  onChange={(data) => field().handleChange(data)}
                />
              )}
            </form.Field>
            <form.Field name="clientId">
              {(field) => (
                <Dropdown
                  data={[
                    { name: "Alice", id: 1 },
                    { name: "Bob", id: 2 },
                    { name: "Carol", id: 3 },
                  ]}
                  onSelect={(data) => field().handleChange(data.id)}
                />
              )}
            </form.Field>
            <form.Field name="templateId">
              {(field) => (
                <div>
                  <label>
                    <div>Template ID</div>
                    <input
                      value={field().state.value}
                      onInput={(e) => {
                        field().handleChange(e.currentTarget.value);
                      }}
                    />
                  </label>
                </div>
              )}
            </form.Field>
            <form.Field name="currency">
              {(field) => (
                <div>
                  <label>
                    <div>Currency</div>
                    <input
                      value={field().state.value}
                      onInput={(e) => {
                        field().handleChange(e.currentTarget.value);
                      }}
                    />
                  </label>
                </div>
              )}
            </form.Field>
            <form.Field name="issueDate">
              {(field) => (
                <div>
                  <label>
                    <div>Issue Date</div>
                    <input
                      type="date"
                      value={field().state.value.toISOString().split("T")[0]}
                      onInput={(e) => {
                        field().handleChange(new Date(e.currentTarget.value));
                      }}
                    />
                  </label>
                </div>
              )}
            </form.Field>
            <form.Field name="taxDate">
              {(field) => (
                <div>
                  <label>
                    <div>Tax Date</div>
                    <input
                      type="date"
                      value={field().state.value.toISOString().split("T")[0]}
                      onInput={(e) => {
                        field().handleChange(new Date(e.currentTarget.value));
                      }}
                    />
                  </label>
                </div>
              )}
            </form.Field>
            <form.Field name="dueDate">
              {(field) => (
                <div>
                  <label>
                    <div>Due Date</div>
                    <input
                      type="date"
                      value={field().state.value.toISOString().split("T")[0]}
                      onInput={(e) => {
                        field().handleChange(new Date(e.currentTarget.value));
                      }}
                    />
                  </label>
                </div>
              )}
            </form.Field>
            <form.Field name="status">
              {(field) => (
                <div>
                  <label>
                    <div>Status</div>
                    <select
                      value={field().state.value}
                      onInput={(e) => {
                        field().handleChange(e.currentTarget.value);
                      }}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="SENT">Sent</option>
                      <option value="PAID">Paid</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="OVERDUE">Overdue</option>
                    </select>
                  </label>
                </div>
              )}
            </form.Field>
            <form.Field name="companyId">
              {(field) => (
                <div>
                  <label>
                    <div>Company ID</div>
                    <input
                      type="number"
                      value={field().state.value}
                      onInput={(e) => {
                        field().handleChange(Number(e.currentTarget.value));
                      }}
                    />
                  </label>
                </div>
              )}
            </form.Field>
            <form.Field name="items">
              {(field) => (
                <div>
                  <Show when={field().state.value.length > 0}>
                    <Index each={field().state.value}>
                      {(item, i) => (
                        <div>
                          <form.Field name={`items[${i}].description`}>
                            {(subField) => (
                              <div>
                                <label>
                                  <div>Description for item {i}</div>
                                  <input
                                    value={subField().state.value}
                                    onInput={(e) => {
                                      subField().handleChange(e.currentTarget.value);
                                    }}
                                  />
                                </label>
                              </div>
                            )}
                          </form.Field>
                          <form.Field name={`items[${i}].quantity`}>
                            {(subField) => (
                              <div>
                                <label>
                                  <div>Quantity for item {i}</div>
                                  <input
                                    type="number"
                                    value={subField().state.value}
                                    onInput={(e) => {
                                      subField().handleChange(Number(e.currentTarget.value));
                                    }}
                                  />
                                </label>
                              </div>
                            )}
                          </form.Field>
                          <form.Field name={`items[${i}].price`}>
                            {(subField) => (
                              <div>
                                <label>
                                  <div>Price for item {i}</div>
                                  <input
                                    type="number"
                                    value={subField().state.value}
                                    onInput={(e) => {
                                      subField().handleChange(Number(e.currentTarget.value));
                                    }}
                                  />
                                </label>
                              </div>
                            )}
                          </form.Field>
                          <form.Field name={`items[${i}].tax`}>
                            {(subField) => (
                              <div>
                                <label>
                                  <div>Tax for item {i}</div>
                                  <input
                                    type="number"
                                    value={subField().state.value}
                                    onInput={(e) => {
                                      subField().handleChange(Number(e.currentTarget.value));
                                    }}
                                  />
                                </label>
                              </div>
                            )}
                          </form.Field>
                        </div>
                      )}
                    </Index>
                  </Show>

                  <button
                    onClick={() =>
                      field().pushValue({ id: 0, invoiceId: 0, description: "", quantity: 0, price: 0, tax: 0 })
                    }
                    type="button"
                  >
                    Add item
                  </button>
                </div>
              )}
            </form.Field>
            <button type="submit">Submit</button>
          </Form>
        </div>

        <div class="w-full lg:w-1/2 bg-red rounded-xl gap-4 flex flex-col p-4">
          <h1 class="text-xl font-bold">Invoice Preview</h1>
          <Hr />
          <TemplateRenderer template={template} data={{ email: "joe@aa.cz", phone: "12122212" }} />
        </div>
      </div>
    </Container>
  );
};

export default ManageInvoice;
