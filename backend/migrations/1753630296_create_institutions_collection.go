package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		collection := core.NewBaseCollection("institutions")

		// Make list & view queries public
		collection.ListRule = types.Pointer("")
		collection.ViewRule = types.Pointer("")

		// Add collection fields
		collection.Fields.Add(
			&core.TextField{
				Name:        "name",
				Required:    true,
				Presentable: true,
				Max:         100,
			},
			&core.TextField{
				Name:     "country_code",
				Required: true,
				// Pattern matches ISO 3166 country_codes: https://en.wikipedia.org/wiki/ISO_3166
				Pattern: "/^(A[DEFGLMOQRSTUWXZ]|B[ABDEFGHIJLMNORSTVWYZ]|C[ACDFGHIKLMNORUVWXYZ]|D[EJKMOZ]|E[CEGHRST]|F[IJKMOR]|G[ABDFGHILMNPQRSTUWY]|H[KMNRTU]|I[DELMNOQRST]|J[EMOP]|K[EGHIMNPRWYZ]|L[ABCIKRSUVY]|M[ACDFGHKLMNOPQRSTUVWXYZ]|N[ACEFGILOPRUZ]|O[M]|P[APRWYZ]|L[ABCIKRSUVY]|M[ACDFGHKLMNOPQRSTUVWXYZ]|N[ACEFGILOPRUZ]|O[M]|P[AEFGHKLMNRSTWY]|Q[A]|R[EOSW]|S[ABCDEGHIJLMNORSTVXYZ]|T[CDFGHJKLMNORTVWZ]|U[AGMSYZ]|V[ACEGINU]|W[FS]|X[]|Y[ET]|Z[AMW])$/gm",
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

		collection.AddIndex("idx_institution_name", true, "name", "")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("clients")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
