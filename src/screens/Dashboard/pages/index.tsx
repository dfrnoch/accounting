import type { Component } from "solid-js";
import { onMount } from "solid-js";
import Box from "../components/Box";
import { useI18n } from "@/i18n";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";
import {
  Chart,
  LineController,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  ArcElement,
  PieController,
} from "chart.js";
import { Line, Bar, Pie } from "solid-chartjs";
import { getSales } from "@/bindings";
import StatBox from "../components/StatBox";

const Overview: Component = () => {
  const [t] = useI18n();

  onMount(() => {
    Chart.register(
      LineController,
      CategoryScale,
      PointElement,
      LineElement,
      LinearScale,
      Title,
      Tooltip,
      Legend,
      BarController,
      BarElement,
      ArcElement,
      PieController,
    );
  });

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales",
        data: [50, 60, 70, 80, 90],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Sales Chart",
      },
    },
  };

  const pieChartData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Pie Chart",
      },
    },
  };

  const barChartData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Bar Chart",
      },
    },
  };

  onMount(async () => {
    const data = await getSales(2);
    console.log(data);
  });

  return (
    <Container>
      <PageHeader title={[t("sidebar.button.overview")]} />
      <div class="grid grid-cols-2 grid-rows-5 gap-3 lg:(gap-4 grid-cols-3) w-full h-screen">
        <div class="col-span-2">
          <div class="flex flex-row gap-3 lg:gap-4 justify-between items-center w-full h-full">
            <StatBox title={t("overview.stats.purchase")} value={1654.43} last={6804.52} />
            <StatBox title={t("overview.stats.sales")} value={100} />
            <StatBox title={t("overview.stats.tax")} value={120} />
          </div>
        </div>
        <div class="col-span-2 row-span-2 row-start-2">
          <Box>
            <Line data={lineChartData} options={lineChartOptions} width={500} height={300} />
          </Box>
        </div>
        <div class="hidden lg:(block col-span-1)">
          <Box>
            <div class="flex flex-row">info</div>
          </Box>
        </div>
        <div class="col-span-2 row-start-4">
          <Box>
            <Bar data={barChartData} options={barChartOptions} width={500} height={300} />
          </Box>
        </div>
        <div class="lg:(col-start-3 row-span-2 block) hidden">
          <Box>
            <Pie data={pieChartData} options={pieChartOptions} width={500} height={300} />
          </Box>
        </div>
      </div>
    </Container>
  );
};

export default Overview;
