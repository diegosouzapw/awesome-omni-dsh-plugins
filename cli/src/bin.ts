#!/usr/bin/env node

import { runCli } from "./app.js";

process.exitCode = await runCli(process.argv.slice(2));
