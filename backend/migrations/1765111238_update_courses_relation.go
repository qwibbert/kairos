package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		vines_collection, vine_err := app.FindCollectionByNameOrId("vines")
		courses_collection, courses_err := app.FindCollectionByNameOrId("courses")

		if vine_err != nil {
			return vine_err
		}

		if courses_err != nil {
			return courses_err
		}

		records, err := app.FindAllRecords(vines_collection)

		if err != nil {
			return err
		}

		for _, record := range records {
			course_code := record.GetString("course_code")

			if course_code != "" {
				course, err := app.FindFirstRecordByData(courses_collection, "course_code", course_code)

				if err != nil {
					return err
				}

				record.Set("course", course.Id)

				app.Save(record)
			}
		}

		return nil
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
