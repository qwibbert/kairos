import Kia from "https://deno.land/x/kia@0.4.1/mod.ts";
import { info, panic, parse_provider, provider_to_id, success } from "../utils.ts";
import list from "./list.ts";

export async function run(provider?: string | undefined, options: {force: boolean, verbose: boolean} = { force: false, verbose: false }) {
    const provider_info = provider ? await parse_provider(provider) : undefined;

    if (provider && !provider_info) {
        panic(`No such provider.`);
    }

    const provider_list = await list();
    
    if (!provider_list) {
        panic('No providers found.');
    }

    const provider_list_filtered = provider_list.filter(p => {
        if (provider) {
            return (options.force || !p.up_to_date) && p.name == provider_info.name
        } else {
            return options.force || !p.up_to_date;
        }
        
    });

    if (provider_list_filtered.length == 0) {
        return success('Up to date!')
    }


    info(`Will run ${provider_list_filtered.length} providers ${options.force ? 'forcefully' : ''}!`);

    for (const provider_to_run of provider_list_filtered) {
        const spinner = new Kia();
        const date = new Date();

        try {
            spinner.start(`Running provider for ${provider_to_run.name}`);
            const path = `${import.meta.dirname}/../providers/${provider_to_id(provider_to_run)}`;

            const provider_code = await import(path+'/provider.ts');

            // We only want to update the course list if the academic year has already been started
            const year = provider_to_run.sem_start > date.getUTCMonth() ? date.getUTCFullYear() - 1 : date.getUTCFullYear();

            try {
                await provider_code.default(year, { verbose: options.verbose }, spinner, path);
            } catch {
                spinner.fail(`Running provider for ${provider_to_run.name}: failed`);
                continue;
            }

            spinner.succeed(`Running provider for ${provider_to_run.name}: succeeded in ${formatDuration(Date.now() - date.getTime())}`);
        } catch (e) {
            console.error(e);
            panic(`Could not give control to ${provider_to_id(provider_to_run)}, please make sure provider.ts exists and contains a default exported async function.`)
        }
    }
}

const formatDuration = ms => {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000
  };
  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
};
