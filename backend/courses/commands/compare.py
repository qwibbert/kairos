from provider import Provider


def compare_command(
    earlier_year: str,
    later_year: str,
    earlier_year_remote: bool,
    later_year_remote: bool,
    provider_name: str,
):
    provider = Provider(provider_name)

    diff = provider.compare_courses(
        earlier_year
        if earlier_year
        else str(int(provider.current_academic_year()) - 1),
        later_year if later_year else provider.current_academic_year(),
        a_remote=earlier_year_remote,
        b_remote=later_year_remote,
    )

    diff.digest()
