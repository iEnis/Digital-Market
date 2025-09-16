import { system } from "@minecraft/server";
import shopUI from "../shop/index.js";

system.beforeEvents.startup.subscribe(({ itemComponentRegistry: itemReg }) => {
    itemReg.registerCustomComponent("digitalmarket:openshop", {
        onUse({ source: player }) {
            shopUI(player);
        },
    });
});
