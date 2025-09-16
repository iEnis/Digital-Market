import type { Player } from "@minecraft/server";
import { ChestFormData } from "@chestui/forms.js";

export default function sell(player: Player) {
    const form = new ChestFormData("36");
    form.title("Sell");
    const container = player.getComponent("inventory")?.container!;
    for (let i = 0; i < 36; i++) {
        const item = container.getItem(i);
        const price = item?.getTags().find(x => x.startsWith("digitalmarket:price"))
        if (!price) continue;
        // form.button(i, )
    }
}
