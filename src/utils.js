import machine from "./machine";

/**
 * Given a value, returns the two-character hex representation
 */
export function toHex(value) {
    return (value || 0).toString(16).toUpperCase().padStart(2, "0");
}

/**
 * Given two values (in total a byte), returns an auto-generated comment for them
 * @param {Array<Number>} values
 * @returns {String}
 */
export function byteToComment(values) {
    const str = values
        .map(toHex)
        .join("");

    switch (str[0]) {
        case "1":
            return `Copy bits at cell ${str[2] + str[3]} to register ${str[1]}`;
        case "2":
            return `Copy bit-string ${str[2] + str[3]} to register ${str[1]}`;
        case "3":
            return `Copy bits in register ${str[1]} to cell ${str[2] + str[3]}`;
        case "4":
            return `Copy bits in register ${str[2]} to register ${str[3]}`;
        case "5":
            return `Add bits in registers ${str[2]} and ${str[3]} (two's-complement), put in ${str[1]}`;
        case "6":
            return `Add bits in registers ${str[2]} and ${str[3]} (float), put in register ${str[1]}`;
        case "7":
            return `Bitwise OR bits in registers ${str[2]} and ${str[3]}, put in register ${str[1]}`;
        case "8":
            return `Bitwise AND bits in registers ${str[2]} and ${str[3]}, put in register ${str[1]}`;
        case "9":
            return `Bitwise XOR bits in register ${str[2]} and ${str[3]}, put in register ${str[1]}`;
        case "A":
            return `Rotate bits in register ${str[1]} cyclically right ${str[3]} steps`;
        case "B":
            return `Jump to cell ${str[2] + str[3]} if register ${str[1]} equals register 0`;
        case "C":
            return "Halt";
        case "D":
            return `Jump to cell ${str[2] + str[3]} if register ${str[1]} is greater than register 0`;
        default:
            return "";
    }
}

/**
 * Given the index of the first of two values, returns the comment for them
 * @param {Number} index
 * @returns {String}
 */
export function indexToComment(index) {
    const ownComment = machine.comments[Math.floor(index / 2)];
    if (ownComment) {
        return ownComment;
    }
    return byteToComment([
        machine.ram[index],
        machine.ram[index + 1],
    ]);
}
