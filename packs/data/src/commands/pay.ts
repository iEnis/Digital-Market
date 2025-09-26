import type { commandType } from "./command.js";
import { Player, system } from "@minecraft/server";

const pay: commandType = {
    cmdData: {
        name: "digitalmarket:pay",
        description: "Transfer Credits to another player",
        cheatsRequired: false,
        permissionLevel: 0,
        mandatoryParameters: [
            { name: "target", type: "PlayerSelector" },
            { name: "amount", type: "Integer" },
        ],
    },
    callback({ sourceEntity: player }, targetPlayers: Player[], amount: number | bigint) {
        if (!(player instanceof Player)) return { status: 1, message: "Only players can execute this command" };
        amount = BigInt(amount);
        if (amount < 1) return { status: 1, message: "Amount must be greater then 0" };

        if (targetPlayers.length > 1) return { status: 1, message: "You can only target 1 Player at a time" };
        const target = targetPlayers[0];

        const hasMoney = player.digitalmarket.hasCredits(amount);
        if (typeof hasMoney === "bigint") return { status: 1, message: "You don't have enough Credits" };

        player.digitalmarket.removeCredits(amount);
        target.digitalmarket.addCredits(amount);
        target.sendMessage(`'${player.name}' has sent you ${amount} Credits`);
        return { status: 0, message: `You have sent ${amount} Credits to '${target.name}'` };
    },
};

export default pay;
