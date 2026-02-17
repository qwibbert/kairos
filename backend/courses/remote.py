import json
import logging

import requests
from rich.progress import Progress

from provider import Provider


class Remote:
    def __init__(self):
        creds = load_creds()
        self.url = creds["url"]
        self.token = creds["token"]

    def fetch_courses(self, provider_id, force: bool):
        """Fetch courses from remote database."""
        provider_o = Provider(provider_id)

        r = requests.get(
            url=f'{self.url}/api/collections/institutions/records?filter=provider_id="{provider_id}"',
            headers={"Authorization": self.token},
        )

        if r.status_code == 400:
            raise Exception(
                "Could not retreive provider entry from remote database: invalid filter entry."
            )

        try:
            provider = r.json().get("items")[0]
        except IndexError:
            logging.warning(
                f"No remote dataset present for {provider_id}, skipping fetch procedure"
            )
            return

        provider_year = provider.get("academic_year")
        if provider_o.remote_present(provider_year):
            if force:
                logging.info(
                    f"Remote dataset for year {provider_year} of {provider_id} already present, overwriting as force flag is present."
                )
            else:
                logging.warning(
                    f"Remote dataset for year {provider_year} of {provider_id} already present, skipping fetch procedure."
                )
                return

        logging.debug(
            f"Found remote provider for {provider_id}, up-to-date for {provider_year}."
        )

        total = None
        page = 1
        page_size = 30
        results = []

        with Progress() as progress:
            logging.info(f"Started course fetching for {provider_id}.")
            fetch_task = progress.add_task(f"Fetching courses for {provider_id}...")

            while not progress.finished:
                r = requests.get(
                    url=f'{self.url}/api/collections/courses/records?page={page}&skipTotal={"false" if total is None else "true"}&filter=institution.provider_id="{provider_id}"',
                    headers={"Authorization": self.token},
                )

                if r.status_code == 400:
                    raise Exception(
                        f"Failed to fetch remote courses for {provider_id}: invalid filter expression."
                    )

                courses_json = r.json()

                if total is None:
                    total = courses_json.get("totalItems")
                    logging.info(f"Found {total} courses for {provider_id}.")
                    progress.update(fetch_task, total=total)

                courses = courses_json.get("items")

                for course in courses:
                    results.append(
                        {
                            "title": course.get("title"),
                            "instructor": course.get("instructor"),
                            "weight": course.get("weight"),
                            "course_code": course.get("course_code"),
                        }
                    )
                    logging.debug(
                        f"Found course {course.get('course_code')}:{course.get('title')} for {provider_id}."
                    )
                    progress.update(fetch_task, advance=1)

                if len(courses) < page_size:
                    break
                else:
                    page += 1

        logging.info(f"Fetch process finished for {provider_id}.")
        return results, provider_year


def store_creds(url: str, token: str):
    with open("creds.json", "w") as creds:
        json.dump({"url": url, "token": token}, creds)


def load_creds() -> dict | None:
    try:
        with open("creds.json", "r") as creds:
            return json.load(creds)
    except OSError as e:
        logging.error(
            "Credential file not present, please connect to the remote first using `remote connect URL TOKEN`"
        )
        raise e
