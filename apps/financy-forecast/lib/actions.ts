'use server'

import { updateAccount } from "./db";

export async function updateCurrentBalance(accountId: string, amount: number) {
    return await updateAccount(accountId, undefined, undefined, amount)
}