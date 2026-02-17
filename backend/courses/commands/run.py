import logging
import os

from rich.progress import Progress, TextColumn, TimeElapsedColumn

from provider import Provider


def run_command(provider_id: str | None, year: str | None, force: bool):
    providers = [Provider(name) for name in os.listdir("providers/")]

    with Progress(
        TextColumn("[progress.description]{task.description}"),
        TimeElapsedColumn(),
    ) as progress:
        for provider in providers:
            # If provider_id is set, skip all other providers
            if (provider_id is not None) & (provider_id != provider.id):
                continue

            if year is None:
                if provider.is_uptodate() & (not force):
                    logging.info(
                        f"Skipped provider {provider.id}, is already up to date."
                    )
                    continue
            else:
                if provider.course_dataset_present(year) & (not force):
                    logging.info(
                        f"Skipped provider {provider.id}, already up to date for year {year}."
                    )
                    continue

            provider = providers[providers.index(provider)]

            task_id = progress.add_task(f"Running {provider.name}")
            results = provider.run(year, force)
            logging.info(f"Processed {len(results)} courses.")

            progress.update(task_id, completed=True)
