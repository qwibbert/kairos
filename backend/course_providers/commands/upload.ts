import { Confirm } from "@cliffy/prompt";
import { diffString } from "json-diff";
import { existsSync } from "node:fs";
import Pocketbase from "pocketbase";
import { info, panic, success } from "../utils.ts";

export default async function upload(
  backend_url: string,
  superuser_token: string,
) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc1NDIxNTkwNSwiaWQiOiI4Y2NvbmIwem45aDgxYWwiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.01Rjp_em94e9x7XeZw19P2R6ezUfuFlj84ekny1tU18";

  let client: Pocketbase | undefined;
  try {
    client = new Pocketbase(backend_url);
    client.authStore.save(token, null);

    // Test client
    await client.health.check();
  } catch {
    panic("Backend not reachable or invalid superuser token.");
  }

  if (!client) {
    panic("Backend not reachable or invalid superuser token.");
  }

  if (!existsSync("results/courses.json")) {
    panic("No courses.json found, please run the collect command first.");
  }

  // Retrieve courses from backend
  const courses_backend = await client.collection("courses")
    .getFullList();

  const institutions_string = await Deno.readTextFile("results/courses.json")
    .catch(
      () =>
        panic(
          "Failed to load courses.json file, is the program permitted to read the file?",
        ) as undefined,
    );
  const institutions_collected = JSON.parse(institutions_string);

  if (courses_backend.length >= 1) {
    await Deno.remove("results/diff.txt").catch(() => {});
    await Deno.writeTextFile(
      "results/diff.txt",
      diffString(courses_backend, institutions_collected.courses, { color: false }),
    ).catch(() => {
      panic("Failed to write diff file.");
    });
    info("Diff file written to results/diff.txt.");

    if (!await Confirm.prompt("Do you want to apply these changes?")) {
      panic('User aborted upload.')
    } 
  } else {
    info("Backend course catalog is empty, skipping course diffing.");
  }

  let updated = 0;
  let created = 0;

  for (const institution of institutions_collected) {
    for (const course of institution.courses) {
      const existing_course = courses_backend.find((c) =>
        c?.course_code == course.course_code
      );
      if (existing_course) {
        await client.collection("courses").update(
          existing_course.id,
          existing_course,
        );

        updated++;
      } else {
        const institution_backend = await client.collection("institutions")
          .getFirstListItem(`provider_id = "${institution.id}"`).catch(() =>
            undefined
          );

        if (institution_backend) {
          const new_course = await client.collection("courses").create({
            title: course.title,
            course_code: course.course_code,
            instructor: course.instructor,
            weight: course.weight ?? 0,
            institution: institution_backend.id,
          }).catch((e) =>
            panic(`Problem with uploading course: ${JSON.stringify(course)}, ${JSON.stringify({...e})}`)
          );
        } else {
          const new_institution = await client.collection("institutions")
            .create({
              name: institution.name,
              country: institution.country,
              country_code: institution.country_code,
              provider_id: institution.id,
            }).catch(() =>
              panic(
                `Problem with uploading institution: ${
                  JSON.stringify({ ...institution, courses: "..." })
                }`,
              )
            );
          const new_course = await client.collection("courses").create({
            title: course.title,
            course_code: course.course_code,
            instructor: course.instructor,
            weight: course.weight ?? 0,
            institution: new_institution.id,
          }).catch(() =>
            panic(`Problem with uploading course: ${JSON.stringify(course)}`)
          );
        }
        created++;
      }
    }
  }

  success(`Uploaded ${created} new courses and updated ${updated} existing ones.`);
}
