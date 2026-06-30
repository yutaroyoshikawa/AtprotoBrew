export const pageOf = (address: number, perPage: number): number => Math.floor(address / perPage);

export const slotOf = (address: number, perPage: number): number => address % perPage;

export const addressOf = (page: number, slot: number, perPage: number): number => page * perPage + slot;

export const colOf = (slot: number, cols: number): number => slot % cols;

export const rowOf = (slot: number, cols: number): number => Math.floor(slot / cols);
