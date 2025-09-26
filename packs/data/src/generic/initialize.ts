import vanilla from "./vanilla.js";
import { world, BlockTypes, ItemTypes, ItemStack, BlockPermutation } from "@minecraft/server";
import DB, { ForceDigitalMarket, LooseDigitalMarket } from "../DB.js";
import CONFIG from "../CONFIG.js";

world.afterEvents.worldLoad.subscribe(() => {
    CONFIG.defaultDivider = BigInt(
        (world.getDynamicProperty("digitalmarket:defaultDivider") as number | undefined) ?? CONFIG.defaultDivider,
    );
    vanilla();
    const blocks = BlockTypes.getAll()
        .map((x) => x.id)
        .filter((x) => !x.startsWith("minecraft:"))
        .sort();
    const allItems = ItemTypes.getAll()
        .map((x) => x.id)
        .filter((x) => !x.startsWith("minecraft:"))
        .sort();
    const items = ItemTypes.getAll()
        .map((x) => x.id)
        .filter((x) => !x.startsWith("minecraft:"))
        .filter((x) => !blocks.includes(x))
        .sort();
    const joinedItems: { id: string; type: "block" | "item" }[] = [
        ...blocks.map((x) => ({ id: x, type: "block" } as { id: string; type: "block" | "item" })),
        ...items.map((x) => ({ id: x, type: "item" } as { id: string; type: "block" | "item" })),
    ];

    DB.blocks = blocks;
    DB.items = items;

    for (const itemData of joinedItems) {
        const item = new ItemStack(itemData.id);

        const tags =
            itemData.type === "item"
                ? item
                      .getTags()
                      .filter((x) => x.startsWith("digitalmarket:"))
                      .map((x) => x.replace("digitalmarket:", ""))
                : BlockPermutation.resolve(itemData.id)
                      .getTags()
                      .filter((x) => x.startsWith("digitalmarket:"))
                      .map((x) => x.replace("digitalmarket:", ""));

        if (tags.length < 3 || !validate(tags)) continue;

        const market: LooseDigitalMarket = {
            name: tags
                .find((x) => x.startsWith("name:"))!
                .replace("name:", "")
                .toTitleCase(),
            texture: tags.find((x) => x.startsWith("texture:"))!.replace("texture:", ""),
            typeId: itemData.id,
        };

        if (tags.find((x) => x.startsWith("price:"))) market.price = tags.findToBigInt("price:");
        if (tags.find((x) => x.startsWith("buyable:"))) market.buyable = tags.findToBoolean("buyable:");
        if (tags.find((x) => x.startsWith("sell:"))) market.sell = tags.findToBigInt("sell:");
        if (tags.find((x) => x.startsWith("sellable:"))) market.sellable = tags.findToBoolean("sellable:");

        DB.list[itemData.id] = market as ForceDigitalMarket;
    }
});

function validate(tags: string[]) {
    const prefixes = tags.map((x) => x.split(":")[0]);
    if (!prefixes.includes("name") || !prefixes.includes("texture")) return false;
    if (!prefixes.includes("sell") && !prefixes.includes("price")) return false;
    return true;
}
