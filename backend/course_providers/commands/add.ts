import { Checkbox, prompt, Select } from "@cliffy/prompt";
import { panic, success } from "../utils.ts";

interface APIUniversity {
  name: string;
  country: string;
  alpha_two_code: string;
  "state-province": string | null;
  web_pages: string[];
  domains: string[];
}

export default async function add(domain: string) {
  let university_response: APIUniversity[] | undefined = undefined;

  // Look up domain using universities api
  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?domain=${domain}`,
    );
    university_response = (await response.json()) as APIUniversity[];

    if (!university_response || !(university_response instanceof Array)) {
      throw undefined;
    }
  } catch (e) {
    console.log(e);
    panic(
      "Could connect to the universities API, please make sure you are connected to the internet.",
    );
  }

  if (university_response!.length == 0) {
    panic(`No results for ${domain}`);
  }

  let selected_university = university_response![0];
  let sem_start = 1;
  if (university_response!.length > 2) {
    const result = await prompt([{
      name: "institution",
      message: "Select an institution.",
      type: Checkbox,
      options: university_response?.map((res: APIUniversity) => {
        return {
          name: res.name ?? "",
          value: res,
        };
      }) ?? [],
      maxOptions: 1,
    }]);

    if (!result.institution) {
      panic("Please select all the required information.");
    }
    selected_university = result.institution as APIUniversity;
  }

  sem_start = await prompt([{
    name: "sem_start",
    message: "Select the start month of the first semester.",
    type: Select,
    options: [
      { name: "January", value: "1" },
      { name: "February", value: "2" },
      { name: "March", value: "3" },
      { name: "April", value: "4" },
      { name: "May", value: "5" },
      { name: "June", value: "6" },
      { name: "July", value: "7" },
      { name: "August", value: "8" },
      { name: "September", value: "9" },
      { name: "October", value: "10" },
      { name: "November", value: "11" },
      { name: "December", value: "12" },
    ],
  }]).then((res) => Number(res.sem_start[0]));

  const folder_name = `${selected_university!.alpha_two_code.toUpperCase()}_${
    selected_university!.domains[0]?.split(".")[0]?.toUpperCase()
  }`;
  const path = `${import.meta.dirname}/../providers/${folder_name}/`;
  try {
    await Deno.mkdir(path);
    await Deno.create(path + "manifest.json");
    await Deno.writeTextFile(
      path + "manifest.json",
      JSON.stringify({
        name: selected_university!.name,
        country: selected_university!.country,
        country_code: selected_university!.alpha_two_code,
        state_province: selected_university!["state-province"],
        domains: selected_university!.domains,
        web_pages: selected_university!.web_pages,
        sem_start,
      }),
    );

    await Deno.create(path + "provider.ts");
    await Deno.writeTextFile(path + "provider.ts", "");
  } catch (e) {
    console.error(e);
    panic(
      `Could not write new provider to disk, please ensure that this program has write permission for providers folder.`,
    );
  }

  success(`Succesfully added new provided for ${selected_university.name}`);
}
