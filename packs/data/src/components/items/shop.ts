import { itemType } from "./items.js";
import shopUI from "../../shop/index.js";

const shop: itemType = {
    name: "digitalmarket:shop",
    comp: {
        onUse({ source: player }) {
            shopUI(player);
        },
    },
};

export default shop;
