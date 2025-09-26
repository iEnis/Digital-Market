import type { CustomCommand, CustomCommandOrigin, CustomCommandResult } from "@minecraft/server";

export type commandType = {
    cmdData: CustomCommand;
    callback: (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined;
};
