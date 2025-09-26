import { system } from "@minecraft/server";
import commandHandler from "./commandHandler.js";
import itemHandler from "./itemHandler.js";

system.beforeEvents.startup.subscribe(
    ({
        customCommandRegistry: cmdReg,
        itemComponentRegistry: itemReg,
        // blockComponentRegistry: blockReg,
    }) => {
        commandHandler(cmdReg);
        itemHandler(itemReg);
    },
);
