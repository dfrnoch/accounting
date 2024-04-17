import type { Component } from "solid-js";
import { Show, createResource } from "solid-js";
import Box from "../components/Box";
import { useI18n } from "@/i18n";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";
import { SolidApexCharts } from "solid-apexcharts";
import { getDocumentStats, getExpenses, getSales, DocumentType } from "@/bindings";
import StatBox from "../components/StatBox";

const Overview: Component = () => {
  const [t] = useI18n();
  const [sales] = createResource(6, getSales);
  const [expenses] = createResource(6, getExpenses);

  const [sentInvoices] = createResource(6, () => getDocumentStats(6, DocumentType.INVOICE));
  const [receivedInvoices] = createResource(6, () => getDocumentStats(6, DocumentType.RECEIVE));

  const getLastSixMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = getMonthName(month.getMonth());
      months.push(monthName);
    }

    return months.reverse();
  };

  const getMonthName = (monthIndex: number) => {
    switch (monthIndex) {
      case 0:
        return t("overview.months.january");
      case 1:
        return t("overview.months.february");
      case 2:
        return t("overview.months.march");
      case 3:
        return t("overview.months.april");
      case 4:
        return t("overview.months.may");
      case 5:
        return t("overview.months.june");
      case 6:
        return t("overview.months.july");
      case 7:
        return t("overview.months.august");
      case 8:
        return t("overview.months.september");
      case 9:
        return t("overview.months.october");
      case 10:
        return t("overview.months.november");
      case 11:
        return t("overview.months.december");
      default:
        return "";
    }
  };

  return (
    <Container>
      <PageHeader title={[t("sidebar.button.overview")]} />
      <div class="grid grid-cols-2 grid-rows-5 gap-3 w-full h-screen">
        <div class="col-span-2">
          <div class="flex flex-row gap-3 lg:gap-4 justify-between items-center w-full h-full">
            <Show when={sales() && expenses()}>
              <StatBox title={t("overview.stats.sales")} value={sales()[0]} last={sales()[1]} />
              <StatBox title={t("overview.stats.expenses")} value={expenses()[0]} last={expenses()[1]} />
            </Show>
          </div>
        </div>
        <div class="col-span-2 row-span-2 row-start-2">
          <Box chart>
            <Show when={sales() && expenses()}>
              <SolidApexCharts
                type="area"
                options={{
                  chart: {
                    type: "area",
                    toolbar: {
                      show: false,
                    },
                    width: "100%",
                    height: "100%",
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  stroke: {
                    curve: "smooth",
                  },
                  xaxis: {
                    categories: getLastSixMonths(),
                    labels: {
                      style: {
                        colors: "var(--color-primary)",
                        fontSize: "12px",
                        fontWeight: 400,
                        cssClass: "apexcharts-xaxis-label",
                      },
                    },
                    axisBorder: {
                      show: true,
                      color: "var(--color-border)",
                      offsetX: 0,
                      offsetY: 0,
                    },
                    axisTicks: {
                      show: true,
                      borderType: "solid",
                      color: "var(--color-border)",
                      height: 6,
                      offsetX: 0,
                      offsetY: 0,
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: "var(--color-primary)",
                        fontSize: "12px",
                        fontWeight: 400,
                        cssClass: "apexcharts-yaxis-label",
                      },
                    },
                  },
                  grid: {
                    show: true,
                    borderColor: "var(--color-border)",
                    strokeDashArray: 0,
                    position: "back",
                    xaxis: {
                      lines: {
                        show: true,
                      },
                    },
                    yaxis: {
                      lines: {
                        show: true,
                      },
                    },
                    row: {
                      opacity: 0.5,
                    },
                    column: {
                      opacity: 0.5,
                    },
                    padding: {
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 20,
                    },
                  },
                  tooltip: {
                    theme: "dark",
                    style: {
                      fontSize: "12px",
                    },
                  },
                  legend: {
                    labels: {
                      colors: "var(--color-primary)",
                      useSeriesColors: false,
                    },
                  },
                }}
                series={[
                  {
                    name: t("overview.chart.sales"),
                    data: sales() as number[],
                  },
                  {
                    name: t("overview.chart.expenses"),
                    data: expenses() as number[],
                  },
                ]}
              />
            </Show>
          </Box>
        </div>
        <div class="col-span-2 row-start-4 row-span-2">
          <Box chart>
            <Show when={sentInvoices() && receivedInvoices()}>
              <SolidApexCharts
                type="bar"
                options={{
                  chart: {
                    type: "bar",
                    toolbar: {
                      show: false,
                    },
                    width: "100%",
                    height: "100%",
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: "55%",
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  stroke: {
                    show: true,
                    width: 2,
                    colors: ["transparent"],
                  },
                  xaxis: {
                    categories: getLastSixMonths(),
                    labels: {
                      style: {
                        colors: "var(--color-primary)",
                        fontSize: "12px",
                        fontWeight: 400,
                        cssClass: "apexcharts-xaxis-label",
                      },
                    },
                    axisBorder: {
                      show: true,
                      color: "var(--color-border)",
                      offsetX: 0,
                      offsetY: 0,
                    },
                    axisTicks: {
                      show: true,
                      borderType: "solid",
                      color: "var(--color-border)",
                      height: 6,
                      offsetX: 0,
                      offsetY: 0,
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: "var(--color-primary)",
                        fontSize: "12px",
                        fontWeight: 400,
                        cssClass: "apexcharts-yaxis-label",
                      },
                      formatter: (value: number) => {
                        if (value % 1 === 0) {
                          return value.toString();
                        }
                        return "";
                      },
                    },
                  },
                  grid: {
                    show: true,
                    borderColor: "var(--color-border)",
                    strokeDashArray: 0,
                    position: "back",
                    xaxis: {
                      lines: {
                        show: true,
                      },
                    },
                    yaxis: {
                      lines: {
                        show: true,
                      },
                    },
                    row: {
                      opacity: 0.5,
                    },
                    column: {
                      opacity: 0.5,
                    },
                    padding: {
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 20,
                    },
                  },
                  tooltip: {
                    theme: "dark",
                    style: {
                      fontSize: "12px",
                    },
                  },
                  legend: {
                    labels: {
                      colors: "var(--color-primary)",
                      useSeriesColors: false,
                    },
                  },
                }}
                series={[
                  {
                    name: t("overview.chart.sentInvoices"),
                    data: sentInvoices() as number[],
                  },
                  {
                    name: t("overview.chart.receivedInvoices"),
                    data: receivedInvoices() as number[],
                  },
                ]}
              />
            </Show>
          </Box>
        </div>
      </div>
    </Container>
  );
};

export default Overview;
