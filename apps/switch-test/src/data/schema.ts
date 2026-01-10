import z from 'zod'
import { CATEGORIES } from './db';

const ItemSchema = z.object({
    id: z.number().int().positive().describe('Integer ID'),
    title: z.string().describe('Short description of the item'),
    hasDiscount: z.boolean().describe('Has current campaign discount or not'),
    basePrice: z.number().int().nonnegative().describe('Euro cent, e.g., 1000 means 10€'),
    category: z.enum(Object.values(CATEGORIES)).describe('Item category'),
});
// TypeScript-Typ aus dem Zod-Schema ableiten
export type Item = z.infer<typeof ItemSchema>;
