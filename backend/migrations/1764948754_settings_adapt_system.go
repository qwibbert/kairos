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

		collection.Fields.Add(&core.BoolField{Name: "adapt_system"})
		collection.Fields.Add(&core.TextField{Name: "last_dark_theme"})

		err = app.Save(collection)
		if err != nil {
			return err
		}

		records, err := app.FindAllRecords(collection.Name)

		if err != nil {
			return err
		}

		for _, record := range records {
			record.Set("adapt_system", false)
			record.Set("last_dark_theme", "dark")

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
