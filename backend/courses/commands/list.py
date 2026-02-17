import os

from rich.console import Console
from rich.table import Table
from rich.text import Text

from provider import Provider


def list_command():
    providers = [Provider(name) for name in os.listdir("providers/")]

    table = Table(
        title="Course Providers",
        caption=f"{len(providers)} entr{'y' if len(providers) == 1 else 'ies'}",
    )
    console = Console()

    table.add_column("name", justify="center")
    table.add_column("country", justify="left")
    table.add_column("academic_start_year", justify="center")
    table.add_column("up-to-date", justify="center")

    for provider in providers:
        up_to_date = provider.is_uptodate()

        table.add_row(
            provider.name,
            provider.country,
            str(provider.academic_year_start),
            Text(str(up_to_date), style="bold green" if up_to_date else "bold red"),
        )

    console.print(table)
