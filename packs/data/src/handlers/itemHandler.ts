import type { ItemComponentRegistry } from "@minecraft/server";
import shop from "../components/items/shop.js";

export default function itemHandler(itemReg: ItemComponentRegistry) {
    itemReg.registerCustomComponent(shop.name, shop.comp);
}
