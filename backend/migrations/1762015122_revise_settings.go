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

		collection.Fields.Add(&core.TextField{Name: "theme"})
		collection.Fields.Add(&core.BoolField{Name: "special_periods"})
		collection.Fields.Add(&core.BoolField{Name: "special_periods_tip_shown"})
		collection.Fields.RemoveByName("theme_inactive")
		collection.Fields.RemoveByName("theme_active")

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
