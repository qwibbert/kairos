# Kairos Course Manager
This repository is responsible for fetching a list of courses from each institution registered as a provider and uploading these lists to the Kairos database.

## Setup
This repository uses [uv](https://docs.astral.sh/uv/getting-started/installation/) to manage Python dependencies, make sure it is installed. Run ´uv sync´ to install the required packages

## Commands
### Get a list of available providers and check if they are up-to-date
`$ uv run main.py list`

### Add a new provider
First do a search in https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json and note the first domain name of the institution you want to add (e.g. ugent.be).

Now run the following command:
`$ uv run main.py add_provider ugent.be`

You will now see a new folder in the providers directory: `BE_UGENT`. For more information about the folder structure, see below.

### Run
This command runs every registered provider. By default it only runs providers for which the local course database is not up to date, this behaviour can be overriden by the -f flag. A specific provider can be run using the -p flag, which expects the ID as seen in the provider folder name. Lastly, a specific year can be provided using the -y flag, this is not supported for every provider.

## Compare
Used to compare two course datasets with each other. Will try to compare the dataset from the current academic year with previous one. Specific years can be provided using the -e and -l flags.

## Remote

### Connect
Before uploading or fetching courses from the remote, you must first connect to the remote instance using it's URL and a superuser token. This token can be obtained by using the PocketBase impersonate feature on a superuser account.

### Fetch
Fetches the courses from the remote database for a specific provider.

### Upload
Uploads locally changed courses (compared with fetched remote dataset, make sure you have fetched the courses from the remote first) to the remote.

## Providers
Every subfolder contains the code necessary to generate a course list for a specific institution.

### Folder name format
The format is as follows: **{COUNTRY-CODE}_{DOMAIN}**
- **{COUNTRY-CODE}**: ISO-3166 code for institution's country
- **{DOMAIN}**: domain name of institution

### Folder contents format

#### `manifest.json`
Contains information about the institution, see https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json for format
```json
{
    // Information provided by university-domains-list
    "web_pages": ["https://www.ugent.be/", "http://www.rug.ac.be/"],
    "name": "Universiteit Gent",
    "alpha_two_code": "BE",
    "state-province": "",
    "domains": ["ugent.be", "rug.ac.be"],
    "country": "Belgium",

    // First semester start month to schedule provider rerun
    "sem_start": 9,
    
    // Provider ID
    "id": "BE_UGENT",
}
```

#### `provider.py`
Contains the course list generator, look at the `provider.py` file of the `BE_UGENT` provider for more information. If your institution is kind enough to provide a dataset with their courses, you can do transformations to the data here. Web scraping is also an option.

Expects a main function to be present.

#### `course_list_YEAR.json`
Contains the course list for the institution, format is as follows:
```json
[
    ...,
    {
        "title": "Example Course",
        "course_code": "A000186", // Most institutions have identifiers for their courses, these must be unique
        "instructor": "Example instructor",
        "weight": 3, // Corresponds to European Credit Points, see https://en.wikipedia.org/wiki/European_Credit_Transfer_and_Accumulation_System. Set to zero if your institution does not provide this
        "language": "nl" // ISO 639 language code, see https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
    },
    ...
]
```
