package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("settings")

		if err != nil {
			return err
		}

		collection.Fields.RemoveByName("timer_finish_sound")
		collection.Fields.Add(&core.TextField{Name: "timer_finish_sound"})

		err = app.Save(collection)
		if err != nil {
			return err
		}

		records, err := app.FindAllRecords(collection.Name)

		if err != nil {
			return err
		}

		for _, record := range records {
			record.Set("timer_finish_sound", "clock")

			err = app.Save(record)

			if err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
