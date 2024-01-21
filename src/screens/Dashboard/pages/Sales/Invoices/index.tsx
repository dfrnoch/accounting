import { getInvoices } from "@/bindings";
import { useI18n } from "@/i18n";
import Row from "@/screens/Dashboard/components/Table/Row";
import TableHeader from "@/screens/Dashboard/components/Table/TableHeader";
import { useSelector } from "@/store";
import { Component, createSignal } from "solid-js";

const Invoices: Component = () => {
  const {
    companyService: { company },
  } = useSelector();
  const [t] = useI18n();
  const [invoices, setInvoices] = createSignal([]);

  const fetchInvoices = async () => {
    console.log(company);
    const data = await getInvoices(company.id);
    console.log(data);
    setInvoices(data);
  };
  fetchInvoices();

  return (
    <div class="flex flex-col justify-center items-center w-full h-full">
      <table class="w-full">
        <tbody>
          <TableHeader>
            <td class="rounded-tl rounded-bl px-3">Ahoj,</td>
            <td>Ahoj,</td>
            <td>Ahoj,</td>
          </TableHeader>
          <Row>
            <td>Centro </td>
            <td>Centro </td>
            <td>Centro </td>
          </Row>
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
