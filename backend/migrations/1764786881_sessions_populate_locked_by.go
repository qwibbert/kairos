package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("sessions")

		if err != nil {
			return err
		}

		records, err := app.FindAllRecords(collection.Name)

		if err != nil {
			return err
		}

		for _, record := range records {
			record.Set("locked_by", "")

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
