import os
import sys
from json import dumps

import click
import requests


def add_provider_command(domain: str):
    """Adds a provider from a specified DOMAIN."""
    try:
        response = api_request(domain)
    except requests.exceptions.HTTPError:
        click.echo("API returned http error.", err=True)
        sys.exit(1)
    except requests.exceptions.JSONDecodeError:
        click.echo("Failed to decode JSON response.", err=True)
        sys.exit(1)
    else:
        if not response:
            click.echo(
                f"No results where found for {domain}, please check your spelling.",
                err=True,
            )
            sys.exit(1)
        elif len(response) > 1:
            click.echo(
                f"The search for {domain} yielded multiple possible institutions. Narrow your search or create the provider manually.",
                err=True,
            )
            sys.exit(1)
        else:
            response = response[0]

    primary_domain: str = response["domains"][0]
    top_level_domain = primary_domain.split(".")[-1]
    rest_domain_names = primary_domain.split(".")[:-1]

    # Generate the provider name
    provider_id = top_level_domain.upper()
    for domain_name in rest_domain_names:
        provider_id += f"_{domain_name.upper()}"

    # Check if the provider exists already
    if os.path.exists(f"providers/{provider_id}"):
        click.echo("Error: provider exists already", err=True)
        sys.exit(1)

    # Prompt the user for the semester start date, this will be used to automatically reschedule course fetching
    academic_year_start = click.prompt(
        "Please select the start month of the first semester (e.g. for septembre, enter the number 9)",
        type=int,
    )
    if academic_year_start < 1 or academic_year_start > 12:
        click.echo("Error: input must be a valid month.", err=True)
        sys.exit(1)

    # Create provider directory
    os.makedirs(f"providers/{provider_id}")

    # Create manifest file
    manifest = {
        "id": provider_id,
        "name": response["name"],
        "country": response["country"],
        "country_code": response["alpha_two_code"],
        "state_provice": response["state-province"],
        "domains": response["domains"],
        "web_pages": response["web_pages"],
        "academic_year_start": academic_year_start,
    }

    with open(f"providers/{provider_id}/manifest.json", mode="w") as file:
        file.write(dumps(manifest))

    with open(f"providers/{provider_id}/provider.py", mode="w") as file:
        file.write(f"# Here comes the provider code for {provider_id}")

    click.echo(f"Success: created provider {provider_id}", err=True)
    sys.exit(0)


def api_request(domain: str):
    """Performs a request to http://universities.hipolabs.com with the domain name as a parameter."""
    r = requests.get("http://universities.hipolabs.com/search", {"domain": domain})
    r.raise_for_status()

    return r.json()
