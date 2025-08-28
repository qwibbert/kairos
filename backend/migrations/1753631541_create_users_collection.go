package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		// restrict the list and view rules for record owners
		collection.ListRule = types.Pointer("id = @request.auth.id")
		collection.ViewRule = types.Pointer("id = @request.auth.id")

		// add extra fields in addition to the default ones
		collection.Fields.Add(
			&core.TextField{
				Name:     "name",
				Required: true,
				Max:      50,
			},
			&core.TextField{
				Name:     "surname",
				Required: true,
				Max:      50,
			},
		)

		// add autodate/timestamp fields (created/updated)
		collection.Fields.Add(&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		})
		collection.Fields.Add(&core.AutodateField{
			Name:     "updated",
			OnCreate: true,
			OnUpdate: true,
		})

		collection.AddIndex("idx_email", true, "email", "")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
