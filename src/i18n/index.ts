import { createChainedI18nContext } from "@solid-primitives/i18n";
import { dict } from "./dict";

export const [I18nProvider, useI18nContext] = createChainedI18nContext({
  dictionaries: dict,
  locale: "cs",
});

export const useI18n = () => {
  const context = useI18nContext();
  if (!context) throw new Error("useI18n must be used within an I18nProvider");
  return context;
};
