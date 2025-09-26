import type { VanillaDigitalMarket } from "../DB.js";

export function colors({
    name,
    typeId,
    price,
    path,
    texture,
    filter,
    fix = true,
}: {
    name: string;
    typeId: string;
    price: bigint;
    texture: string;
    path: "blocks" | "items";
    filter?: string[];
    fix?: boolean;
}) {
    const items: VanillaDigitalMarket[] = [];
    for (const type of colorList) {
        const color = fix && type === "light_gray" ? "silver" : type;
        const item: VanillaDigitalMarket = {
            name: name.replace("%", type.toTitleCase()),
            typeId: typeId.replace("%", type),
            texture: `${path}/${texture.replace("%", color)}`,
            price,
        };
        if (!!filter && filter.length > 0) item.filter = filter;
        items.push(item);
    }
    return items;
}

export function wood({
    name,
    typeId,
    price,
    property,
    filter,
}: {
    name: string;
    typeId: string;
    price: bigint;
    property: woodListValues;
    filter?: string[];
}) {
    const items: VanillaDigitalMarket[] = [];
    for (const type of Object.keys(woodList)) {
        const realTypeId = typeId.replace("%", type);
        const item: VanillaDigitalMarket = {
            name: name.replace("%", type.toTitleCase()),
            typeId: realTypeId,
            texture: woodList[type as keyof typeof woodList][property],
            price,
        };
        if (!!filter && filter.length > 0) item.filter = filter;
        items.push(item);
    }
    return items;
}

export const colorList = [
    "white",
    "light_gray",
    "gray",
    "black",
    "brown",
    "red",
    "orange",
    "lime",
    "green",
    "cyan",
    "light_blue",
    "blue",
    "purple",
    "magenta",
    "pink",
] as const;

export type woodListValues = "stripped" | "normal" | "planks";
export const woodList = {
    oak: { stripped: "blocks/stripped_oak_log", normal: "blocks/log_oak", planks: "blocks/planks_oak" },
    spruce: { stripped: "blocks/stripped_spruce_log", normal: "blocks/log_spruce", planks: "blocks/planks_spruce" },
    birch: { stripped: "blocks/stripped_birch_log", normal: "blocks/log_birch", planks: "blocks/planks_birch" },
    jungle: { stripped: "blocks/stripped_jungle_log", normal: "blocks/log_jungle", planks: "blocks/planks_jungle" },
    acacia: { stripped: "blocks/stripped_acacia_log", normal: "blocks/log_acacia", planks: "blocks/planks_acacia" },
    dark_oak: { stripped: "blocks/stripped_dark_oak_log", normal: "blocks/log_big_oak", planks: "blocks/planks_big_oak" },
    mangrove: {
        stripped: "blocks/stripped_mangrove_log_side",
        normal: "blocks/mangrove_log_side",
        planks: "blocks/mangrove_planks",
    },
    cherry: {
        stripped: "blocks/stripped_cherry_log_side",
        normal: "blocks/cherry_log_side",
        planks: "blocks/cherry_planks",
    },
    pale_oak: {
        stripped: "blocks/stripped_pale_oak_log_side",
        normal: "blocks/pale_oak_log_side",
        planks: "blocks/pale_oak_planks",
    },
    crimson: {
        stripped: "blocks/huge_fungus/stripped_crimson_stem_side",
        normal: "ienis/digital_market/nether_logs/crimson_stem",
        planks: "blocks/huge_fungus/warped_planks",
    },
    warped: {
        stripped: "blocks/huge_fungus/stripped_warped_stem_side",
        normal: "ienis/digital_market/nether_logs/warped_stem",
        planks: "blocks/huge_fungus/crimson_planks",
    },
} as const;
