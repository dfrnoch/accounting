import { defineConfig } from "@unocss/vite";
import { presetUno } from "@unocss/preset-uno";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      border: "var(--color-border)",
      lightgrey: "var(--color-lightgrey)",
      danger: "var(--color-danger)",
      warning: "var(--color-warning)",
      success: "var(--color-success)",
      info: "var(--color-info)",
      "transparent-white": "rgb(255 255 255 / 0.13)",
      "transparent-black": "rgb(0 0 0 / 0.13)",
      "very-transparent-black": "rgb(0 0 0 / 0.06)",
      gray: {
        100: "rgb(240, 240, 240)",
      },
      default: "var(--color-default)",
      vibrant: "var(--vibrant)",
      material: {
        menu: "rgb(246 246 246 / 0.72)",
        tooltip: "rgb(246 246 246 / .6)",
        selection: "rgb(10 130 255 / 0.75)",
      },
    },
    backgroundColor: {
      primary: "var(--bg-primary)",
      default: "var(--color-default)",
      fills: {
        opaque: {
          1: "rgb(0 0 0 / 0.85)",
          2: "rgb(0 0 0 / 0.50)",
          3: "rgb(0 0 0 / 0.25)",
          4: "rgb(0 0 0 / 0.10)",
          5: "rgb(0 0 0 / 0.05)",
        },
      },
    },
    shadowColor: {
      default: "var(--color-default)",
    },
    textColor: {
      opaque: {
        1: "var(--text-opaque-1)",
        2: "var(--text-opaque-2)",
        3: "var(--text-opaque-3)",
      },
    },
    boxShadow: {
      sm: "0px 0.25px 0.25px 0px rgb(0 0 0 / 0.15), 0px 1px 0.75px 0px rgb(0 0 0 / 0.05)",
      md: "0px 0.5px 3px 0px rgb(0 0 0 / 0.12), 0px 1px 2px 0px rgb(0 0 0 / 0.12), 0px 0.5px 1px 0px rgb(0 0 0 / 0.24)",
      tooltip: "0px 36px 100px 0px rgb(0 0 0 / 0.25), 0px 0px 3px 0px rgb(0 0 0 / 0.55)",
      menu: "0px 2px 4px 0px rgb(0 0 0 / 0.15), 0px 8px 15px 6px rgb(0 0 0 / 0.18)",
      "menu-border": "inset 0px 0.5px 1px 0px rbg(255 255 255 / 0.5)",
      checkbox: "inset 0px 1px 2px 0px rgb(0 0 0 / 0.1), inset 0px 0px 2px 0px rgb(0 0 0 / 0.1)",
      switch: "inset 0px 0px 1px 0px rgb(0 0 0 / 0.05), inset 0px 0px 2px 0.25px rgb(0 0 0 / 0.08)",
      field: "0px 0px 0px 0.5px rgba(0, 0, 0, 0.05), 0px 0.5px 2.5px 0px rgba(0, 0, 0, 0.3)",
      "segmented-control":
        "inset 0px 0px 2px 0px rgb(0 0 0 / 0.05), inset 0px 0px 4px 0px rgb(0 0 0 / 0.05), inset 0px 0px 2px 0px rgb(0 0 0 / 0.05)",
      progress:
        "inset 0px 1px 2px 0px rgba(0, 0, 0, 0.02), inset 0px 0px 2px 0px rgba(0, 0, 0, 0.03), inset 0px 0px 2px 0px rgba(0, 0, 0, 0.04)",
      "image-well": "inset 0px 0.5px 1.5px 0px rgb(0 0 0 / 0.14), 0px 0px 0px 1px rgb(0 0 0 / 0.06)",
    },
  },
  transformers: [transformerVariantGroup()],
});
