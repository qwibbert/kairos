package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		collection := core.NewBaseCollection("courses")

		// Make list & view queries public
		collection.ListRule = types.Pointer("")
		collection.ViewRule = types.Pointer("")

		// Add collection fields
		collection.Fields.Add(
			&core.TextField{
				Name:        "title",
				Required:    true,
				Presentable: true,
				Max:         50,
			},
			&core.TextField{
				Name:     "course_code",
				Required: true,
				Max:      50,
			},
			&core.TextField{
				Name:     "instructor",
				Required: true,
				Max:      50,
			},
			&core.NumberField{
				Name:     "weight",
				Required: true,
				Min:      types.Pointer(0.0),
			},
		)

		institutionsCollection, err := app.FindCollectionByNameOrId("institutions")
		if err != nil {
			return err
		}
		collection.Fields.Add(&core.RelationField{
			Name:          "institution",
			Required:      true,
			CascadeDelete: true,
			CollectionId:  institutionsCollection.Id,
		})

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

		collection.AddIndex("idx_courses_title", false, "title", "")
		collection.AddIndex("idx_courses_course_code", true, "course_code", "")
		collection.AddIndex("idx_courses_institutions", false, "institution", "")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("courses")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
