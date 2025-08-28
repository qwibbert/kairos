import { Confirm } from "@cliffy/prompt";
import { existsSync } from "node:fs";
import { panic, provider_to_id, success, warn } from "../utils.ts";
import list from "./list.ts";

export default async function collect(
  options: { force: boolean } = { force: false },
) {
  const provider_list = await list();
  const date = new Date();

  if (!provider_list) {
    panic("No providers found.");
  }

  if (
    provider_list.filter((p) => !p.up_to_date).length != 0 && !options.force
  ) {
    panic(
      "Found outdated providers: use the list command to check or append --force flag to suppress this message",
    );
  }

  const courses_per_institutions = [];
  let course_count = 0;

  for (const provider of provider_list) {
    const id = provider_to_id(provider);

    let file = "";
    const path = import.meta.dirname + "/../providers/" + id;
    let manifest: object | undefined;

    const courses = [];

    for await (
      const entry of Deno.readDir(path)
    ) {
      if (!entry.isFile) {
        continue;
      }

      if (entry.name == 'manifest.json') {
        manifest = JSON.parse(await Deno.readTextFile(path+'/manifest.json'));
      }

      const year = Number(entry.name.split(".")[0].split("-")[1] ?? "0");

      if (
        date.getUTCMonth() < provider.sem_start &&
        year == (date.getUTCFullYear() - 1)
      ) {
        file = entry.name;
      } else if (
        date.getUTCMonth() >= provider.sem_start &&
        year == date.getUTCFullYear()
      ) {
        file = entry.name;
      }

      if (!file) {
        continue;
      }

      if (year) {        
        for (const course of JSON.parse(await Deno.readTextFile(path + '/' + file))) {
            if (courses.find(c => c.course_code == course.course_code)) {
              warn(`Deduplicated ${course.title} (${course.course_code})`)
              continue;
            }
            courses.push(course);
            course_count++;
        }
      } else {
        continue;
      }
    }

    if (!file) {
      panic(`Did not find a relevant courses.json file for ${id}`);
    }

    courses_per_institutions.push({id, name: manifest.name, country: manifest.country, country_code: manifest.alpha_two_code , courses});
  }

  await Deno.mkdir('results').catch(e => {
    if (e instanceof Deno.errors.AlreadyExists) {
      return;
    }

    throw e;
  });

  if (existsSync('results/courses.json')) {
    if (await Confirm.prompt('Output file already exists, do you want to overwrite?')) {
      await Deno.remove('results/courses.json');
    } else {
      warn('User aborted collect procedure.');
      return;
    }
  }

  await Deno.writeTextFile('results/courses.json', JSON.stringify(courses_per_institutions)).catch(e => {
    if (e instanceof Deno.errors.AlreadyExists) {
      panic('courses.json already exists, aborting operation!');
    }
  });

  success(`Aggregated ${course_count} course${course_count == 1 ? '' : 's'}.`);
}
