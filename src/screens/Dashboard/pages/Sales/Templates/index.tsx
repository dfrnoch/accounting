import { useI18n } from "@/i18n";
import Dropdown from "@/shared/components/Menu/Dropdown";
import { useSelector } from "@/store";
import { getInitializedPrintWindow } from "@/utils/savePDF";
import type { Component } from "solid-js";

const Invoices: Component = () => {
  const [t] = useI18n();

  return (
    <div class="">
      <h1 class="text-3xl font-bold">{t("invoices.title")}</h1>

      <button
        type="button"
        onClick={() => getInitializedPrintWindow(10, 10)}
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        cus
      </button>

      <Dropdown />

      {/* <table class="w-full ">
        <tbody>
          <TableHeader>
            <td class="">ID</td>
            <td>Castka</td>
            <td>Ahoj,</td>
          </TableHeader>
          <Row>
            <td>
              <Badge color="danger">Cuspic</Badge>{" "}
            </td>
            <td>Centro </td>
            <td>Centro </td>
          </Row>
          <Row>
            <td>Centro </td>
            <td>Centro </td>
            <td>Centro </td>
          </Row>
        </tbody>
      </table> */}
    </div>
  );
};

export default Invoices;
