import type { Item, ItemForm } from "../types/Item";

const apiUrl = `${import.meta.env.VITE_FINTRACK_API}/api/items`;

const handleResponse = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
        let message = `API Error: ${res.statusText}`;

        try {
            const errorData = await res.json();
            message = `API Error: ${errorData.title ?? message}`;
        } catch {
            // ignore parsing error
        }

        throw new Error(message);
    }

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        return undefined as T;
    }

    return res.json();
}

export const itemsService = {
    async getAll(signal?: AbortSignal): Promise<Item[]> {
        const res = await fetch(apiUrl, {signal})
        return handleResponse<Item[]>(res);
    },
    async add(item: ItemForm): Promise<Item> {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });
        return handleResponse<Item>(res);
    },
    async update(item: Item): Promise<void> {
        const res = await fetch(`${apiUrl}/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });
        return handleResponse<void>(res);
    },
    async remove(id: number): Promise<void> {
        const res = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        });
        return handleResponse<void>(res);
    }
}