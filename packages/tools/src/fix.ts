#!/usr/bin/env bun
import { $ } from "bun";

await $`FORCE_COLOR=1 eslint --fix .`;
