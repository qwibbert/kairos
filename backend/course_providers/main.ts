#! /usr/bin/env bun

import yargs from "yargs";
import add from "./commands/add.ts";
import collect from "./commands/collect.ts";
import list from "./commands/list.ts";
import { run } from "./commands/run.ts";
import upload from "./commands/upload.ts";

yargs(process.argv.slice(2))
  .scriptName("course_providers")
  .usage("$0 <cmd> [args]")
  .command(
    "list",
    "create a list of available providers",
    async (argv) => await list(true),
  )
  .command("add", "add a new provider", async (yargs) => {
    yargs.positional("domain", {
      type: "string",
      describe:
        "the domain of the institution you want to add, e.g. example.com",
    });
  }, async (argv) => {
    await add(argv._[1]);
  })
  .command("run", "runs specified providers", async (yargs) => {
    yargs.positional("provider", {
      type: "string",
      describe:
        'the id of the provider you want to run, e.g. BE_UGENT',
    }).option('f', {
      alias: "force",
      default: false,
      describe: 'Forcefully rerun specified providers',
      type: 'boolean'
    }).option('v', {
      alias: "verbose",
      default: false,
      describe: 'Enable verbose loggging',
      type: 'boolean'
    });
  }, async (argv) => {
    await run(argv._[1], {verbose: argv.v, force: argv.f});
  })
  .command("collect", "aggregates the courses of each provider", async (yargs) => {
    yargs.option('f', {
      alias: "force",
      default: false,
      describe: 'Skip outdated providers.',
      type: 'boolean'
    });
  }, async (argv) => {
    await collect({force: argv.f as boolean});
  })
  .command("upload", "uploads courses to backend", async (yargs) => {
    yargs
      .usage('${0}, <BACKEND_URL> <SUPERUSER_TOKEN')
      .positional('backend_url', { type: 'string', describe: 'Address of backend (e.g. http://localhost:8090)' })
      .positional('superuser_token', { type: 'string', describe: 'Superuser token of backend instance' })
  }, async (argv) => {
    upload(argv._[1], argv._[2]);
  })
  .parse();
  
