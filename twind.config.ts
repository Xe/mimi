import { defineConfig, Preset } from "https://esm.sh/@twind/core@1.1.3";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";
import presetAutoprefix from "https://esm.sh/@twind/preset-autoprefix@1.0.7";
import presetTypography from "https://esm.sh/@twind/preset-typography";

export default {
  selfURL: import.meta.url,
  ...defineConfig({
    presets: [
      presetTailwind() as Preset,
      presetAutoprefix(),
      presetTypography(),
    ],
    theme: {
      fontFamily: {
        sans: ["Iosevka Aile Iaso", "sans-serif"],
        mono: ["Iosevka Curly Iaso", "monospace"],
        serif: ["Iosevka Etoile Iaso", "serif"],
      },
    },
    preflight: {
      "@import": [
        'url("https://cdn.xeiaso.net/static/css/iosevka/family.css");',
      ],
      "::selection": {
        "background-color": "#000",
        "color": "#fff",
      },
      "body": { "background-color": "rgb(253,252,254)" },
      "@media (prefers-color-scheme: dark)": {
        "body": { "background-color": "rgba(23,21,31)" },
        "::selection": {
          "background-color": "#fff",
          "color": "#000",
        },
      },
    },
  }),
};
