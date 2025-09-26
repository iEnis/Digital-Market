import type { Player, Container } from "@minecraft/server";
import { ChestFormData } from "@chestui/forms.js";
import CONFIG from "../CONFIG.js";
import DB from "../DB.js";

export default function sell(player: Player) {
    const form = new ChestFormData("36");
    form.title("Sell");
    const container = player.getComponent("inventory")?.container!;

    for (let i = 9; i < 36; i++) {
        manage(form, container, i - 9, i);
    }
    for (let i = 0; i < 9; i++) {
        manage(form, container, i + 27, i);
    }
    form.show(player).then((res) => {
        if (res.canceled || res.selection === undefined) return;
        const slot = res.selection > 27 ? res.selection - 27 : res.selection + 9;
        const container = player.getComponent("inventory")?.container!;
        const item = container.getItem(slot);
        if (!item) return;
        const info = DB.list?.[item.typeId];
        if (!info) return;

        container.setItem(slot, undefined);
        const price = !!info?.sell ? info.sell : Math.floorBigInt(info.price, CONFIG.defaultDivider) * BigInt(item.amount);
        player.digitalmarket.addCredits(price);
        player.sendMessage(`Sold '${info.name}' for ${price} Credits`);
        player.playSound("random.levelup");
    });
}

function manage(form: ChestFormData, container: Container, i: number, realIndex: number) {
    const item = container.getItem(realIndex);
    if (!item) return;
    const info = DB.list?.[item.typeId];
    if (!info) return;
    const price = !!info?.sell ? info.sell : Math.floorBigInt(info.price ?? 1n, CONFIG.defaultDivider) * BigInt(item.amount);
    const lore = ["", "§6Sell Price:", `§6${price} Credits`];
    if (price !== info.price)
        lore.push(
            ...["", "§eSell Price per item:", `§e${Math.floorBigInt(info.price ?? 1n, CONFIG.defaultDivider)} Credits`],
        );

    form.button(i, info.texture, info.name, lore, item.amount);
}
