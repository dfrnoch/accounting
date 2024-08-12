export enum LANG {
  EN = "en-US",
  CS = "cs-CZ",
}

export const templatesHtml = {
  cz: [
    {
      id: 1,
      code: `<div class="bg-white p-8">
  <div class="mb-8 flex justify-between">
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

  <div class="mb-8 flex justify-between">
    <div>
      <h2 class="mb-2 font-bold">Billed to</h2>
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

  <div class="mb-8 flex justify-between">
    <div>
      <h2 class="mb-2 font-bold">Subject</h2>
      <p>{{ subject }}</p>
    </div>
    <div class="text-right">
      <h2 class="text-3xl font-bold text-orange-500">{{ items | map: 'price' | sum }} {{ currency.code }}</h2>
    </div>
  </div>

  <div class="mb-8 flex justify-between">
    <div>
      <h2 class="font-bold">Invoice date</h2>
      <p>{{ issueDate }}</p>
    </div>
    <div class="text-right">
      <h2 class="font-bold">Due date</h2>
      <p>{{ dueDate }}</p>
    </div>
  </div>

  <table class="mb-8 w-full">
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
        <td class="border-b px-4 py-2 text-right">{{ item.price }}</td>
        <td class="border-b px-4 py-2 text-right">{{ item.quantity | times: item.price }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>

  <div class="flex justify-end">
    <div class="w-1/2">
      <div class="flex justify-between font-bold">
        <span>Total</span>
        <span>{{ items | map: 'price' | sum }} {{ currency.code }}</span>
      </div>
    </div>
  </div>

  <div class="mt-8">
    <p>Thanks for the business.</p>
  </div>

  <div class="mt-8">
    <h2 class="mb-2 font-bold">Terms & Conditions</h2>
    <p>Please pay within 15 days of receiving this invoice.</p>
  </div>
</div>`,
    },
    {
      id: 3,
      code: `<div class="mx-auto flex h-full max-w-3xl flex-col justify-between bg-white p-8">
  <div>
    <div class="mb-8 flex items-start justify-between">
      <div>
        <h1 class="mb-8 text-4xl font-bold">INVOICE</h1>
        <div class="mb-4">
          <h2 class="font-bold">Billed to</h2>
          <p>{{ client.name }}</p>
          <p>{{ client.address }}</p>
          <p>{{ client.city }}, {{ client.country }} - {{ client.zip }}</p>
        </div>
      </div>
      <div class="text-right">
        <h2 class="text-2xl font-bold text-indigo-600">{{ company.name }}</h2>
        <p>{{ company.address }}</p>
        <p>{{ company.city }}, {{ company.state }}, {{ company.zip }}</p>
        <p>TAX ID {{ company.vatId }}</p>
      </div>
    </div>

    <div class="mb-8 grid grid-cols-2 gap-8">
      <div>
        <p><span class="font-bold">Invoice #</span><br />{{ number }}</p>
        <p class="mt-4"><span class="font-bold">Subject</span><br />{{ subject }}</p>
        <p class="mt-4"><span class="font-bold">Invoice date</span><br />{{ issueDate }}</p>
        <p class="mt-4"><span class="font-bold">Due date</span><br />{{ dueDate }}</p>
      </div>
      <div class="rounded-lg bg-gray-100 p-6">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-300">
              <th class="pb-2 text-left">Services</th>
              <th class="pb-2 text-right">Qty</th>
              <th class="pb-2 text-right">Rate</th>
              <th class="pb-2 text-right">Line total</th>
            </tr>
          </thead>
          <tbody>
            {% for item in items %}
            <tr>
              <td class="py-2">{{ item.description }}</td>
              <td class="py-2 text-right">{{ item.quantity }}</td>
              <td class="py-2 text-right">{{ item.price}} {{ currency.code }}</td>
              <td class="py-2 text-right">{{ item.quantity | times: item.price }} {{ currency.code }}</td>
            </tr>
            {% endfor %}
          </tbody>
        </table>
        <div class="mt-4 border-t border-gray-300 pt-4">
          <div class="mt-2 flex justify-between font-bold">
            <span>Total due</span>
            <span class="text-indigo-600">{{ items | map: 'price' | sum }} {{ currency.code }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="rounded-lg bg-gray-100 p-4 text-sm">
      <p>Please pay within 14 days of receiving this invoice.</p>
    </div>

    <div class="mt-8 text-center text-sm text-gray-500">
      <p>{{ company.website }} | {{ company.phone }} | {{ company.email }}</p>
    </div>
  </div>
</div>`,
    },
    {
      id: 2,
      code: `<div class="mx-auto max-w-3xl bg-white p-8">
  <div class="mb-8 flex items-start justify-between">
    <h1 class="text-4xl font-bold">Invoice</h1>
    <p class="text-xl text-gray-600">№ {{ number }}</p>
  </div>

  <div class="mb-8 grid grid-cols-3 gap-8">
    <div>
      <p class="mb-2 text-xl font-bold">Payable {{ items | map: 'price' | sum }} {{ currency.code }}</p>
      <p class="text-gray-600">Dues {{ dueDate }}</p>
      <p class="text-gray-600">Issued {{ issueDate }}</p>
    </div>
    <div>
      <h2 class="mb-2 font-bold">Billed to</h2>
      <p>{{ client.name }}</p>
      <p>{{ client.address }}</p>
      <p>{{ client.city }}, {{ client.country }} - {{ client.zip }}</p>
      <p>{{ client.phone }}</p>
    </div>
    <div>
      <h2 class="mb-2 font-bold">From</h2>
      <p>{{ company.name }}</p>
      <p>{{ company.address }}</p>
      <p>{{ company.city }}, {{ company.state }}, {{ company.zip }}</p>
      <p>TAX ID {{ company.vatId }}</p>
    </div>
  </div>

  <div class="mb-8">
    <h2 class="mb-4 text-xl font-bold">{{ subject }}</h2>
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-300 text-left">
          <th class="pb-2">ITEM DESCRIPTION</th>
          <th class="pb-2">QTY</th>
          <th class="pb-2">RATE</th>
          <th class="pb-2">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        {% for item in items %}
        <tr>
          <td class="py-2">{{ item.description }}</td>
          <td class="py-2">{{ item.quantity }}</td>
          <td class="py-2">{{ item.price | round: 2 }} {{ currency.code }}</td>
          <td class="py-2">{{ item.quantity | times: item.price | round: 2 }} {{ currency.code }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>

  <div class="flex justify-end">
    <div class="w-1/2">
      <div class="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span class="text-pink-600">{{ items | map: 'price' | sum | round: 2 }} {{ currency.code }}</span>
      </div>
    </div>
  </div>

  <div class="mt-8 grid grid-cols-2 gap-8">
    <div class="border-l-4 border-gray-300 pl-4">
      <h2 class="mb-2 font-bold">Payment details</h2>
      <p>Please pay within 14 days of receiving this invoice.</p>
    </div>
    <div>
      <p><span class="font-bold">Bank account:</span> {{ company.bankName }}</p>
      <p><span class="font-bold">IBAN:</span> {{ company.bankIban}}</p>
    </div>
  </div>

  <div class="mt-8 border-l-4 border-gray-300 pl-4">
    <p>Thanks for the business.</p>
  </div>

  <div class="mt-8 text-center text-sm text-gray-600">
    <p>{{ company.email }} | {{ company.phone }}</p>
  </div>
</div>`,
    },
  ],
};
