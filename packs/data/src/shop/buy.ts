import { ModalFormData } from "@minecraft/server-ui";
import { ChestFormData } from "@chestui/forms.js";
import { ItemStack, type Player } from "@minecraft/server";
import CONFIG from "../CONFIG.js";
import DB, { ForceDigitalMarket } from "../DB.js";

export default function buy(player: Player) {
    const form = new ModalFormData().title("Search").textField("", "Search Text").submitButton("Search");
    form.show(player).then((res) => {
        if (res.canceled || res.formValues === undefined) return;
        return buyMenu(player, res.formValues[0]);
    });
}

function getSize(len: number) {
    if (len <= 9) return "9";
    else if (len <= 18) return "18";
    else if (len <= 27) return "27";
    else if (len <= 36) return "36";
    else if (len <= 45) return "45";
    else if (len <= 54) return "54";
    else return "54";
}

function buyMenu(player: Player, searchQuery: string) {
    const filtered = Object.values(DB.list)
        .filter((x) => "price" in x)
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((x) => x.name.toLowerCase().includes(searchQuery.toLowerCase()));

    filtered.length = filtered.length > 54 ? 54 : filtered.length;
    if (filtered.length === 0) return player.sendMessage("No items found");

    const form = new ChestFormData(getSize(filtered.length));
    form.title(searchQuery);
    for (let i = 0; i < filtered.length; i++) {
        const item = filtered[i];
        form.button(i, item.texture, item.name, ["", `§5Price: ${item.price}`]);
    }
    form.show(player).then((res) => {
        if (res.canceled || res.selection === undefined) return;

        const targetItem = filtered[res.selection];
        const stackable = new ItemStack(targetItem.typeId).isStackable;
        const check = player.digitalmarket.hasCredits(targetItem.price);
        if (typeof check === "bigint") return player.sendMessage(`You don't have enough money. Missing ${check} Credits`);

        if (stackable) return buyAmount(player, targetItem);

        const container = player.getComponent("inventory")!.container;
        if (container.emptySlotsCount === 0) return player.sendMessage("Your inventory is full!");

        player.digitalmarket.removeCredits(targetItem.price);
        container.addItem(new ItemStack(targetItem.typeId, 1));
        buyMenu(player, searchQuery);
        player.sendMessage(`Bought '${targetItem.name}'`);
        player.playSound("random.levelup");
    });
}

function buyAmount(player: Player, item: ForceDigitalMarket) {
    const max = Number(player.digitalmarket.getCredits() % item.price);
    const maxMc = max > 64 ? 64 : max;
    const form = new ModalFormData().title("Buy").slider("Amount", 1, maxMc, 1, maxMc).submitButton("Buy");
    form.show(player).then((res) => {
        if (res.canceled || res.formValues === undefined) return;
        const price = BigInt(res.formValues[0]) * item.price;

        const check = player.digitalmarket.hasCredits(price);
        if (typeof check === "bigint") return player.sendMessage(`You don't have enough money. Missing ${check} Credits`);

        const container = player.getComponent("inventory")!.container;
        if (container.emptySlotsCount === 0) return player.sendMessage("Your inventory is full!");

        player.digitalmarket.removeCredits(price);
        container.addItem(new ItemStack(item.typeId, res.formValues[0]));
        player.sendMessage(`Bought ${res.formValues[0]}x '${item.name}'`);
        player.playSound("random.levelup");
        if (max - res.formValues[0] > 0) return buyAmount(player, item);
    });
}
