import type { Flatten } from "@solid-primitives/i18n";
import { LANG } from "@/constants";
import en from "./en.json";
import cs from "./cs.json";

export type Dict = Flatten<typeof en>;

export default {
  [LANG.EN]: en,
  [LANG.CS]: cs,
};
