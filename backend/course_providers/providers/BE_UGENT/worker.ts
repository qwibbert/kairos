import { initializeWorker } from "https://deno.land/x/workerpool/mod.ts";

initializeWorker({
  execute: async (payload: string) => {
    // Simulate async actions
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return `Worker echo: ${payload}`;
  },
});