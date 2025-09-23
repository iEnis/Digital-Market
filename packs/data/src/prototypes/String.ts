declare global {
    interface String {
        /**
         * Converts your string to snake Case
         */
        toSnakeCase(): string;
        /**
         * Converts your string to Title Case
         */
        toTitleCase(): string;
        /**
         * Converts the string to a pathlike
         */
        // toPathLike(): string
    }
}

String.prototype.toSnakeCase = function () {
    return this.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/[\s\-]+/g, "_")
        .toLowerCase();
};

String.prototype.toTitleCase = function () {
    return this.replace(/[_\-]+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

// String.prototype.toPathLike = function () {
//     return this.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
//         .toLowerCase();
// };