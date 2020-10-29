import { observable, computed, makeObservable } from "mobx";
import { toHex, fromHex, toBitString, floatToHex, hexToFloat } from "./utils";

type Message = {
    text: string;
    type?: "error" | "loader";
};
type Highlight = {
    inputs: { cpu: number[]; ram: number[] };
    outputs: { cpu: number[]; ram: number[] };
};

class BrookshearMachine {
    speed = 5;
    playing = false;
    frame = 0;
    showingHelp = false;
    showingModal = "";
    cpu: number[] = Array(16).fill(0);
    ram: number[] = Array(2 ** 8).fill(0);
    comments: string[] = Array(2 ** 8 / 2).fill(""); // only 1 comment per 2 ram places
    messages: Message[] = [];
    warning?: string;

    get highlights(): Highlight {
        const command = this.getCommand(this.frame % 2 ** 8);
        const parsed = [...command].map((v) => parseInt(v, 16));
        const lastTwoParsed = parseInt(command.substr(2, 2), 16);
        switch (command[0]) {
            case "1":
                return {
                    inputs: { cpu: [], ram: [lastTwoParsed] },
                    outputs: { cpu: [parsed[1]], ram: [] },
                };
            case "2":
                return {
                    inputs: { cpu: [], ram: [] },
                    outputs: { cpu: [parsed[1]], ram: [] },
                };
            case "3":
                return {
                    inputs: { cpu: [parsed[1]], ram: [] },
                    outputs: { cpu: [], ram: [lastTwoParsed] },
                };
            case "4":
                return {
                    inputs: { cpu: [parsed[2]], ram: [] },
                    outputs: { cpu: [parsed[3]], ram: [] },
                };
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                return {
                    inputs: { cpu: [parsed[2], parsed[3]], ram: [] },
                    outputs: { cpu: [parsed[1]], ram: [] },
                };
            case "A":
                return {
                    inputs: { cpu: [parsed[1]], ram: [] },
                    outputs: { cpu: [parsed[1]], ram: [] },
                };
            case "B":
            case "D":
                return {
                    inputs: { cpu: [parsed[1], 0], ram: [] },
                    outputs: { cpu: [], ram: [] },
                };
            default:
                return {
                    inputs: { cpu: [], ram: [] },
                    outputs: { cpu: [], ram: [] },
                };
        }
    }

    constructor() {
        makeObservable(this, {
            speed: observable,
            playing: observable,
            frame: observable,
            showingHelp: observable,
            showingModal: observable,
            cpu: observable,
            ram: observable,
            comments: observable,
            messages: observable,
            highlights: computed,
        });

        this.execute = this.execute.bind(this);
        this.tick = this.tick.bind(this);
    }

    getCommand(frame: number) {
        return [this.ram[frame], this.ram[frame + 1]]
            .map((v) => toHex(v || 0))
            .join("");
    }

