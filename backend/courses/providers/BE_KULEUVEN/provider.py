# Here comes the provider code for BE_KULEUVEN
from datetime import date

import requests
import scrapy
from scrapy import signals
from scrapy.crawler import AsyncCrawlerProcess
from scrapy.signalmanager import dispatcher


def main(year=None):
    if year is None:
        year = latest_academic_year()

    start = 0

    course_codes = []

    while True:
        r = requests.post(
            "https://onderwijsaanbod.kuleuven.be/api/opo2025/_search",
            data='{"size":100,"from":FROM_PLACEHOLDER,"aggs":{"Onderwijstaal":{"filter":{"bool":{"must":[{"terms":{"institution.keyword":[50000050]}},{"exists":{"field":"url"}},{"terms":{"moduleOgoSet.ogoDescriptionNl.keyword":["Leuven"]}}]}},"aggs":{"buckets":{"terms":{"field":"activitySet.nlLanguOfInstruction.keyword","min_doc_count":1,"exclude":[],"order":{"_count":"desc"},"size":10000}},"nb_buckets":{"cardinality":{"field":"activitySet.nlLanguOfInstruction.keyword"}}}},"Locatie":{"filter":{"bool":{"must":[{"terms":{"institution.keyword":[50000050]}},{"exists":{"field":"url"}}]}},"aggs":{"buckets":{"terms":{"field":"moduleOgoSet.ogoDescriptionNl.keyword","min_doc_count":1,"exclude":[],"order":{"_count":"desc"},"size":10000}},"nb_buckets":{"cardinality":{"field":"moduleOgoSet.ogoDescriptionNl.keyword"}}}},"Faculteit":{"filter":{"bool":{"must":[{"terms":{"institution.keyword":[50000050]}},{"exists":{"field":"url"}},{"terms":{"moduleOgoSet.ogoDescriptionNl.keyword":["Leuven"]}}]}},"aggs":{"buckets":{"terms":{"field":"organizationSet.nlOrganization.keyword","min_doc_count":1,"exclude":["KU Leuven","KU Leuven - Universiteit","organisatiestructuur Associatie KU Leuven","Groep Humane Wetenschappen","Groep Wetenschap & Technologie","Groep Biomedische Wetenschappen","UC Leuven","andere rechtspersonen van of verbonden met de Associatie KU Leuven","Groep management en technologie UC Leuven","Departement Sociale School Heverlee","UC Limburg","LUCA School of Arts vzw","Thomas More Mechelen-Antwerpen","Sociaal Werk & Psychologie / Ergotherapie & Orthopedie / Logopedie &  Audiologie","Ontwerp & Productie / Elektromechanica / Autotechnologie","Thomas More Kempen","Interieur & Design / Bouw / Energie","Odisee","Cluster Gezondheidszorg Campus Brussel","Cluster Gezondheidszorg - Verpleegkunde Campus Brussel","Cluster Bedrijfskunde Campus Brussel","Cluster Onderwijs Campus Brussel","Cluster Bedrijfskunde Campus Aalst","Cluster Onderwijs Campus Aalst","Cluster Technologie Campus Aalst 1","Cluster Sociaal-agogisch werk Campus Brussel","Cluster Technologie Technologiecampus Gent 2","Cluster Onderwijs Campus Sint-Niklaas","Cluster Technologie Campus Aalst 2","Cluster Technologie Technologiecampus Gent 1","Cluster Biotechnologie Campus Sint-Niklaas","Cluster Gezondheidszorg Campus Sint-Niklaas","Cluster Gezondheidszorg Technologiecampus Gent","Cluster Sociaal-agogisch werk Campus Dilbeek","Cluster Sociaal-agogisch werk Campus Schaarbeek","Cluster Bedrijfskunde Campus Sint-Niklaas","Cluster Gezondheidszorg Campus Aalst","Cluster Onderwijs Campus Dilbeek","Campus Dilbeek","Campus Brussel","Katholieke Hogeschool Vives Noord","Katholieke Hogeschool Vives Zuid","Departement Lerarenopleiding - RENO","Departement Verpleegkunde - HIVB"],"order":{"_count":"desc"},"size":10000}},"nb_buckets":{"cardinality":{"field":"organizationSet.nlOrganization.keyword"}}}}},"query":{"bool":{"must":[{"terms":{"institution.keyword":[50000050]}},{"exists":{"field":"url"}}]}},"post_filter":{"bool":{"must":[{"terms":{"moduleOgoSet.ogoDescriptionNl.keyword":["Leuven"]}}]}},"min_score":0,"sort":[{"_script":{"type":"number","script":{"lang":"painless","source":"if (doc.containsKey(\'moduleLanguageSet.moduleOrganizationSet.organizationType.keyword\') && doc[\'moduleLanguageSet.moduleOrganizationSet.organizationType.keyword\'].value == \'EO\') { return 2; } else { return 1; }"},"order":"asc"}},{"_score":{"order":"desc"}}]}'.replace(
                "FROM_PLACEHOLDER", str(start)
            ),
        )

        json: dict = r.json()

        if not json.get("hits"):
            break

        hits = json.get("hits").get("hits")

        if not hits:
            break

        for hit in hits:
            source = hit.get("_source")

            if not source:
                continue

            course_code = source.get("ectsCode")

            if not course_code:
                continue

            course_codes.append(course_code)

        start += 100

    results = []

    def crawler_results(signal, sender, item, response, spider):
        results.append(item)

    dispatcher.connect(crawler_results, signal=signals.item_scraped)

    process = AsyncCrawlerProcess()
    process.crawl(KULeuvenCourseSpider, course_codes)
    process.start()

    def flatten(xss):
        return [x for xs in xss for x in xs]

    return flatten(results), year


def latest_academic_year():
    today = date.today()
    year = today.year

    if today.month <= 9:
        year -= 1

    return year


class KULeuvenCourseSpider(scrapy.Spider):
    name = "BE_KULEUVEN"
    start_url = f"https://onderwijsaanbod.kuleuven.be/syllabi/e/{0}"

    def __init__(self, course_codes, *args, **kwargs):
        self.course_codes = course_codes
        super().__init__(*args, **kwargs)

    async def start(self):
        for course_code in self.course_codes:
            print(self.start_url.format(course_code))
            yield scrapy.Request(
                url=self.start_url.format(course_code),
                callback=self.parse,
            )

    def parse(self, response):
        title = response.css(".card-body")
        print(title)
        yield title
