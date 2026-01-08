#!/usr/bin/env bun
import { $ } from "bun";

await $`eslint --fix .`;