    /**
     * Executes the instruction at the current program counter.
     * Also increments the program counter if succesful
     */
    execute() {
        this.frame %= 2 ** 8;
        const command = this.getCommand(this.frame);

        const opcode = command[0];
        const operands = command.substring(1);

        const ramTarget = fromHex(operands.substr(1));
        const register = parseInt(operands[0], 16);

        this.messages = [];
        let proceed = true;

        if (opcode === "0") {
            this.playing = false;
            this.messages = [
                { text: "Opcode not found. Halting", type: "error" },
            ];
            proceed = false;
        } else if (opcode === "1") {
            this.cpu[register] = this.ram[ramTarget];
            this.messages = [
                {
                    text: `Copied from cell ${operands.substring(
                        1
                    )} to register ${operands[0]}`,
                },
            ];
        } else if (opcode === "2") {
            this.cpu[register] = fromHex(operands.substr(1));
            this.messages = [
                {
                    text: `Set content of register ${
                        operands[0]
                    } to ${operands.substring(1)}`,
                },
            ];
        } else if (opcode === "3") {
            this.ram[ramTarget] = this.cpu[register];
            this.messages = [
                {
                    text: `Copied from register ${
                        operands[0]
                    } to cell ${operands.substring(1)}`,
                },
            ];
        } else if (opcode === "4") {
            this.cpu[parseInt(operands[2], 16)] = this.cpu[
                parseInt(operands[1], 16)
            ];
            this.messages = [
                {
                    text: `Copied from register ${operands[1]} to register ${operands[2]}`,
                },
            ];
        } else if (opcode === "5") {
            this.cpu[register] =
                (this.cpu[parseInt(operands[1], 16)] +
                    this.cpu[parseInt(operands[2], 16)]) %
                256;
            this.messages = [
                {
                    text: `Added register ${operands[1]} and register ${operands[2]}, put result in register ${operands[0]}`,
                },
            ];
        } else if (opcode === "6") {
            const floats = [1, 2].map((v) =>
                hexToFloat(toHex(this.cpu[parseInt(operands[v], 16)]))
            );
            this.cpu[register] = fromHex(floatToHex(floats[0] + floats[1]));
            this.messages = [
                {
                    text: `Added register ${operands[1]} and register ${operands[2]}, put result in register ${operands[0]}`,
                },
            ];
        } else if (opcode === "7") {
            this.cpu[register] =
                this.cpu[parseInt(operands[1], 16)] | // eslint-disable-line no-bitwise
                this.cpu[parseInt(operands[2], 16)];
            this.messages = [
                {
                    text: `OR of register ${operands[1]} and register ${operands[2]}, put result in register ${operands[0]}`,
                },
            ];
        } else if (opcode === "8") {
            this.cpu[register] =
                this.cpu[parseInt(operands[1], 16)] & // eslint-disable-line no-bitwise
                this.cpu[parseInt(operands[2], 16)];
            this.messages = [
                {
                    text: `AND of register ${operands[1]} and register ${operands[2]}, put result in register ${operands[0]}`,
                },
            ];
        } else if (opcode === "9") {
            this.cpu[register] =
                this.cpu[parseInt(operands[1], 16)] ^ // eslint-disable-line no-bitwise
                this.cpu[parseInt(operands[2], 16)];
            this.messages = [
                {
                    text: `XOR of register ${operands[1]} and register ${operands[2]}, put result in register ${operands[0]}`,
                },
            ];
        } else if (opcode === "A") {
            const bitstring = toBitString(this.cpu[register]);
            const offset = fromHex(operands[2]);
            const rotated =
                bitstring.substr(-offset) +
                bitstring.substr(0, (8 - offset) % 8);

            this.cpu[register] = fromHex(parseInt(rotated, 2).toString(16));
            this.messages = [
                {
                    text: `Rotated register ${operands[0]} ${operands[2]} places to the right`,
                },
            ];
        } else if (opcode === "B") {
            if (this.cpu[register] === this.cpu[0]) {
                this.frame = parseInt(operands.substr(1), 16);
                this.messages = [{ text: `Jumped to ${operands.substr(1)}` }];
                proceed = false;
            }
        } else if (opcode === "C") {
            this.playing = false;
            this.messages = [{ text: "Halted" }];
            proceed = false;
        } else if (opcode === "D") {
            if (this.cpu[register] > this.cpu[0]) {
                this.frame = parseInt(operands.substr(1), 16);
                this.messages = [{ text: `Jumped to ${operands.substr(1)}` }];
                proceed = false;
            }
        } else {
            this.playing = false;
            this.messages = [
                { text: "Unknown opcode found. Halting", type: "error" },
            ];
            proceed = false;
        }

        if (proceed) {
            this.frame += 2;
        }
    }

    tick() {
        if (this.playing) {
            this.execute();
        }

        const speed = this.speed;
        setTimeout(this.tick, Math.max(1000 / speed, 60));
    }
}

export default new BrookshearMachine();
