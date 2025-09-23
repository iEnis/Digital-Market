/** @import { BuildOptions } from "esbuild" */
import path from "path";

/** @type { BuildOptions } */
export const data = {
    outdir: path.join(import.meta.dirname, "../../.regolith/tmp/BP/scripts"),
    platform: "node",
    format: "esm",
    target: "es2022",
    sourcemap: false,
    logLevel: "info",
    alias: {
        "@chestui": path.join(import.meta.dirname, "../../packs/data/src/modules/chestui")
    }
};