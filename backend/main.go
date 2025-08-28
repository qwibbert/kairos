package main

import (
	"embed"
	"io/fs"
	"log"
	"os"
	"strings"

	"kairos/hooks"
	_ "kairos/migrations"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

//go:embed pb_public/*
var staticFS embed.FS

func main() {
	app := pocketbase.New()

	var hooksDir string
	app.RootCmd.PersistentFlags().StringVar(
		&hooksDir,
		"hooksDir",
		"",
		"the directory with the JS app hooks",
	)

	var hooksWatch bool
	app.RootCmd.PersistentFlags().BoolVar(
		&hooksWatch,
		"hooksWatch",
		true,
		"auto restart the app on pb_hooks file change",
	)

	var hooksPool int
	app.RootCmd.PersistentFlags().IntVar(
		&hooksPool,
		"hooksPool",
		25,
		"the total prewarm goja.Runtime instances for the JS app hooks execution",
	)

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"pb_migrations",
		"the directory with the user defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path (eg. when pretty urls are used with SPA)",
	)

	app.RootCmd.ParseFlags(os.Args[1:])

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	// Docs https://pocketbase.io/docs/go-migrations/
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	// load jsvm (pb_hooks and pb_migrations)
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
		HooksDir:      hooksDir,
		HooksWatch:    hooksWatch,
		HooksPoolSize: hooksPool,
	})

	serveStatic(app)
	hooks.Register(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func serveStatic(app core.App) {
	// Docs https://pocketbase.io/docs/go-overview/
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		pb_public, err := fs.Sub(staticFS, "pb_public")
		if err != nil {
			return err
		}
		se.Router.GET("/{path...}", apis.Static(pb_public, true))
		return se.Next()
	})
}
