import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import sell from "./sell.js";
import buy from "./buy.js";

export default function shopUI(player: Player) {
    const form = new ActionFormData();
    form.button("Sell");
    form.button("Buy");
    form.show(player).then((res) => {
        if (res.canceled || !res.selection) return;
        switch (res.selection) {
            case 0:
                return sell(player);
                break;
            case 1:
                return buy(player);
                break;
        }
    });
}
