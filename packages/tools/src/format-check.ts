#!/usr/bin/env bun
import { $ } from "bun";

await $`prettier --check .`;
