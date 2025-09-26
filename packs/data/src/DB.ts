export default class DB {
    protected constructor() {}

    public static list: Record<string, ForceDigitalMarket> = {};

    public static find(typeId: string) {
        const item = this.findItem(typeId);
        if (item !== undefined) return item;
        const block = this.findBlock(typeId);
        if (block !== undefined) return block;
        return 0;
    }

    private static findItem(typeId: string) {
        const item = this.items.indexOf(typeId);
        if (item === -1) return undefined;
        return 257 + item;
    }

    private static findBlock(typeId: string) {
        const block = this.blocks.indexOf(typeId);
        if (block === -1) return undefined;
        return -9745 - block;
    }

    public static blocks: string[] = [];
    public static items: string[] = [];
}

export type LooseDigitalMarket = Base & {
    price?: number | bigint;
    sell?: number | bigint;
    sellable?: boolean;
    buyable?: boolean;
};

export type ForceDigitalMarket = Base & {
    price: bigint;
    sell: bigint;
    sellable: boolean;
    buyable: boolean;
};

export type VanillaDigitalMarket = {
    typeId: string;
    texture: string;
    name: string;
    filter?: string[];
} & (onlyBuy | onlySell | normal);

export type DigitalMarket = Base & (onlyBuy | onlySell | normal);

type Base = {
    typeId: string;
    texture: string;
    name: string;
    filter?: string[];
};

type onlySell = {
    buyable: false;
    sell: number | bigint;
    sellable?: true;
};

type onlyBuy = {
    sellable: false;
    buyable?: true;
    price: number | bigint;
};

type normal = {
    price: number | bigint;
    sell?: number | bigint;
    sellable?: true;
    buyable?: true;
};
