#!/usr/bin/env bun
import { $ } from "bun";

await $`FORCE_COLOR=1 prettier --write .`;
