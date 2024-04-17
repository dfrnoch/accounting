import { getClient, getDocumentCount, getDocuments } from "@/bindings";
import { useI18n } from "@/i18n";
import Box from "@/screens/Dashboard/components/Box";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import StatBox from "@/screens/Dashboard/components/StatBox";
import Table from "@/screens/Dashboard/components/Table";
import LoadingIcon from "@/shared/components/LoadingIcon";
import { Hr } from "@/shared/components/Menu/Hr";
import { useNavigate, useParams } from "@solidjs/router";
import { FiUsers } from "solid-icons/fi";
import { type ParentComponent, Show, Suspense, createResource, type Component, type JSX } from "solid-js";

const ClientDetail: Component = () => {
  const params = useParams<{ readonly id: string }>();
  const navigate = useNavigate();
  const [t] = useI18n();

  const [client] = createResource(Number(params.id), getClient);

  return (
    <Container class="pb-3">
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.clients"), params.id]}
        actionElements={[
          <HeaderButton onClick={() => navigate(`/dashboard/other/clients/${params.id}`)} buttonType="primary">
            Edit
          </HeaderButton>,
        ]}
      />
      <div class="grid grid-cols-6 gap-3 lg:gap-4 h-full grid-rows-5">
        <StatBox class="col-span-3" title={t("overview.stats.sales")} value={100} />
        <StatBox class="col-span-3" title={t("overview.stats.expenses")} value={1654.43} last={6804.52} />
        <div class="col-span-4 row-span-4">
          <Table
            columns={[
              { field: "number", header: "Number" },
              {
                field: "totalPrice",
                header: "Total Price",
                component: (item) => (
                  <>
                    {item.totalPrice} {item.currency}
                  </>
                ),
              },
            ]}
            totalItems={getDocumentCount(undefined, Number.parseInt(params.id))}
            allowedCounts={[10]}
            loadPage={async (indices) => await getDocuments(indices, undefined, Number.parseInt(params.id))}
            onClickRow={(item) => {
              switch (item.documentType) {
                case "INVOICE":
                  navigate(`/dashboard/sales/invoices/${item.id}`);
                  break;
                case "PROFORMA":
                  navigate(`/dashboard/sales/estimates/${item.id}`);
                  break;
                case "RECEIVE":
                  navigate(`/dashboard/finance/received/${item.id}`);
                  break;
              }
            }}
          />
        </div>
        <Box class="col-span-2 row-span-4 relative overflow-scroll">
          <Suspense fallback={<LoadingIcon />}>
            <Show when={client()}>
              <div class="flex items-center flex-row gap-2 mb-2 ">
                <div class="flex h-10 w-10 items-center justify-center lg:h-10 lg:w-10 rounded-full bg-secondary opacity-50">
                  <FiUsers class="w-5 h-5 text-primary" />
                </div>
                <div class="flex flex-col ">
                  <div class="font-semibold">{client()?.name}</div>
                  <div class="text-sm ">{client()?.clientType}</div>
                </div>
              </div>
              <Hr class="my-3" />
              <div class="flex flex-col gap-1">
                <h2 class="text-primary text-sm font-semibold pb-2">Detail</h2>
                <Item title="CIN">{client()?.cin}</Item>
                <Item title="VAT">{client()?.vatId}</Item>
                <Item title="Email">{client()?.email}</Item>
                <Item title="Phone">{client()?.phone}</Item>

                <Hr class="my-2" />
                <h2 class="text-primary text-sm font-semibold pb-2">Address</h2>
                <Item title="Street">{client()?.address}</Item>
                <Item title="City">{client()?.city}</Item>
                <Item title="ZIP">{client()?.zip}</Item>

                <Hr class="my-2" />
                <h2 class="text-primary text-sm font-semibold pb-2">Bank</h2>
                <Item title="Account">{client()?.bankAccount}</Item>
                <Item title="IBAN">{client()?.bankIban}</Item>
              </div>
            </Show>
          </Suspense>
        </Box>
      </div>
    </Container>
  );
};

const Item: ParentComponent<{
  title: string;
  icon?: JSX.Element;
}> = (props) => {
  return (
    <div class="flex gap-2 items-center">
      <Show when={props.icon}>
        <div class="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10 rounded-full bg-secondary opacity-50">
          {props.icon}
        </div>
      </Show>
      <span class="block truncate font-semibold text-sm text-secondary">{props.title}</span>
      <span class="block truncate text-sm">{props.children}</span>
    </div>
  );
};

export default ClientDetail;
