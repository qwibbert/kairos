import csv
import importlib.util
import json
import logging
import os
from os.path import exists

import polars as pl
import requests
import rich
from rich.console import Console
from rich.progress import track
from rich.table import Table


class CourseDiff:
    def __init__(self, a_path: str, b_path: str, b_year: str):
        """Creates a CourseDiff object comparing a previous academic year with a more recent academic year. Expects the paths of the corresponding csv files"""
        self.b_year = b_year

        logging.debug(f"Reading {a_path}.")
        try:
            courses_a = pl.read_csv(
                a_path,
                has_header=False,
                schema={
                    "title": pl.String,
                    "instructor": pl.String,
                    "weight": pl.UInt8,
                    "course_code": pl.String,
                },
            )
        except pl.exceptions.NoDataError:
            courses_a = pl.DataFrame(
                data=None,
                schema={
                    "title": pl.String,
                    "instructor": pl.String,
                    "weight": pl.UInt8,
                    "course_code": pl.String,
                },
            )
        logging.debug(f"Reading {b_path}.")
        try:
            courses_b = pl.read_csv(
                b_path,
                has_header=False,
                schema={
                    "title": pl.String,
                    "instructor": pl.String,
                    "weight": pl.UInt8,
                    "course_code": pl.String,
                },
            )
        except pl.exceptions.NoDataError:
            courses_b = pl.DataFrame(
                data=None,
                schema={
                    "title": pl.String,
                    "instructor": pl.String,
                    "weight": pl.UInt8,
                    "course_code": pl.String,
                },
            )

        self.new_courses = self._new_courses(courses_a, courses_b)
        self.removed_courses = self._removed_courses(courses_a, courses_b)
        self.title_diff = self._compare_titles(courses_a, courses_b)
        self.instructor_diff = self._compare_instructors(courses_a, courses_b)
        self.weight_diff = self._compare_weights(courses_a, courses_b)

    def digest(self):
        """Prints a digest of the difference between dataset a and b"""
        console = Console()

        self._print_new_courses(self.new_courses, console)
        self._print_removed_courses(self.removed_courses, console)
        self._print_title_diff(self.title_diff, console)
        self._print_instructor_diff(self.instructor_diff, console)
        self._print_weight_diff(self.weight_diff, console)

    def _new_courses(self, courses_a: pl.DataFrame, courses_b: pl.DataFrame):
        """Returns courses not present in dataset a and present in dataset b."""
        join = courses_b.join(courses_a, on="course_code", how="anti")

        logging.info(f"Found {len(join)} new courses when comparing a with b.")

        return join

    def _removed_courses(
        self, courses_a: pl.DataFrame, courses_b: pl.DataFrame
    ) -> pl.DataFrame:
        """Returns courses present in dataset a and missing in dataset b."""
        join = courses_a.join(courses_b, on="course_code", how="anti")

        logging.info(f"Found {len(join)} removed courses when comparing a with b.")

        return join

    def _compare_titles(self, courses_a: pl.DataFrame, courses_b: pl.DataFrame):
        """Returns courses where course titles diff between dataset a and b."""
        join = (
            courses_a.join(courses_b, on="course_code", how="inner", suffix="_b")
            .select(pl.col("course_code"), pl.col("title"), pl.col("title_b"))
            .filter(pl.col("title") != pl.col("title_b"))
        )

        logging.info(f"Found {len(join)} changed titles when comparing a with b.")

        return join

    def _compare_instructors(self, courses_a: pl.DataFrame, courses_b: pl.DataFrame):
        """Returns courses where instructors differ between dataset a and b."""
        join = (
            courses_a.join(courses_b, on="course_code", how="inner", suffix="_b")
            .select(
                pl.col("course_code"),
                pl.col("instructor"),
                pl.col("instructor_b"),
            )
            .filter(pl.col("instructor") != pl.col("instructor_b"))
        )
        logging.info(f"Found {len(join)} changed instructors when comparing a with b.")
        return join

    def _compare_weights(self, courses_a: pl.DataFrame, courses_b: pl.DataFrame):
        """Returns courses where weights differ between dataset a and b."""
        join = (
            courses_a.join(courses_b, on="course_code", how="inner", suffix="_b")
            .select(
                pl.col("course_code"),
                pl.col("weight"),
                pl.col("weight_b"),
            )
            .filter(pl.col("weight") != pl.col("weight_b"))
        )
        logging.info(
            f"Found {len(join)} changed course weights when comparing a with b."
        )
        return join

    def _print_new_courses(self, new_courses: pl.DataFrame, console: Console):
        """Prints a new_courses dataframe to the console"""
        table = Table(title=f"New Courses ({len(new_courses)})", expand=True)

        table.add_column("Course Code")
        table.add_column("Title")
        table.add_column("Instructor")
        table.add_column("Weight")

        for course in new_courses.rows(named=True):
            table.add_row(
                course["course_code"],
                course["title"],
                course["instructor"],
                str(course["weight"]),
            )

        console.print(table)

    def _print_removed_courses(self, removed_courses: pl.DataFrame, console: Console):
        """Prints a removed_courses dataframe to the console"""
        table = Table(title=f"Removed Courses ({len(removed_courses)})", expand=True)

        table.add_column("Course Code")
        table.add_column("Title")
        table.add_column("Instructor")
        table.add_column("Weight")

        for course in removed_courses.rows(named=True):
            table.add_row(
                course["course_code"],
                course["title"],
                course["instructor"],
                str(course["weight"]),
            )

        console.print(table)

    def _print_title_diff(self, title_diff: pl.DataFrame, console: Console):
        """Prints a title_diff dataframe to the console"""
        table = Table(title=f"Changed Course Titles ({len(title_diff)})", expand=True)

        table.add_column("Course Code")
        table.add_column("Old Title", style="red")
        table.add_column("New Title", style="green")

        for course in title_diff.rows(named=True):
            table.add_row(course["course_code"], course["title"], course["title_b"])

        console.print(table)

    def _print_instructor_diff(self, instructor_diff: pl.DataFrame, console: Console):
        """Prints a instructor_diff dataframe to the console"""
        table = Table(
            title=f"Changed Instructors ({len(instructor_diff)})", expand=True
        )

        table.add_column("Course Code")
        table.add_column("Old Instructor", style="red")
        table.add_column("New Instructor", style="green")

        for course in instructor_diff.rows(named=True):
            table.add_row(
                course["course_code"], course["instructor"], course["instructor_b"]
            )

        console.print(table)

    def _print_weight_diff(self, weight_diff: pl.DataFrame, console: Console):
        """Prints a weight_diff dataframe to the console"""
        table = Table(title=f"Changed Weights ({len(weight_diff)})", expand=True)

        table.add_column("Course Code")
        table.add_column("Old Weight", style="red")
        table.add_column("New Weight", style="green")

        for course in weight_diff.rows(named=True):
            table.add_row(
                course["course_code"], str(course["weight"]), str(course["weight_b"])
            )

        console = Console()
        console.print(table)


