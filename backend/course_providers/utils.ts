import chalk from "chalk";
import { readdir } from "node:fs/promises";

const country_code_pattern = new RegExp(/^(A[DEFGLMOQRSTUWXZ]|B[ABDEFGHIJLMNORSTVWYZ]|C[ACDFGHIKLMNORUVWXYZ]|D[EJKMOZ]|E[CEGHRST]|F[IJKMOR]|G[ABDFGHILMNPQRSTUWY]|H[KMNRTU]|I[DELMNOQRST]|J[EMOP]|K[EGHIMNPRWYZ]|L[ABCIKRSUVY]|M[ACDFGHKLMNOPQRSTUVWXYZ]|N[ACEFGILOPRUZ]|O[M]|P[APRWYZ]|L[ABCIKRSUVY]|M[ACDFGHKLMNOPQRSTUVWXYZ]|N[ACEFGILOPRUZ]|O[M]|P[AEFGHKLMNRSTWY]|Q[A]|R[EOSW]|S[ABCDEGHIJLMNORSTVXYZ]|T[CDFGHJKLMNORTVWZ]|U[AGMSYZ]|V[ACEGINU]|W[FS]|X[]|Y[ET]|Z[AMW])$/gm)

export interface Provider {
    name: string,
    country_code: string,
    country: string,
    state_province: string,
    domains: string[],
    sem_start: number,
    up_to_date: boolean
}

export async function parse_provider(provider: string): Promise<Provider> {
    const path = import.meta.dirname + '/providers/' + provider;

    const provider_folder = await readdir(path);

    let provider_info = { name: '', country: '', country_code: '', state_province: '', domains: [], sem_start: 1, up_to_date: false } as Provider;

    // Check manifest file
    try {
        const manifest = await Deno.readTextFile(path + '/manifest.json');
        const manifest_parsed = JSON.parse(manifest);

        if (!manifest_parsed.name) {
            panic(`${provider} does not provide a valid name in manifest`);
        } else if (!manifest_parsed.country) {
            panic(`${provider} does not provide a valid country in manifest`);
        } else if (!manifest_parsed.alpha_two_code || !country_code_pattern.test(manifest_parsed.alpha_two_code)) {
            panic(`${provider} does not provide a valid ISO-3166 country-code in manifest`);
        } else if (!manifest_parsed.domains) {
            panic(`${provider} does not provide valid domains in manifest`);
        } else if (!manifest_parsed.sem_start || manifest_parsed.sem_start > 12 || manifest_parsed.sem_start < 1) {
            panic(`${provider} does not provide a valid semester start month in manifest`);
        }

        provider_info.name = manifest_parsed.name;
        provider_info.country = manifest_parsed.country;
        provider_info.country_code = manifest_parsed.alpha_two_code;
        provider_info.state_province = manifest_parsed["state-province"];
        provider_info.domains = manifest_parsed.domains;
        provider_info.sem_start = manifest_parsed.sem_start;
    } catch {
        panic(`${provider} does not contain a valid manifest`);
    }

    // Check folder name 
    try {
        const [country_code, domain] = provider.split('_');

        if (country_code?.toLowerCase() != provider_info.country_code.toLowerCase() || domain?.toLowerCase() != provider_info.domains[0]?.split('.')[0]?.toLowerCase()) {
            throw '';
        }
    } catch {
        panic(`${provider} folder format incorrect`);
    }


    const date = new Date();
    if ((date.getUTCMonth() >= provider_info.sem_start && provider_folder.includes(`courses-${date.getUTCFullYear()}.json`))
        || (date.getUTCMonth() < provider_info.sem_start && provider_folder.includes(`courses-${date.getUTCFullYear() - 1}.json`))) {
        return { ...provider_info, up_to_date: true };
    } else {
        return { ...provider_info, up_to_date: false };
    }
}

export function provider_to_id(provider: Provider): string {
    return `${provider.country_code.toUpperCase()}_${provider.domains[0]?.split('.')[0]?.toUpperCase()}`
}

export function panic(reason: string) {
    console.log(chalk.bgRed(' ' + chalk.redBright('PANIC') + ' ') + chalk.bgBlack('  ' + chalk.whiteBright(reason) + ' '));

    throw undefined;
}

export function warn(message: string) {
    console.warn(chalk.bgYellow(' ' + chalk.yellowBright('WARNING') + ' ') + chalk.bgBlack('  ' + chalk.whiteBright(message) + ' '));
}

export function success(message: string) {
    console.info(chalk.bgGreen(' ' + chalk.greenBright('SUCCESS') + ' ') + chalk.bgBlack('  ' + chalk.whiteBright(message) + ' '));
}

export function info(message: string) {
    console.log(chalk.bgBlue(' ' + chalk.blueBright('INFO') + ' ') + chalk.bgBlack('  ' + chalk.whiteBright(message) + ' '));
}