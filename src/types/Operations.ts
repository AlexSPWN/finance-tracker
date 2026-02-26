export type Operations = "load" | "add" | "update" | "remove";

export type PendingState = Record<Operations, boolean>
export type ErrorState = Partial<Record<Operations, string>>