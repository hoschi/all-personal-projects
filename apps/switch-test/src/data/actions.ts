import { createServerFn } from "@tanstack/react-start";
import { getItems } from "./db";

export const getListItems = createServerFn().handler(async () => await getItems())
