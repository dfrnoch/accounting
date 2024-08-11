export enum LANG {
  EN = "en-US",
  CS = "cs-CZ",
}

export const templatesHtml = {
  cz: {
    1: `
    <div class="bg-white p-8">
  <div class="flex justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold">{{ company.name }}</h1>
      <p>{{ company.website }}</p>
      <p>{{ company.email }}</p>
      <p>{{ company.phone }}</p>
    </div>
    <div class="text-right">
      <p>{{ company.address }}</p>
      <p>{{ company.city }}, {{ company.state }} - {{ company.zip }}</p>
      <p>TAX ID {{ company.vatId }}</p>
    </div>
  </div>

  <div class="flex justify-between mb-8">
    <div>
      <h2 class="font-bold mb-2">Billed to</h2>
      <p>{{ client.name }}</p>
      <p>{{ client.address }}</p>
      <p>{{ client.city }}, {{ client.country }} - {{ client.zip }}</p>
      <p>{{ client.phone }}</p>
    </div>
    <div class="text-right">
      <div class="mb-4">
        <h2 class="font-bold">Invoice number</h2>
        <p>{{ number }}</p>
      </div>
      <div>
        <h2 class="font-bold">Reference</h2>
        <p>INV-057</p>
      </div>
    </div>
  </div>

  <div class="flex justify-between mb-8">
    <div>
      <h2 class="font-bold mb-2">Subject</h2>
      <p>Design System</p>
    </div>
    <div class="text-right">
      <h2 class="font-bold text-3xl text-orange-500">{{ items | map: 'price' | sum }}.00</h2>
      <p>Invoice of ({{ currency.code }})</p>
    </div>
  </div>

  <div class="flex justify-between mb-8">
    <div>
      <h2 class="font-bold">Invoice date</h2>
      <p>{{ issueDate }}</p>
    </div>
    <div class="text-right">
      <h2 class="font-bold">Due date</h2>
      <p>{{ dueDate }}</p>
    </div>
  </div>

  <table class="w-full mb-8">
    <thead>
      <tr class="bg-gray-100">
        <th class="px-4 py-2 text-left">ITEM DETAIL</th>
        <th class="px-4 py-2 text-right">QTY</th>
        <th class="px-4 py-2 text-right">RATE</th>
        <th class="px-4 py-2 text-right">AMOUNT</th>
      </tr>
    </thead>
    <tbody>
      {% for item in items %}
        <tr>
          <td class="border-b px-4 py-2">
            <p class="font-bold">{{ item.description }}</p>
            <p class="text-gray-600">Item description</p>
          </td>
          <td class="border-b px-4 py-2 text-right">{{ item.quantity }}</td>
          <td class="border-b px-4 py-2 text-right">{{ item.price }}.00</td>
          <td class="border-b px-4 py-2 text-right">{{ item.quantity | times: item.price }}.00</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>

  <div class="flex justify-end">
    <div class="w-1/2">
      <div class="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>{{ items | map: 'price' | sum }}.00</span>
      </div>
      <div class="flex justify-between mb-2">
        <span>Tax (10%)</span>
        <span>{{ items | map: 'price' | sum | times: 0.1 }}.00</span>
      </div>
      <div class="flex justify-between font-bold">
        <span>Total</span>
        <span>{{ items | map: 'price' | sum | plus: items | map: 'price' | sum | times: 0.1 }}.00</span>
      </div>
    </div>
  </div>

  <div class="mt-8">
    <p>Thanks for the business.</p>
  </div>

  <div class="mt-8">
    <h2 class="font-bold mb-2">Terms & Conditions</h2>
    <p>Please pay within 15 days of receiving this invoice.</p>
  </div>
</div>

`,
  },
};
