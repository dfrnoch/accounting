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
    <div class="grid grid-cols-3 grid-rows-5 gap-4 w-full h-screen">
      <div class="col-span-3">
        <Box>
          <div class="flex flex-row gap-4 justify-between items-center px-2 w-full h-full">
            <StatBox title={t.home_stats_purchase()} value="100$" />
            <StatBox title={t.home_stats_sales()} value="100$" />
            <StatBox title={t.home_stats_tax()} value="69$" />
          </div>
        </Box>
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
