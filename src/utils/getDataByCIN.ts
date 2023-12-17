import xml2js from "xml2js";
import { fetch } from "@tauri-apps/plugin-http";

export async function getDataByCIN(cin: string) {
  const response = await fetch(`https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=${cin}`);
  const text = await response.text();
  const parser = new xml2js.Parser();
  let result = await parser.parseStringPromise(text);
  result = result["are:Ares_odpovedi"]["are:Odpoved"][0]["D:VBAS"][0];
  const dicValue = result["D:DIC"]?.[0] ? result["D:DIC"][0] : "";

  const data = {
    company: result["D:OF"][0]._ || "",
    address: result["D:AD"][0]["D:UC"][0] || "",
    city: result["D:AA"][0]["D:N"][0] || "",
    zip: result["D:AA"][0]["D:PSC"][0] || "",
    dic: dicValue,
  };

  return data;
}
