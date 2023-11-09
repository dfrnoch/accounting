import { useSelector } from "@/store";
import { Component } from "solid-js";
import Box from "../components/Box";
import StatBox from "../components/StatBox";
import { useI18n } from "@/i18n";

const Overview: Component = () => {
  const {
    companyService: { company },
  } = useSelector();

  const [t] = useI18n();

  return (
    <div class="grid grid-cols-3 grid-rows-5 gap-3 lg:gap-4 w-full h-screen">
      <div class="col-span-3">
        <div class="flex flex-row gap-3 lg:gap-4 justify-between items-center w-full h-full">
          <StatBox title={t("home.stats.purchase")} value="$8657.32" last={6804.52} />
          <StatBox title={t("home.stats.sales")} value="100$" />
          <StatBox title={t("home.stats.tax")} value="69$" />
        </div>
      </div>
      <div class="col-span-2 row-span-2 row-start-2">
        <Box>
          <div class="flex flex-row">charts</div>
        </Box>
      </div>
      <div class="col-span-1">
        <Box>
          <div class="flex flex-row">info</div>
        </Box>
      </div>
      <div class="col-span-2 row-start-4">
        <Box>
          <div class="flex flex-row">ddad</div>
        </Box>
      </div>
      <div class="col-start-3 row-span-2">
        <Box>
          <div class="flex flex-row">info2s</div>
        </Box>
      </div>
    </div>
  );
};

export default Overview;
