import { getInvoices } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { Button } from "@/shared/components/Button";
import { SegmentedControl } from "@/shared/components/SegmentedControl";
import { useSelector } from "@/store";
import { FiActivity, FiTrash } from "solid-icons/fi";
import { Component, createSignal } from "solid-js";

const Invoices: Component = () => {
  const company = useSelector((state) => state.companyService.company);
  const [t] = useI18n();
  const [invoices, setInvoices] = createSignal([]);

  const fetchInvoices = async () => {
    console.log(company);
    const data = await getInvoices(company.id);
    console.log(data);
    // setInvoices(data);
  };
  fetchInvoices();

  const loadPage = async (page: number, pageSize: number) => {
    // Simulating an API call to fetch data for the specified page
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = books.slice(startIndex, endIndex);
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

  const handleEdit = (item: Book) => {
    console.log("Edit:", item);
    // Handle edit action
  };

  const handleDelete = (item: Book) => {
    console.log("Delete:", item);
    // Handle delete action
  };

  const rowActions = [
    {
      label: "Edit",
      onClick: handleEdit,
      icon: FiActivity,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      icon: FiTrash,
    },
  ];

  return (
    <div class="">
      <h1 class="text-3xl font-bold">{t("invoices.title")}</h1>
      <Table
        data={[]}
        columns={columns}
        totalItems={books.length}
        loadPage={loadPage}
        rowActions={rowActions}
        extraContent={
          <div class="flex flex-row gap-2 items-center">
            <Button onClick={() => console.log("Create new invoice")}>Create new invoice</Button>
            <SegmentedControl
              onChange={(value) => console.log("Filter invoices by:", value)}
              options={[
                { id: "all", label: "All" },
                { id: "unpaid", label: "Unpaid" },
              ]}
            />
          </div>
        }
      />
    </div>
  );
};

export default Invoices;
