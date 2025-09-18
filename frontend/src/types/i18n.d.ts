// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import vines from "../locales/en/vines.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "vines";
    // custom resources type
    resources: {
      ns1: typeof vines;
    };
    // other
  }
}