import type { Player, RawMessage } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import {
    custom_content,
    custom_content_keys,
    inventory_enabled,
    number_of_custom_items,
    CHEST_UI_SIZES,
} from "./constants.js";
import { typeIdToDataId, typeIdToID } from "./typeIds.js";

class ChestFormData {
    #titleText;
    #buttonArray;
    slotCount: number;
    /**
     * @param size The size of the chest to display as.
     */
    constructor(size: "small" | "single" | "large" | "double" | "5" | "9" | "18" | "27" | "36" | "45" | "54" = "small") {
        const sizing = (CHEST_UI_SIZES.get(size) ?? ["§c§h§e§s§t§2§7§r", 27]) as unknown as number[];
        /** @internal */
        this.#titleText = { rawtext: [{ text: `${sizing[0]}` }] };
        /** @internal */
        this.#buttonArray = Array(sizing[1]).fill(["", undefined]);
        this.slotCount = sizing[1];
    }
    /**
     * @remarks This builder method sets the title for the chest ui.
     * @param text The title text for the chest ui.
     */
    title(text: string | RawMessage) {
        if (typeof text === "string") {
            this.#titleText.rawtext.push({ text: text });
        } else if (typeof text === "object") {
            if (text.rawtext) {
                /** @ts-ignore */
                this.#titleText.rawtext.push(...text.rawtext);
            } else {
                /** @ts-ignore */
                this.#titleText.rawtext.push(text);
            }
        }
        return this;
    }
    /**
     * @remarks Adds a button to this chest ui with an icon from a resource pack.
     * @param slot The slot to display the item in.
     * @param itemName The name of the item to display.
     * @param itemDesc The item's lore to display.
     * @param texture The type ID or the path to the texture. **YOU MUST INCLUDE THE ITEM PREFIX!** For vanilla it is `minecraft:`. Check `typeIds.js` for valid items & data values.
     * @param stackAmount The stack size for the item. Clamped between 1 & 99.
     * @param durability Durability for the item. Default=0. Clamped between 1 & 99.
     * @param enchanted If the item is enchanted or not.
     */
    button(
        slot: number,
        itemName: string | RawMessage,
        itemDesc: (string | RawMessage)[],
        texture: string,
        stackSize = 1,
        durability = 0,
        enchanted = false,
    ) {
        const targetTexture = custom_content_keys.has(texture) ? custom_content[texture]?.texture : texture;
        const ID = typeIdToDataId.get(targetTexture) ?? typeIdToID.get(targetTexture);
        let buttonRawtext = {
            rawtext: [
                {
                    text: `stack#${String(Math.min(Math.max(stackSize, 1), 99)).padStart(2, "0")}dur#${String(
                        Math.min(Math.max(durability, 0), 99),
                    ).padStart(2, "0")}§r`,
                },
            ],
        };
        if (typeof itemName === "string") {
            buttonRawtext.rawtext.push({ text: itemName ? `${itemName}§r` : "§r" });
        } else if (typeof itemName === "object" && itemName.rawtext) {
            /** @ts-ignore */
            buttonRawtext.rawtext.push(...itemName.rawtext, { text: "§r" });
        } else return this;
        if (Array.isArray(itemDesc) && itemDesc.length > 0) {
            for (const obj of itemDesc) {
                if (typeof obj === "string") {
                    buttonRawtext.rawtext.push({ text: `\n${obj}` });
                } else if (typeof obj === "object" && obj.rawtext) {
                    /** @ts-ignore */
                    buttonRawtext.rawtext.push({ text: `\n` }, ...obj.rawtext);
                }
            }
        }
        this.#buttonArray.splice(Math.max(0, Math.min(slot, this.slotCount - 1)), 1, [
            buttonRawtext,
            ID === undefined
                ? targetTexture
                : (ID + (ID < 256 ? 0 : number_of_custom_items)) * 65536 + (enchanted ? 32768 : 0),
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
                itemName?: string | RawMessage;
                itemDesc?: (string | RawMessage)[];
                stackSize?: number;
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
                const data = key[letter];
                if (!data) continue;
                const slot = j + i * 9;
                const targetTexture = custom_content_keys.has(data.texture)
                    ? custom_content[data.texture]?.texture
                    : data.texture;
                const ID = typeIdToDataId.get(targetTexture) ?? typeIdToID.get(targetTexture);
                const { stackSize: stackAmount = 1, durability = 0, itemName, itemDesc, enchanted = false } = data;
                const stackSize = String(Math.min(Math.max(stackAmount, 1), 99)).padStart(2, "0");
                const durValue = String(Math.min(Math.max(durability, 0), 99)).padStart(2, "0");
                let buttonRawtext = {
                    rawtext: [{ text: `stack#${stackSize}dur#${durValue}§r` }],
                };
                if (typeof itemName === "string") {
                    buttonRawtext.rawtext.push({ text: `${itemName}§r` });
                } else if (itemName?.rawtext) {
                    /** @ts-ignore */
                    buttonRawtext.rawtext.push(...itemName.rawtext, { text: "§r" });
                } else continue;
                if (Array.isArray(itemDesc) && itemDesc.length > 0) {
                    for (const obj of itemDesc) {
                        if (typeof obj === "string") {
                            buttonRawtext.rawtext.push({ text: `\n${obj}` });
                        } else if (obj?.rawtext) {
                            buttonRawtext.rawtext.push({ text: `\n`, ...obj.rawtext });
                        }
                    }
                }
                this.#buttonArray.splice(Math.max(0, Math.min(slot, this.slotCount - 1)), 1, [
                    buttonRawtext,
                    ID === undefined
                        ? targetTexture
                        : (ID + (ID < 256 ? 0 : number_of_custom_items)) * 65536 + (enchanted ? 32768 : 0),
                ]);
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
            form.button(button[0], button[1]?.toString());
        });
        if (!inventory_enabled) return form.show(player);
        /** @type {Container} */
        const container = player.getComponent("inventory")!.container;
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (!item) continue;
            const typeId = item.typeId;
            const targetTexture = custom_content_keys.has(typeId) ? custom_content[typeId]?.texture : typeId;
            const ID = typeIdToDataId.get(targetTexture) ?? typeIdToID.get(targetTexture);
            const durability = item.getComponent("durability");
            const durDamage = durability
                ? Math.round(((durability.maxDurability - durability.damage) / durability.maxDurability) * 99)
                : 0;
            const amount = item.amount;
            const formattedItemName = typeId
                .replace(/.*(?<=:)/, "")
                .replace(/_/g, " ")
                .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
            let buttonRawtext = {
                rawtext: [
                    {
                        text: `stack#${String(amount).padStart(2, "0")}dur#${String(durDamage).padStart(
                            2,
                            "0",
                        )}§r${formattedItemName}`,
                    },
                ],
            };
            const loreText = item.getLore().join("\n");
            if (loreText) buttonRawtext.rawtext.push({ text: loreText });
            const finalID = ID === undefined ? targetTexture : (ID + (ID < 256 ? 0 : number_of_custom_items)) * 65536;
            form.button(buttonRawtext, finalID.toString());
        }
        return form.show(player);
    }
}

export { ChestFormData };
