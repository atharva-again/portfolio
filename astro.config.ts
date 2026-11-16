import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

export default defineConfig({
  srcDir: "./app",
  output: "static",
  site: "https://atharvaverma.com",
  integrations: [mdx()],
});
