declare global {
    interface Math {
        /**
         * Divides the first bigint expression with the second one and floors the result
         * @param x The first bigint expression.
         * @param y The second bigint expression.
         */
        floorBigInt(x: bigint, y: bigint, allowNeg?: boolean): bigint;
        /**
         * Divides the first bigint expression with the second one and ceils the result
         * @param x The first bigint expression.
         * @param y The second bigint expression.
         */
        ceilBigInt(x: bigint, y: bigint, allowNeg?: boolean): bigint;
    }
}

Math.floorBigInt = function (x: bigint, y: bigint, allowNeg: false) {
    let result = x / y;
    let rest = x % y;
    if (rest !== 0n && x < 0n !== y < 0n) result -= 1n;
    if (result <= 1n && !allowNeg) return 1n;
    return result;
};

Math.ceilBigInt = function (x: bigint, y: bigint, allowNeg: false) {
    let result = x / y;
    let rest = x % y;
    if (rest !== 0n && x < 0n === y < 0n) result += 1n;
    if (result < 1n && !allowNeg) return 0n;
    return result;
};
