import type { CustomCommandRegistry } from "@minecraft/server";
import divider from "../commands/divider.js";
import balance from "../commands/balance.js";
import pay from "../commands/pay.js";

export default function commandHandler(cmdReg: CustomCommandRegistry) {
    cmdReg.registerCommand(divider.cmdData, divider.callback);
    cmdReg.registerCommand(balance.cmdData, balance.callback);
    cmdReg.registerCommand(pay.cmdData, pay.callback);
}
