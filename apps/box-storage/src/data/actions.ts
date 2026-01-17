/* import { createServerFn } from "@tanstack/react-start"
import { getItems, getItemsByCategory, updateItem } from "./db"
import { Item } from "./schema"

export const getListItems = createServerFn().handler(
  async () => await getItems(),
)

export const getCategoryViewData = createServerFn().handler(
  async () => await getItemsByCategory(),
)

export const SetDiscountInput = Item.pick({ id: true, hasDiscount: true })
export const setDiscount = createServerFn({ method: "POST" })
  .inputValidator(SetDiscountInput.parse)
  .handler(async ({ data }) => {
    const { id, hasDiscount } = data
    await updateItem(id, { hasDiscount })
  })
 */
// TODO implement server functions to access data via data.ts
