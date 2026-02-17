import logging
import os
import sys

from provider import Provider
from remote import Remote, store_creds


def remote_fetch_command(provider_id: str, year: str, force: bool):
    provider = Provider(provider_id)
    remote = Remote()

    results = remote.fetch_courses(provider_id, force)

    if results is None:
        return

    if (year is not None) & (year != results[1]):
        logging.error(
            f"Remote contains courses for {results[1]} while {year} was provided, aborting..."
        )

    provider.save_results(
        results[0], year if year is not None else results[1], remote=True
    )


def remote_upload_command(provider_id: str | None, year: str, force: bool):
    providers = [Provider(name) for name in os.listdir("providers/")]
    remote = Remote()

    if year and (not provider_id):
        logging.error("Year can only be set for a specified provider.")
        sys.exit(1)

    for provider in providers:
        # If provider_id is specified, skip all the other providers
        if (provider_id is not None) & (provider.id != provider_id):
            continue

        if year:
            if not provider.remote_present(year):
                logging.warning(
                    f"Remote dataset not already present for year {year} of {provider.id}, starting fetch procedure."
                )
                remote_fetch_command(provider_id, year, force)
                if not provider.remote_present(year):
                    logging.error(
                        "Remote dataset still not present after fetching procedure, aborting."
                    )
                    sys.exit(1)
            course_diff = provider.compare_courses(year, year, a_remote=True)
        else:
            if not provider.is_uptodate():
                logging.warning(
                    f"Latest remote dataset not already present for {provider.id}, starting fetch procedure."
                )
                fetch()
                if not provider.is_uptodate():
                    logging.error(
                        "Remote dataset still not present after fetching procedure, aborting."
                    )
                    sys.exit(1)

            course_diff = provider.compare_courses(
                provider.current_academic_year(),
                provider.current_academic_year(),
                a_remote=True,
            )

        provider.upload(remote, course_diff)


def remote_connect_command(url: str, token: str):
    store_creds(url, token)
