import DB from "../DB.js";
import type { ForceDigitalMarket, VanillaDigitalMarket } from "../DB.js";

export default function vanilla() {
    const vanilla: VanillaDigitalMarket[] = [
        ...colors({ name: "% Wool", price: 3n, typeId: "%_wool", texture: "wool_colored_%", path: "blocks" }),
        ...colors({ name: "% Concrete", price: 10n, typeId: "%_concrete", texture: "concrete_%", path: "blocks" }),
        ...colors({
            name: "% Concrete Powder",
            price: 10n,
            typeId: "%_concrete_powder",
            texture: "concrete_powder_%",
            path: "blocks",
        }),
        ...wood({ name: "% Log", price: 5n, typeId: "%_log", property: "normal" }),
        ...wood({ name: "Stripped % Log", price: 5n, typeId: "stripped_%_log", property: "stripped" }),
        { name: "Diamond", price: 1000n, typeId: "diamond", texture: "textures/items/diamond" },
        { name: "Iron", price: 500n, typeId: "iron_ingot", texture: "textures/items/iron_ingot" },
        { name: "Gold", price: 450n, typeId: "gold_ingot", texture: "textures/items/gold_ingot" },
        { name: "Lapis Lazuli", price: 200n, typeId: "lapis_lazuli", texture: "textures/items/lapis_lapzuli" },
        { name: "Cobblestone", price: 2n, typeId: "cobblestone", texture: "textures/blocks/cobblestone" },
        { name: "Stone", price: 3n, typeId: "stone", texture: "textures/blocks/stone" },
    ] as const;
    for (const item of vanilla) {
        const typeId = "minecraft:" + item.typeId;
        DB.list[typeId] = {
            ...item,
            typeId,
        } as ForceDigitalMarket;
    }
}

const colorList = [
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

function colors({
    name,
    typeId,
    price,
    path,
    texture,
    fix = true,
}: {
    name: string;
    typeId: string;
    price: bigint;
    texture: string;
    path: "blocks" | "items";
    fix?: boolean;
}) {
    const items: VanillaDigitalMarket[] = [];
    for (const type of colorList) {
        const color = fix && type === "light_gray" ? "silver" : type;
        items.push({
            name: name.replace("%", type.toTitleCase()),
            typeId: typeId.replace("%", type),
            texture: `textures/${path}/${texture.replace("%", color)}`,
            price,
        });
    }
    return items;
}

type woodListValues = "stripped" | "normal";
const woodList = {
    oak: { stripped: "blocks/stripped_oak_log", normal: "blocks/log_oak" },
    spruce: { stripped: "blocks/stripped_spruce_log", normal: "blocks/log_spruce" },
    birch: { stripped: "blocks/stripped_birch_log", normal: "blocks/log_birch" },
    jungle: { stripped: "blocks/stripped_jungle_log", normal: "blocks/log_jungle" },
    acacia: { stripped: "blocks/stripped_acacia_log", normal: "blocks/log_acacia" },
    dark_oak: { stripped: "blocks/stripped_dark_oak_log", normal: "blocks/log_big_oak" },
    mangrove: { stripped: "blocks/stripped_mangrove_log_side", normal: "blocks/mangrove_log_side" },
    cherry: { stripped: "blocks/stripped_cherry_log_side", normal: "blocks/cherry_log_side" },
    pale_oak: { stripped: "blocks/stripped_pale_oak_log_side", normal: "blocks/pale_oak_log_side" },
    crimson: {
        stripped: "blocks/huge_fungus/stripped_crimson_stem_side",
        normal: "ienis/digital_market/nether_logs/crimson_stem",
    },
    warped: {
        stripped: "blocks/huge_fungus/stripped_warped_stem_side",
        normal: "ienis/digital_market/nether_logs/warped_stem",
    },
} as const;

function wood({ name, typeId, price, property }: { name: string; typeId: string; price: bigint; property: woodListValues }) {
    const items: VanillaDigitalMarket[] = [];
    for (const type of Object.keys(woodList)) {
        const realTypeId = typeId.replace("%", type);
        items.push({
            name: name.replace("%", type.toTitleCase()),
            typeId: realTypeId,
            texture: "textures/" + woodList[type as keyof typeof woodList][property],
            price,
        });
    }
    return items;
}
