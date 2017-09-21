import machine from "./machine";

/**
 * Given a value, returns the 8-bit string that represents it as a positive integer
 */
export function toBitString(value) {
    if (value < 0 || value > 255) {
        console.warn("Attempted to convert out-of-bounds value", value); // eslint-disable-line no-console
    }
    return value.toString(2).padStart(8, "0").substr(-8);
}

/**
 * Given a value, returns the hex that represents it as a positive integer
 */
export function toHex(value) {
    if (value < 0 || value > 255) {
        console.warn("Attempted to convert out-of-bounds value", value); // eslint-disable-line no-console
    }
    const bitstring = toBitString(value);
    return (
        parseInt(bitstring.substr(0, 4), 2).toString(16)
        + parseInt(bitstring.substr(4, 4), 2).toString(16)
    ).toUpperCase();
}

/**
 * Given a hex string, returns the positive integer it represents
 */
export function fromHex(str) {
    if (str.length > 2) {
        console.warn("Attempted to convert out-of-bounds string", str); // eslint-disable-line no-console
    }
    return parseInt(str, 16);
}

/**
 * Given a value, returns the 8-bit string that represents it in two's-complement notation
 */
export function toTwosBitString(value) {
    if (value < -128 || value > 127) {
        console.warn("Attempted to convert out-of-bounds value", value); // eslint-disable-line no-console
    }
    const offset = value < 0 ? -128 : 0;
    const sign = value < 0 ? "1" : "0";
    const val = (value - offset);
    return sign + val.toString(2).padStart(7, "0");
}

/**
 * Given a value, returns the two-character hex representation in two's-complement notation
 */
export function toTwosHex(value) {
    if (value < -128 || value > 127) {
        console.warn("Attempted to convert out-of-bounds value", value); // eslint-disable-line no-console
    }
    const bitstring = toTwosBitString(value);
    return (
        parseInt(bitstring.substr(0, 4), 2).toString(16)
        + parseInt(bitstring.substr(4, 4), 2).toString(16)
    ).toUpperCase();
}

/**
 * Given a hex string, returns its value interpreted in two's-complement notation
 */
export function fromTwosHex(str) {
    const bitstring = parseInt(str, 16).toString(2).padStart(4 * str.length, "0");
    const offset = bitstring[0] === "1" ? -(2 ** (bitstring.length - 1)) : 0;
    return offset + parseInt(bitstring.substr(1), 2);
}

/**
 * Given a hex string, returns its value interpreted as float
 */
export function hexToFloat(hex) {
    const str = toBitString(fromHex(hex));
    const sign = str[0] === "1" ? -1 : 1;
    const exp = parseInt(str.substr(1, 3), 2) - (2 ** 2);
    const mantisse = `1${str.substr(4)}`;
    return [...mantisse].reduce(
        (p, v, i) => {
            const factor = 2 ** (exp - i);
            return p + (factor * v);
        },
        0
    ) * sign;
}

/**
 * Given a value, converts it to a bit string
 */

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
