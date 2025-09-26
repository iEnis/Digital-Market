import type { commandType } from "./command.js";
import { Player, world } from "@minecraft/server";
import CONFIG from "../CONFIG.js";

const divider: commandType = {
    cmdData: {
        name: "digitalmarket:divider",
        description: "Set the dividing amount of price to sell conversion for default behavior (default 3)",
        cheatsRequired: true,
        permissionLevel: 2,
        optionalParameters: [{ name: "amount", type: "Integer" }],
    },
    callback({ sourceEntity: player }, amount?: number) {
        if (!(player instanceof Player)) return { status: 1, message: "Only players can execute this command" };

        if (amount === undefined) return { status: 0, message: `The current divider amount is ${CONFIG.defaultDivider}` };
        if (amount < 1) return { status: 1, message: "Amount must be greater then 0" };

        CONFIG.defaultDivider = BigInt(amount);
        world.setDynamicProperty("digitalmarket:defaultDivider", amount);
        return { status: 0, message: `Set divider amount to ${CONFIG.defaultDivider}` };
    },
};

export default divider;
