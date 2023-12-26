import { Component } from "solid-js";

const Invoices: Component = () => {
  return (
    <div class="flex flex-col justify-center items-center w-full h-full">
      <table class="w-full">
        <tbody>
          <tr class="border-1 border-red">
            <td>invoice id</td>
            <td>state</td>
            <td>description</td>
            <td>company</td>
            <td>created_at</td>
            <td>splanost</td>
            <td>price</td>
            <td>interaction</td>
          </tr>
          <tr>
            <td>4</td>
            <td>4</td>
            <td>6</td>
            <td>5</td>
            <td>6</td>
            <td>5</td>
            <td>6</td>
            <td>6</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
