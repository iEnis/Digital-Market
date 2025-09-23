import { readdirSync } from "fs";
import path from "path";

const exclude = ["campfire"];

const targetPath = path.join("C:/Users/enis-/Documents/Vanilla/Bedrock/1.21.100.6/resource_pack/textures/blocks");

const result = readdirSync(targetPath)
    .filter((x) => x.endsWith(".png"))
    .filter((x) => x.includes("warped"))
    .filter((x) => {
        for (const el of exclude) {
            if (x.includes(el)) return false;
        }
        return true;
    });

console.log(result);
