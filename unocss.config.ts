import { defineConfig } from "unocss/vite";
import presetWebFonts from "unocss/preset-web-fonts";
import presetUno from "unocss/preset-uno";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "google", // default provider
      fonts: {
        sans: "Roboto",
      },
    }),
  ],
  transformers: [transformerVariantGroup()],
});
