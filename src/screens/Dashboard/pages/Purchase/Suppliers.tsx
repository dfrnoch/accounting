import Popover from "@/shared/components/Popover";
import { useSelector } from "@/store";
import { type Component, createSignal } from "solid-js";

const Suppliers: Component = () => {
  const company = useSelector((state) => state.companyService.company);
  const [showPopup, setShowPopup] = createSignal(false);

  return (
    <div class="flex flex-col items-center justify-center h-screen w-full">
      <h1 class="text-4xl font-bold">Suppliers!</h1>
      <button class="mt-4 bg-primary text-white px-4 py-2 rounded-md" onClick={() => setShowPopup(true)}>
        popup
      </button>
      <Popover title="dd" show={showPopup()} onClose={() => setShowPopup(false)}>
        <div>content</div>
      </Popover>
    </div>
  );
};

export default Suppliers;
