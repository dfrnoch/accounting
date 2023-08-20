import { useSelector } from "@/store";
import { Component } from "solid-js";
import Box from "../components/Box";

const Overview: Component = () => {
  const {
    companyService: { company },
  } = useSelector();

  return (
    <div class="grid grid-cols-3 grid-rows-5 gap-4 w-full h-screen">
      <div class="col-span-3">
        <Box>
          <div class="flex flex-row">statistics</div>
        </Box>
      </div>
      <div class="col-span-2 row-span-2 row-start-2">
        <Box>
          <div class="flex flex-row">charts</div>
        </Box>
      </div>
      <div class="col-span-1">
        <Box>
          <div class="flex flex-row">info </div>
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
