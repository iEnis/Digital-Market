declare global {
    interface Array<T> {
        /**
         * Returns the first element that starts with the search string, replaces it and returns it
         * @param start The starting characters of the search query
         */
        findStartReplace(this: string[], start: string, toReplace?: string): string | undefined;
        /**
         * Returns the first element that starts with the search string, replaces it, converts it to a bigint and returns it
         * @param start The starting characters of the search query
         * 
         * @throws This function may throw errors
         */
        findToBigInt(this: string[], start: string): bigint | undefined;
        /**
         * Returns the first element that starts with the search string, replaces it, converts it to a boolean and returns it
         * @param start The starting characters of the search query
         */
        findToBoolean(this: string[], start: string): boolean;
    }
}

Array.prototype.findStartReplace = function <T>(this: string[], start: string, toReplace = "") {
    return this.find((x) => x.startsWith(start))?.replace(start, toReplace);
};

Array.prototype.findToBigInt = function <T>(this: string[], start: string) {
    return BigInt(this.find((x) => x.startsWith(start))?.replace(start, "")!);
};

Array.prototype.findToBoolean = function <T>(this: string[], start: string) {
    return Boolean(this.find((x) => x.startsWith(start))?.replace(start, "") ?? true);
};