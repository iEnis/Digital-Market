import { data } from "./shared.js";

import { build } from "esbuild";
import { globby } from "globby";

const entryPoints = [...await globby("../../packs/data/src/**/*.ts"), ...await globby("../../packs/data/src/**/*.js")];

await build({
    ...data,
    entryPoints,
    bundle: false,
});
