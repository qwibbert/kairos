import logging
from datetime import date

import scrapy
from scrapy import signals
from scrapy.crawler import AsyncCrawlerProcess
from scrapy.signalmanager import dispatcher


def main(year=None):
    if year is None:
        year = latest_academic_year()

    results = []

    def crawler_results(signal, sender, item, response, spider):
        results.append(item)

    dispatcher.connect(crawler_results, signal=signals.item_scraped)

    logging.disable(logging.WARNING)
    process = AsyncCrawlerProcess()
    process.crawl(UGentCourseSpider, year=year)
    process.start()
    logging.disable(logging.NOTSET)

    def flatten(xss):
        return [x for xs in xss for x in xs]

    return flatten(results), year


def latest_academic_year():
    today = date.today()
    year = today.year

    if today.month <= 9:
        year -= 1

    return year


class UGentCourseSpider(scrapy.Spider):
    name = "BE_UGENT"
    start_url = "https://studiekiezer.ugent.be/nl/cursussen/zoek?cur_zt=&aj={0}&cur_opln=&cur_lgn=&cur_lgvn="
    search_url = "https://studiekiezer.ugent.be/nl/cursussen/incrementalsearchCursus?target=zoek&ids={0}"

    def __init__(self, year=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Default to current academic year (1st of September)
        if not year:
            today = date.today()
            year = today.year

            if today.month <= 9:
                year -= 1

        self.year = year

    async def start(self):
        yield scrapy.Request(
            url=self.start_url.format(self.year),
            callback=self.parse,
            meta={"lang": "nl"},
        )

    def parse(self, response):
        # Get a list of chunks
        chunks = response.css("div.notLoaded::attr(data)").extract()
        total_courses = response.css("#aantalResultatenLabel").attrib["data-aantal"]

        for chunk in chunks:
            yield response.follow(
                self.search_url.format(chunk), self.parse_chunk, meta=response.meta
            )

    def parse_chunk(self, response):
        courses_sel = response.css(".tileDiv")

        courses_sel.getall()
        courses = []
        invalid_titles = 0
        invalid_instructors = 0
        invalid_weight = 0
        invalid_course_code = 0

        for course in courses_sel:
            title = course.css(".title::text").get()
            instructor = course.css(".opleidingstype::text").get()
            weight = course.css(".infotags div:nth-child(2)::text").re(r"\d+")
            course_code = course.css(".title::attr(title)").get()

            if len(weight) == 0:
                weight = None
            else:
                weight = weight[0]

            if title is None:
                print("Ignored course with unknown title")
                continue
            elif instructor is None:
                print(f"Ignored course {title} with unknown instructor")
                continue
            elif weight is None:
                print(f"Course {title} has no associated course weight")
            elif course_code is None:
                print(f"Ignored course {title} with unknown course code")
                continue

            courses.append(
                {
                    "title": title,
                    "instructor": instructor,
                    "weight": int(weight) if weight is not None else None,
                    "course_code": course_code,
                }
            )

        yield courses