class ErrorProviderNotExist(Exception):
    def __init__(self, provider):
        super().__init__(f"Attempted to load the non-existing provider {provider}.")


class ErrorProviderNoMain(Exception):
    def __init__(self, provider):
        super().__init__(
            f"Attempted to load provider {provider}, which does not contain a main function."
        )


class ErrorResultsAlreadyPresent(Exception):
    def __init__(self, provider, year):
        super().__init__(
            f"Aborted while starting processing of {provider}, courses for {year} are already present. Override using --force flag."
        )


class ErrorResultsNotPresent(Exception):
    def __init__(self, provider, year):
        super().__init__(
            f"Aborted while loading courses for {year} from {provider} as these are not present. Please run the provider with --year {year}"
        )


class ErrorRemoteNotPresent(Exception):
    def __init__(self, provider):
        super().__init__(
            f"Aborted while loading remote courses for {provider} as these are not present. Please fetch the remote courses first."
        )


class Provider:
    def __init__(self, id: str = ""):
        """Initialises provider with given name. Loads manifest file and provider script."""
        if os.path.pardir == "providers":
            self.path = "."
        elif id:
            self.path = f"providers/{id}"
        else:
            raise ErrorProviderNotExist(id)

        if not os.path.exists(self.path):
            raise ErrorProviderNotExist(id)

        logging.debug(f"Loading {self.path}/manifest.json.")
        with open(self.path + "/manifest.json") as manifest:
            manifest = json.load(manifest)

        self.id = manifest.get("id")
        self.name = manifest.get("name")
        self.country = manifest.get("country")
        self.country_code = manifest.get("country_code")
        self.state_province = manifest.get("state_province")
        self.domains = manifest.get("domains")
        self.web_pages = manifest.get("web_pages")
        self.academic_year_start = manifest.get("academic_year_start")

        logging.debug(f"Loaded provider {self.id}:{self.name}:{self.country}")

        # Loading script file requires full length path
        provider_script = f"{os.getcwd()}/{self.path}/provider.py"

        # TODO: should have a clearer error message
        if not os.path.exists(provider_script):
            raise ErrorProviderNotExist(id)

        spec = importlib.util.spec_from_file_location("provider", provider_script)
        self.provider_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.provider_module)

        logging.debug(f"Loaded provider module {provider_script}.")

    def __eq__(self, value: object) -> bool:
        if isinstance(value, str):
            if self.name == value:
                return True
        return False

    def current_academic_year(self) -> str:
        """Get the current academic year for this provider."""
        return self.provider_module.latest_academic_year()

    def is_uptodate(self) -> bool:
        """Check if the provider already has the course dataset for the current academic year."""
        latest_year = self.current_academic_year()

        return self.course_dataset_present(latest_year)

    def run(self, year: str | None, force=False):
        """Runs the provider script. Accepts a force argument which will ignore any datasets already present and a year argument for fetching the course dataset for a given year."""
        if not year:
            year = self.current_academic_year()
            logging.debug(f"Provider year not provided, using {year} as default.")

        if self.course_dataset_present(year):
            if force:
                logging.info("Results already present but force flag provided.")
            else:
                raise ErrorResultsAlreadyPresent(self.id, year)

        # Provider module should expose a main function to be invoked.
        if hasattr(self.provider_module, "main"):
            results, year = self.provider_module.main(year)
            self.save_results(results, year)
            return results

        else:
            raise ErrorProviderNoMain(self.name)

    def course_dataset_present(self, year):
        """Check if course dataset is present for a given year."""
        if exists(self.path + f"/courses-{year}.csv"):
            return True
        else:
            return False

    def remote_present(self, year):
        """Check if remote course dataset is present for a given year."""
        if exists(self.path + f"/remote-{year}.csv"):
            return True
        else:
            return False

    def save_results(self, courses: str, year: str, remote=False):
        """Saves course iterable to a csv file for the specified year."""
        path = self.path + f"/{'remote' if remote else 'courses'}-{year}.csv"

        logging.debug(f"Writing course csv to {path}.")

        with open(
            self.path + f"/{'remote' if remote else 'courses'}-{year}.csv",
            "w",
            newline="",
        ) as results_file:
            writer = csv.writer(
                results_file,
            )

            for course in courses:
                writer.writerow(course.values())

    def read_courses(self, year):
        """Reads course database from csv file for the specified year."""
        if self.course_dataset_present(year):
            courses = []

            path = self.path + f"/courses-{year}.csv"
            logging.debug(f"Reading courses from {path}.")
            with rich.progress.open(path, "r", newline="") as courses_file:
                reader = csv.reader(
                    courses_file,
                )

                for course in reader:
                    courses.append(course)

            return courses
        else:
            raise ErrorResultsNotPresent(self.name, year, False)

    def compare_courses(
        self, a: str, b: str, a_remote=False, b_remote=False
    ) -> CourseDiff:
        """Compares course or remote dataset for year a with course or remote dataset for year b."""
        if not self.course_dataset_present(a):
            raise ErrorResultsNotPresent(self.id, a, False)

        if not b_remote and not self.course_dataset_present(b):
            raise ErrorResultsNotPresent(self.id, b, False)

        if b_remote and not self.remote_present(b):
            raise ErrorRemoteNotPresent(self.id)

        if a_remote and not self.remote_present(a):
            raise ErrorRemoteNotPresent(self.id)

        a_path = f"{self.path}/{'remote' if a_remote else 'courses'}-{a}.csv"
        b_path = f"{self.path}/{'remote' if b_remote else 'courses'}-{b}.csv"

        logging.debug(f"Comparing {a_path} with {b_path}.")

        diff = CourseDiff(a_path, b_path, b)

        return diff

    def upload(self, remote, course_diff: CourseDiff):
        """Makes remote database reflect the changes in course_diff."""
        # Retreive institution id
        r = requests.get(
            url=f'{remote.url}/api/collections/institutions/records?filter=provider_id="{self.id}"',
            headers={"Authorization": remote.token},
        )

        if r.status_code == 404:
            institution_id = None
            logging.warning(
                f"Institution with id {self.id} does not yet exist in remote, will be created."
            )
        else:
            institution_response = r.json()
            total_items = institution_response.get("totalItems")

            if total_items is not None and total_items > 0:
                institution = institution_response.get("items")[0]
                institution_id = institution.get("id")
                logging.debug(
                    f"Found matching institution {self.name} -> {institution_id}"
                )
            else:
                institution_id = None

        if institution_id is None:
            r = requests.post(
                url=f"{remote.url}/api/collections/institutions/records",
                headers={"Authorization": remote.token},
                json={
                    "name": self.name,
                    "country_code": self.country_code,
                    "provider_id": self.id,
                    "academic_year": course_diff.b_year,
                },
            )

            if r.status_code == 400:
                raise Exception(
                    "Missing required value for institution record creation."
                )
            elif r.status_code == 403:
                raise Exception("PocketBase superuser token not valid.")

            institution = r.json()
            institution_id = institution["id"]

            logging.info(f"Created new remote instititution with id {institution_id}")

        # Upload new courses
        for course in track(
            course_diff.new_courses.iter_rows(named=True),
            description="Uploading new courses...",
        ):
            self._upload_course(
                institution_id=institution_id,
                remote=remote,
                course_code=course.get("course_code"),
                title=course.get("title"),
                instructor=course.get("instructor"),
                weight=course.get("weight"),
            )

        # Remove deleted courses
        for course in track(
            course_diff.removed_courses.iter_rows(named=True),
            description="Uploading removed courses...",
        ):
            self._remove_course(remote, course.get("course_code"))

        # Update titles
        for course in track(
            course_diff.title_diff.iter_rows(named=True),
            description="Updating changed course titles...",
        ):
            self._upload_course(
                institution_id=institution_id,
                remote=remote,
                course_code=course.get("course_code"),
                title=course.get("title_b"),
            )

        # Update instructors
        for course in track(
            course_diff.instructor_diff.iter_rows(named=True),
            description="Updating changed instructors...",
        ):
            self._upload_course(
                institution_id=institution_id,
                remote=remote,
                course_code=course.get("course_code"),
                instructor=course.get("instructor_b"),
            )

        # Update weights
        for course in track(
            course_diff.weight_diff.iter_rows(named=True),
            description="Updating changed weights...",
        ):
            self._upload_course(
                institution_id=institution_id,
                remote=remote,
                course_code=course.get("course_code"),
                weight=course.get("weight_b"),
            )

        if institution and institution.get("academic_year") != course_diff.b_year:
            r = requests.patch(
                url=f"{remote.url}/api/collections/institutions/records",
                headers={"Authorization": remote.token},
                json={
                    "academic_year": course_diff.b_year,
                },
            )

    def _upload_course(
        self,
        remote,
        institution_id: str,
        course_code: str,
        title: str | None = None,
        instructor: str | None = None,
        weight: str | None = None,
    ):
        """Uploads a given course to the remote database."""

        # Check if course already exists.
        r = requests.get(
            url=f'{remote.url}/api/collections/courses/records?filter=course_code="{course_code}"',
            headers={"Authorization": remote.token},
        )

        if r.status_code == 404:
            course = None
            logging.debug(f"Course {course_code} does not yet exist in remote.")
        else:
            course_response = r.json()
            total_items = course_response.get("totalItems")

            if total_items is not None and total_items > 0:
                course = course_response.get("items")[0]
            else:
                course = None

        if course:
            r = requests.patch(
                url=f"{remote.url}/api/collections/courses/records/{course['id']}",
                headers={"Authorization": remote.token},
                json={
                    "title": title if title else course["title"],
                    "instructor": instructor if instructor else course["instructor"],
                    "weight": weight if weight else course["weight"],
                    "provider_id": institution_id,
                },
            )

            if r.status_code == 400:
                raise Exception("Required field for course creation was not present.")
            elif r.status_code == 403:
                raise Exception("PocketBase superuser token not valid.")
            elif r.status_code == 404:
                raise Exception(
                    f"Could not update course {course_code}, does not exist in remote database."
                )
        else:
            r = requests.post(
                url=f"{remote.url}/api/collections/courses/records",
                headers={"Authorization": remote.token},
                json={
                    "title": title,
                    "course_code": course_code,
                    "instructor": instructor,
                    "weight": weight,
                    "institution": institution_id,
                },
            )

            if r.status_code == 400:
                raise Exception(
                    f"Could not create course {course_code}, missing values for required fields"
                )
            elif r.status_code == 403:
                raise Exception("PocketBase superuser token not valid.")

    def _remove_course(self, remote, course_code: str):
        """Removes specified course from remote database."""
        # Check if course exists.
        r = requests.get(
            url=f'{remote.url}/api/collections/courses/records?filter=course_code="{course_code}"',
            headers={"Authorization": remote.token},
        )

        if r.status_code == 404:
            raise Exception(
                f"Could not remove course {course_code}, does not exist in remote database."
            )

        course = r.json().get("items")[0]

        r = requests.delete(
            url=f"{remote.url}/api/collections/courses/records/{course.get('id')}",
            headers={"Authorization": remote.token},
        )

        if r.status_code == 400:
            raise Exception(
                f"Could not remove {course_code}, probably connected as required relation."
            )
        elif r.status_code == 403:
            raise Exception(
                f"Could not remove {course_code}, authorisation token not valid."
            )
        elif r.status_code == 404:
            raise Exception(
                f"Could not remove {course_code}, does not exist in remote database."
            )
