import { createServerFn } from "@tanstack/react-start"
import { getItems, updateItem } from "./db"
import { Item } from "./schema"

export const getListItems = createServerFn().handler(
  async () => await getItems(),
)

export const SetDiscountInput = Item.pick({ id: true, hasDiscount: true })
export const setDiscount = createServerFn({ method: "POST" })
  .inputValidator(SetDiscountInput.parse)
  .handler(async ({ data }) => {
    const { id, hasDiscount } = data
    updateItem(id, { hasDiscount })
  })
