import { getInvoices } from "@/bindings";
import { useI18n } from "@/i18n";
import Table, { type Indicies } from "@/screens/Dashboard/components/Table";
import { useSelector } from "@/store";
import { FiDownload, FiEdit, FiPlus, FiTrash } from "solid-icons/fi";
import { type Component, createSignal } from "solid-js";
import Popover from "@/shared/components/Popover";
import { useNavigate } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";

const Invoices: Component = () => {
  const company = useSelector((state) => state.companyService.company);
  const [t] = useI18n();
  const navigate = useNavigate();

  const fetchInvoices = async (indicies: Indicies) => {
    console.log(company);
    const data = await getInvoices(indicies);
    console.log(data);
    // setInvoices(data);
  };
  fetchInvoices();

  const loadPage = async (indices: Indicies) => {
    const data = books.slice(indices.skip, indices.skip + indices.take);
    return data;
  };

  const columns = [
    { field: "id", header: "ID" },
    { field: "title", header: "Title" },
    { field: "author", header: "Author" },
    { field: "year", header: "Year" },
  ];

  interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    [key: string]: unknown;
  }

  const books: Book[] = [
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960 },
    { id: 2, title: "1984", author: "George Orwell", year: 1949 },
    { id: 3, title: "Pride and Prejudice", author: "Jane Austen", year: 1813 },
    { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925 },
    { id: 5, title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", year: 1967 },
    {
      id: 6,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      year: 1954,
      genre: "Fantasy",
      language: "English",
      pages: 1178,
    },
    {
      id: 7,
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      year: 1997,
      genre: "Fantasy",
      language: "English",
      pages: 309,
    },
    {
      id: 8,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      year: 1937,
      genre: "Fantasy",
      language: "English",
      pages: 310,
    },
    {
      id: 9,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      year: 1951,
      genre: "Fiction",
      language: "English",
      pages: 277,
    },
    {
      id: 10,
      title: "The Alchemist",
      author: "Paulo Coelho",
      year: 1988,
      genre: "Fiction",
      language: "Portuguese",
      pages: 197,
    },
    {
      id: 11,
      title: "The Little Prince",
      author: "Antoine de Saint-Exupéry",
      year: 1943,
      genre: "Novella",
      language: "French",
      pages: 93,
    },
    {
      id: 12,
      title: "The Book Thief",
      author: "Markus Zusak",
      year: 2005,
      genre: "Historical Fiction",
      language: "English",
      pages: 552,
    },
    {
      id: 13,
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      year: 2003,
      genre: "Fiction",
      language: "English",
      pages: 371,
    },
    {
      id: 14,
      title: "The Hunger Games",
      author: "Suzanne Collins",
      year: 2008,
      genre: "Science Fiction",
      language: "English",
      pages: 374,
    },
    {
      id: 15,
      title: "The Giver",
      author: "Lois Lowry",
      year: 1993,
      genre: "Dystopian Fiction",
      language: "English",
      pages: 179,
    },
  ];
  const [invoicePopover, setInvoicePopover] = createSignal(false);

  const handleEdit = (item: Book) => {
    navigate(`${item.id}`);
  };

  const handleDelete = (item: Book) => {
    console.log("Delete:", item);
    // Handle delete action
  };
  const handleDownload = (item: Book) => {
    // Handle download action
    window.print();
  };

  const rowActions = [
    {
      label: "Download",
      onClick: handleDownload,
      icon: FiDownload,
    },
    {
      label: "Edit",
      onClick: handleEdit,
      icon: FiEdit,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      icon: FiTrash,
    },
  ];

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.invoices")]}
        actionElements={[
          <HeaderButton onClick={() => navigate("new")} buttonType="primary">
            <FiPlus class="stroke-2" />
          </HeaderButton>,
          <HeaderButton>Export</HeaderButton>,
        ]}
      />
      <Table columns={columns} totalItems={books.length} loadPage={loadPage} rowActions={rowActions} />
      <Popover show={invoicePopover()} onClose={() => setInvoicePopover(false)} title="Create Invoice">
        <div>cuspoic</div>
      </Popover>
    </Container>
  );
};

export default Invoices;
