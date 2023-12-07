import { defineConfig } from "@unocss/vite";
import { presetUno } from "@unocss/preset-uno";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      grey: "var(--color-grey)",
      lightgrey: "var(--color-lightgrey)",
      danger: "var(--color-danger)",
      warning: "var(--color-warning)",
      success: "var(--color-success)",
      info: "var(--color-info)",
    },
  },
  transformers: [transformerVariantGroup()],
});
