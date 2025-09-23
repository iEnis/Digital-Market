import type { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { ChestFormData } from "@chestui/forms.js";
import DB from "../DB.js";

export default function buy(player: Player) {
    // testFn(player);
    const form = new ModalFormData()
        .title("Search")
        .dropdown("", ["startsWith", "includes"])
        .textField("", "Search Text")
        .submitButton("Search");
    form.show(player).then((res) => {
        if (res.canceled || res.formValues === undefined) return;
        return buyMenu(player, res.formValues[1], !res.formValues[0]);
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

function buyMenu(player: Player, searchQuery: string, startsWith: boolean) {
    const filtered = Object.values(DB.list)
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((x) => x.name.toLowerCase()[startsWith ? "startsWith" : "includes"](searchQuery.toLowerCase()));

    filtered.length = filtered.length > 54 ? 54 : filtered.length;
    if (filtered.length === 0) return player.sendMessage("No items found");

    const form = new ChestFormData(getSize(filtered.length));
    form.title(`§l[${startsWith ? "S" : "I"}]§r ${searchQuery}`);
    for (let i = 0; i < filtered.length; i++) {
        const item = filtered[i];
        if (!item.price) continue;
        form.button(i, item.texture, item.name, ["", `§5Price: ${item.price}`]);
    }
    form.show(player).then((res) => {
        if (res.canceled || res.selection === undefined) return;
    });
}

const switcher = (input: number) => {
    if (input >= 0 && input < 9) return -27;
    else if (input >= 9 && input < 18) return -18;
    else if (input >= 19 && input < 27) return -9;
    else if (input >= 27 && input < 36) return 9;
    else if (input >= 36 && input < 45) return 18;
    else if (input >= 45 && input < 54) return 27;
    else return 0;
};

function testFn(player: Player, extra = 0) {
    const form = new ChestFormData("54");
    form.title("Buy");
    for (let i = 0; i < 54; i++) {
        // form.testButton(i, 325 + (i) / 65536);
        form.testButton(i, 256 + i + extra);
        // form.testButton(i, -9753 + i + extra);
        // form.button(i, "test", [], "minecraft:diamond")
    }
    // const container = player.getComponent("inventory")?.container!;
    // for (let i = 0; i < 36; i++) {
    //     const item = container.getItem(i);
    //     if (!item) continue;
    //     const info = getInfo(item, 3n);
    //     if (!info) continue;
    //     const lore = ["Sell Price:", `${info.price} Credits`];
    //     if (info.price !== info.price1) lore.push(...["Sell Price per item:", `${info.price1} Credits`]);
    //     form.button(i, item.localizationKey, lore, info.texture, item.amount);
    // }
    form.show(player).then((res) => {
        if (res.canceled || res.selection === undefined) return;
        return testFn(player, switcher(res.selection) + extra);
    });
}
