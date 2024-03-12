export async function getDataByCIN(ico: string) {
  const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`);
  const data = await response.json();
  console.log(data);

  const psc: string = data.sidlo.psc.toString();

  return {
    company: data.obchodniJmeno,
    address: `${data.sidlo.nazevUlice || data.sidlo.nazevObce} ${data.sidlo.cisloDomovni}`,
    city: data.sidlo.nazevObce,
    // zip: data.sidlo.psc,
    zip: `${psc.slice(0, 3)} ${psc.slice(3, 6)}`,
    dic: data.dic,
  };
}
