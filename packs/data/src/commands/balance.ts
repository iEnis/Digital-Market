import type { commandType } from "./command.js";
import { Player, world } from "@minecraft/server";
import CONFIG from "../CONFIG.js";

const balance: commandType = {
    cmdData: {
        name: "digitalmarket:balance",
        description: "Get the current balance of someone",
        cheatsRequired: false,
        permissionLevel: 0,
        optionalParameters: [{ name: "target", type: "PlayerSelector" }],
    },
    callback({ sourceEntity: player }, targetPlayers?: Player[]) {
        if (!(player instanceof Player)) return { status: 1, message: "Only players can execute this command" };
        let target = player;
        if (targetPlayers && targetPlayers.length > 1) return {status: 1, message: "You can only target 1 Player at a time"};
        else if (targetPlayers) target = targetPlayers[0];

        return { status: 0, message: `'${target.name}' has ${target.digitalmarket.getCredits()} Credits` };
    },
};

export default balance;
