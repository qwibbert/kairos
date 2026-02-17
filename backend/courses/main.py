import click

from commands.add_provider import add_provider_command
from commands.compare import compare_command
from commands.list import list_command
from commands.remote import (
    remote_connect_command,
    remote_fetch_command,
    remote_upload_command,
)
from commands.run import run_command


@click.group()
def cli():
    pass


@cli.command("add_provider")
@click.argument("domain")
def add_provider(domain: str):
    add_provider_command(domain)


@cli.command("compare")
@click.argument("provider_name")
@click.option("-e", "--earlier-year")
@click.option("-l", "--later-year")
@click.option("-er", "--earlier-year-remote", is_flag=True)
@click.option("-lr", "--later-year-remote", is_flag=True)
def compare(
    earlier_year: str,
    later_year: str,
    earlier_year_remote: bool,
    later_year_remote: bool,
    provider_name: str,
):
    compare_command(
        earlier_year, later_year, earlier_year_remote, later_year_remote, provider_name
    )


@cli.command("list")
def list():
    list_command()


@cli.group("remote")
def remote():
    pass


@remote.command("upload")
@click.option("-p", "--provider-id", type=str)
@click.option("-y", "--year", type=str)
@click.option("-f", "--force", is_flag=True)
def remote_upload(provider_id: str | None, year: str, force: bool):
    remote_upload_command(provider_id, year, force)


@remote.command("connect")
@click.argument("url")
@click.argument("token")
def remote_connect(url: str, token: str):
    remote_connect_command(url, token)


@remote.command("fetch")
@click.argument("provider_id")
@click.option("-y", "--year", type=str)
@click.option("-f", "--force", is_flag=True)
def fetch(provider_id: str, year: str, force: bool):
    remote_fetch_command(provider_id, year, force)


@cli.command("run")
@click.option("-p", "--provider", type=str)
@click.option("-y", "--year", type=str)
@click.option("-f", "--force", is_flag=True)
def run(provider: str | None, year: str | None, force: bool):
    run_command(provider, year, force)


if __name__ == "__main__":
    cli()
