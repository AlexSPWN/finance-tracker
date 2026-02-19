export type Item = {
    id: number;
    name: string;
    price: number;
}
export type ItemForm = Omit<Item, "id" | "price"> & { price: number | undefined}

export type ErrorFields = Partial<Record<keyof ItemForm, string>>
export type TouchedFields = Partial<Record<keyof ItemForm, boolean>>

export type Operations = "load" | "add" | "update" | "remove";

export type PendingState = Record<Operations, boolean>
export type ErrorState = Partial<Record<Operations, string>>