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

		collection.Fields.Add(&core.SelectField{
			Name:      "vines_sort_by",
			Required:  false,
			Values:    []string{"LAST_USED", "CREATION", "NAME"},
			MaxSelect: 1,
		})

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
