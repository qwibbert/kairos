import { readdir } from "node:fs/promises";
import { info, panic, parse_provider, Provider, warn } from "../utils.ts";

export default async function list(as_command: boolean = false): Promise<Provider[] | undefined> {
  const providers = await readdir(import.meta.dirname + "/../providers", {
    withFileTypes: true,
  });
  const providers_array = [];

  for (const provider of providers) {
    if (!provider.isDirectory()) {
      panic(`${provider.name} is not a valid provider`);
    }

    const provider_parsed = await parse_provider(provider.name);
    providers_array.push({ id: provider.name, ...provider_parsed });
  }

  if (as_command) {
    const outdated = providers_array.filter((p) =>
      p.up_to_date == false
    ).length;
    info(
      `Found ${providers_array.length} provider${
        providers_array.length != 1 ? "s" : ""
      }`,
    );

    if (outdated > 0) {
      warn(`Found ${outdated} outdated provider${outdated != 1 ? "s" : ""}.`);
    }
    console.table(providers_array, [
      "id",
      "name",
      "country_code",
      "country",
      "sem_start",
      "up_to_date",
    ]);
  } else {
    return providers_array;
  }
}
