import { Player } from "@minecraft/server";

Object.defineProperty(Player.prototype, "digitalmarket", {
    get: function () {
        const player: Player = this;
        return {
            getCredits() {
                let cur = player.getDynamicProperty("digitalmarket");
                if (typeof cur !== "string") cur = "0";
                return BigInt(cur);
            },
            hasCredits(amount) {
                let cur = player.getDynamicProperty("digitalmarket");
                if (typeof cur !== "string") cur = "0";
                return BigInt(cur) >= amount;
            },
            addCredits(amount) {
                let cur = player.getDynamicProperty("digitalmarket");
                if (typeof cur !== "string") cur = "0";
                const res = BigInt(cur) + amount;
                player.setDynamicProperty("digitalmarket:credits", res.toString());
                return res;
            },
            removeCredits(amount) {
                let cur = player.getDynamicProperty("digitalmarket");
                if (typeof cur !== "string") cur = "0";
                const res = BigInt(cur) - amount;
                player.setDynamicProperty("digitalmarket:credits", res.toString());
                return res;
            },
            setCredits(amount) {
                player.setDynamicProperty("digitalmarket:credits", amount.toString());
                return amount;
            },
        } satisfies digitalmarketPlayer;
    },
});

interface digitalmarketPlayer {
    /**
     * Gets the Credits the Player has
     */
    getCredits(): bigint;
    /**
     * Checks if the Player has at least a set amount of Credits
     * @param amount amount to check
     * @returns if he has enough
     */
    hasCredits(amount: bigint): boolean;
    /**
     * Adds Credits to the Player
     * @param amount amount to add
     * @returns the new amount of credits
     */
    addCredits(amount: bigint): bigint;
    /**
     * Removes Credits from the Player
     * @param amount amount to remove
     * @returns the new amount of credits
     */
    removeCredits(amount: bigint): bigint;
    /**
     * Sets the amount of credits for the Player
     * @param amount amount to set
     * @returns the new amount of credits
     */
    setCredits(amount: bigint): bigint;
}

declare module "@minecraft/server" {
    interface Player {
        digitalmarket: digitalmarketPlayer;
    }
}
