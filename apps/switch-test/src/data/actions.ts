import { createServerFn } from "@tanstack/react-start";
import { getItems, updateItem } from "./db";

export const getListItems = createServerFn().handler(async () => await getItems())

export const setDiscount = createServerFn({ method: "POST" })
    .inputValidator((d) => d) // TODO use (sub) schema from schemas file to validate that `d` is the data the handler gets as arguments
    .handler(async ({ id, hasDiscount }) => {
        updateItem(id, { hasDiscount })
    })
