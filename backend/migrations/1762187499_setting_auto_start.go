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

		collection.Fields.Add(&core.BoolField{Name: "auto_start"})

		err = app.Save(collection)
		if err != nil {
			return err
		}
		return nil
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
