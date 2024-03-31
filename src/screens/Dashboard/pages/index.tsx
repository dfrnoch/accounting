import type { Component } from "solid-js";
import Box from "../components/Box";
import StatBox from "../components/StatBox";
import { useI18n } from "@/i18n";
import PageHeader from "../components/PageHeader";

const Overview: Component = () => {
  const [t] = useI18n();

  return (
    <>
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
            <div class="flex flex-row">charts</div>
          </Box>
        </div>
        <div class="hidden lg:(block col-span-1)">
          <Box>
            <div class="flex flex-row">info</div>
          </Box>
        </div>
        <div class="col-span-2 row-start-4">
          <Box>
            <div class="flex flex-row">ddad</div>
          </Box>
        </div>
        <div class="lg:(col-start-3 row-span-2 block) hidden">
          <Box>
            <div class="flex flex-row">info2s</div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Overview;
