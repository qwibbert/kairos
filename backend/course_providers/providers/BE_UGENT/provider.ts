// NOTE: This code is heavily influenced by the web scraper implemented by the Studium project (https://gitlab.com/vtkgent/studium/backend/-/tree/develop/scraper?ref_type=heads).
// NOTE: Many thanks to them for making their code public.

import { Confirm } from "@cliffy/prompt";
import Kia from "https://deno.land/x/kia@0.4.1/mod.ts";
import { warn } from "node:console";
import { existsSync } from "node:fs";
import puppeteer, { Page } from "puppeteer";
import { Course } from "../../types.ts";
import { CourseRef, Program } from "./types.ts";

export default async function run(
  year: string,
  options: { verbose: boolean } = { verbose: false },
  spinner: Kia,
  path: string
) {
  // Constants
  const DOMAIN = "https://studiekiezer.ugent.be";
  const ROOT_URL =
    `${DOMAIN}/nl/zoek?zt=&aj=${year}&voMa=&voPB=&voAB=`;


  if (existsSync(`${path}/courses-${year}.json`)) {
    if (await Confirm.prompt(`Output file already exists for BE_UGENT, do you want to overwrite this file?`)) {
      await Deno.remove(`${path}/courses-${year}.json`);
    } else {
      warn('User aborted BE_UGENT provision.');
      return;
    }
  }

  // Browser setup
  const browser_spinner = new Kia();
  if (options.verbose) {
    spinner.stop();
    browser_spinner.start('Initialising browser');
  }

  let browser: puppeteer.Browser | undefined;
  let page: puppeteer.Page | undefined;
  let total_study_programs: number | undefined;

  try {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 1366 });
    await page.goto(ROOT_URL);
    total_study_programs = Number(
      await (await page.waitForSelector("#aantalResultatenLabel"))?.evaluate((
        el,
      ) => el.getAttribute("data-aantal")),
    );
  } catch {
    browser_spinner.fail("Failed to initialise browser!");
    return;
  }

  if (!browser || !page || !total_study_programs) {
    if (options.verbose) {
        browser_spinner.fail("Failed to initialise browser!");
    }
    throw undefined;
  } else {
    if (options.verbose) {
        browser_spinner.succeed("Browser initialised!");
    }
  }
  
  // Retrieve data chunks
  const program_spinner = new Kia();

  if (options.verbose) {
    program_spinner.start('Started course fetch.');
  }

  const chunk_count = Math.floor(total_study_programs / 20);
  const chunks = [];
  const programs: Program[] = [];
  const courses: Course[] = [];
  spinner.set(`Running provider for Universiteit Gent [${programs.length}/${total_study_programs}]`);
  for (let i = 0; i < chunk_count; i++) {
    const selector = "#lazyLoadedChunk" + i;

    const chunk = await (await page.waitForSelector(selector))?.evaluate((el) =>
      el.getAttribute("data")
    );

    chunks.push(chunk);
  }

  for (const chunk of chunks) {
    if (chunk) {
      await process_chunk(page, chunk, program_spinner);
    } else {
      throw new Error(`Failed to process chunk: ${chunk}`);
    }
  }

  if (options.verbose) {
    program_spinner.succeed(`Fetched ${programs.length} programs and ${courses.length} courses.`);
  }

  const course_string = JSON.stringify(courses);
  await Deno.writeTextFile(`${path}/courses-${year}.json`, course_string);

  async function process_chunk(page: Page, chunk: string, program_spinner: Kia) {
    const search_url =
      `https://studiekiezer.ugent.be/nl/incrementalsearch?target=zoek&ids=${chunk}`;
    await page.goto(search_url);

    const program_urls = await page.$$eval(".clickableDiv", (elements) => {
      return elements.map((el) => el.getAttribute("href"));
    });

    for (const url of program_urls) {
      if (url) {
        await process_program(page, DOMAIN + url.slice(2), program_spinner);
      } else {
        throw new Error("Could not process url: " + url);
      }
    }
  }

  async function process_program(page: Page, study_url: string, program_spinner: Kia) {
    await page.goto(study_url);

    const study_title = await page.$eval("#titleLabel", (el) => el.textContent);

    if (study_title == undefined) {
      throw new Error("Could not process study, title is undefined");
    }

    if (options.verbose) {
        program_spinner.start(`Processing program ${study_title} [${programs.length}/${total_study_programs}]`);
    }

    const refs = await process_courses(page, study_url, study_title, program_spinner);

    programs.push({
      id: crypto.randomUUID(),
      title: study_title,
      courses: refs,
    });

    spinner.set(`Running provider for Universiteit Gent [${programs.length}/${total_study_programs}]`);

    if (options.verbose) {
        program_spinner.succeed();
    }
  }

  async function process_courses(
    page: Page,
    study_url: string,
    study_title: string,
    program_spinner: Kia,
  ): Promise<CourseRef[]> {
    await page.goto(study_url + "/programma");

    const program_courses = await page.$$eval("tbody > tr", (elements) => {
      return elements.map((el) => {
        const title = el.children[0]?.children[0]?.children[0]?.textContent;
        const course_code =
          el.children[0]?.children[0]?.children[0]?.children[0]?.getAttribute(
            "title",
          ) ?? undefined;
        const year = el.children[2]?.children[0]?.children[0]?.textContent;
        const semester = el.children[3]?.children[0]?.children[0]?.children[0]
          ?.textContent;
        const language = el.children[4]?.children[0]?.children[0]?.children[0]
          ?.textContent;
        const instructor = el.children[5]?.children[0]?.children[0]
          ?.textContent;
        const weight = el.children[6]?.children[0]?.children[0]?.textContent;

        if (title && year && semester && language && instructor && weight) {
          return {
            id: "",
            title: title.trim(),
            course_code,
            study_year: Number(year),
            semester: semester == "sem 1"
              ? "1"
              : semester == "sem 2"
              ? "2"
              : semester == "jaar"
              ? "YEAR"
              : "OTHER",
            instructor,
            language,
            weight: Number(weight),
          };
        }
      });
    });

    const refs: CourseRef[] = [];
    for (const course of program_courses) {
      if (course == undefined) continue;

      const course_found = courses.find((course_entry) => {
        if (
          course.title == course_entry.title &&
          course.course_code == course_entry.course_code &&
          course.language == course_entry.language &&
          course.instructor == course_entry.instructor &&
          course.weight == course_entry.weight
        ) {
          return true;
        }
      });

      if (!course_found) {
        courses.push({
          id: crypto.randomUUID(),
          course_code: course.course_code,
          title: course.title,
          instructor: course.instructor,
          weight: course.weight,
          language: course.language,
        });
      }

      const course_ref_found = refs.find((entry) => {
        if (
          (course_found
            ? course_found.id
            : courses[courses.length - 1]?.id ?? "") == entry.id
        ) {
          return true;
        }
      });

      if (!course_ref_found) {
        refs.push({
          id: course_found
            ? course_found.id
            : courses[courses.length - 1]?.id ?? "",
          semester: course.semester == "1"
            ? 1
            : course.semester == "2"
            ? 2
            : course.semester == "YEAR"
            ? "YEAR"
            : "OTHER",
          program_year: course.study_year,
        });
      }
    }

    return refs;
  }

  await browser.close();
}
