import { BlockTypes, ItemTypes, Player, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { typeIdToDataId, typeIdToID } from "./typeIds.js";
import DB from "../../DB.js";

let customItems = 0;
let customBlocks = 0;
system.run(() => {
    try {
        const blocks = BlockTypes.getAll()
            .map((x) => x.id)
            .filter((x) => !x.startsWith("minecraft:"));
        customBlocks = blocks.length;
        customItems = ItemTypes.getAll()
            .filter((x) => !x.id.startsWith("minecraft:"))
            .filter((x) => !blocks.includes(x.id)).length;
    } catch (_) {}
});
const sizes = new Map([
    ["single", ["§c§h§e§s§t§2§7§r", 27]],
    ["small", ["§c§h§e§s§t§2§7§r", 27]],
    ["double", ["§c§h§e§s§t§5§4§r", 54]],
    ["large", ["§c§h§e§s§t§5§4§r", 54]],
    ["5", ["§c§h§e§s§t§0§5§r", 5]],
    ["9", ["§c§h§e§s§t§0§9§r", 9]],
    ["18", ["§c§h§e§s§t§1§8§r", 18]],
    ["27", ["§c§h§e§s§t§2§7§r", 27]],
    ["36", ["§c§h§e§s§t§3§6§r", 36]],
    ["45", ["§c§h§e§s§t§4§5§r", 45]],
    ["54", ["§c§h§e§s§t§5§4§r", 54]],
]);
class ChestFormData {
    #titleText;
    #buttonArray;
    /**
     * @remarks The number of slots in the chest ui.
     */
    public slotCount: number;
    /**
     * @param size The size of the chest to display as.
     */
    constructor(size: "small" | "single" | "large" | "double" | "5" | "9" | "18" | "27" | "36" | "45" | "54" = "small") {
        const sizing = (sizes.get(size) as [string, number]) ?? ["§c§h§e§s§t§2§7§r", 27];
        /** @internal */
        this.#titleText = sizing[0];
        /** @internal */
        this.#buttonArray = [];
        for (let i = 0; i < sizing[1]; i++) this.#buttonArray.push(["", undefined]);
        this.slotCount = sizing[1];
    }
    /**
     * @remarks This builder method sets the title for the chest ui.
     * @param text The title text for the chest ui.
     */
    title(text: string) {
        this.#titleText += text;
        return this;
    }
    /**
     * @remarks Adds a button to this chest ui with an icon from a resource pack.
     * @param texture The type ID. **YOU MUST INCLUDE THE ITEM PREFIX!** For vanilla it is `minecraft:`. Check `typeIds.js` for valid items & data values.
     * @param slot The slot to display the item in.
     * @param itemName The name of the item to display.
     * @param itemDesc The item's lore to display.
     * @param stackAmount The stack size for the item. Clamped between 1 & 99.
     * @param durability Durability for the item. Default=0. Clamped between 1 & 99.
     * @param enchanted If the item is enchanted or not.
     */
    button(slot: number, texture: string, itemName?: string, itemDesc?: string[], stackSize = 1) {
        this.#buttonArray.splice(slot, 1, [
            `stack#${Math.min(Math.max(stackSize, 1) || 1, 99)
                .toString()
                .padStart(2, "0")}§r${itemName ?? ""}§r${itemDesc?.length ? `\n§r${itemDesc.join("\n§r")}` : ""}`,
            texture.replaceAll(":", "/"),
        ]);
        return this;
    }
    testButton(slot: number, index: number) {
        const itemName = `${index}`;
        const stackSize = 1;
        const itemDesc: string[] = [];
        const enchanted = false;

        const ID = index;
        this.#buttonArray.splice(slot, 1, [
            `stack#${Math.min(Math.max(stackSize, 1) || 1, 99)
                .toString()
                .padStart(2, "0")}§r${itemName ?? ""}§r${itemDesc?.length ? `\n§r${itemDesc.join("\n§r")}` : ""}`,
            //@ts-ignore
            (ID + (ID < 262 ? 0 : customItems)) * 65536 + !!enchanted * 32768 || "",
        ]);
        return this;
    }
    /**
	* @remarks Fills slots based off of strings and a key, with the first slot being the cordinate that the pattern starts at.
	* @param pattern The pattern to use, with characters not defined in key being left empty.
	* @param key The data to display for each character in the pattern.
	* @example
	* gui.pattern([
				'xxxxxxxxx',
				'x_______x',
				'x___a___x',
				'x_______x',
				'x_______x',
				'xxxxxxxxx'
		], {
			x:  { itemName: '', itemDesc: [], enchanted: false, stackAmount: 1, texture: 'minecraft:stained_glass_pane' },
			a:  { itemName: 'Anvil', itemDesc: [], enchanted: true, stackAmount: 16, texture: 'minecraft:anvil'},
		})
	*/
    pattern(
        pattern: string[],
        key: {
            [key: string]: {
                itemName?: string;
                itemDesc?: string[];
                stackAmount?: number;
                enchanted?: boolean;
                durability?: number;
                texture: string;
            };
        },
    ) {
        for (let i = 0; i < pattern.length; i++) {
            const row = pattern[i];
            for (let j = 0; j < row.length; j++) {
                const letter = row.charAt(j);
                if (key[letter]) {
                    const slot = j + i * 9;
                    const data = key[letter];
                    const ID = typeIdToDataId.get(data.texture) ?? typeIdToID.get(data.texture);
                    this.#buttonArray.splice(slot, 1, [
                        `stack#${Math.min(Math.max(data?.stackAmount ?? 1, 1) || 1, 99)
                            .toString()
                            .padStart(2, "0")}§r${data?.itemName ?? ""}§r${
                            data?.itemDesc?.length ? `\n§r${data?.itemDesc.join("\n§r")}` : ""
                        }`,
                        // @ts-ignore
                        (ID + (ID < 262 ? 0 : customItems)) * 65536 + !!data?.enchanted * 32768 || data.texture,
                    ]);
                }
            }
        }
        return this;
    }
    /**
     * @remarks
     * Creates and shows this modal popup form. Returns
     * asynchronously when the player confirms or cancels the
     * dialog.
     *
     * This function can't be called in read-only mode.
     *
     * @param player
     * Player to show this dialog to.
     */
    show(player: Player) {
        const form = new ActionFormData().title(this.#titleText);
        this.#buttonArray.forEach((button) => {
            form.button(button[0] ?? "", button[1]?.toString());
        });
        return form.show(player);
    }
}

export { ChestFormData };
