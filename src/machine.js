import { observable, computed } from "mobx";
import { toHex } from "./utils";

class BrookshearMachine {
    @observable speed = 5;
    @observable playing = false;
    @observable frame = 0;
    @observable showingHelp = false;
    @observable cpu = Array(16).fill(0);
    @observable ram = Array(2 ** 8).fill(0);
    @observable comments = Array((2 ** 8) / 2).fill(""); // only 1 comment per 2 ram places
    @observable messages = [];
    @computed get highlights() {
        const command = this.getCommand(this.frame % (2 ** 8));
        const parsed = [
            ...command,
        ].map(v => parseInt(v, 16));
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
                    outputs: { cpu: [], ram: [parsed[3]] },
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
        this.execute = this.execute.bind(this);
        this.tick = this.tick.bind(this);
    }

    getCommand(frame) {
        return [this.ram[frame], this.ram[frame + 1]]
            .map(v => toHex(v || 0))
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

        const ramTarget = parseInt(operands.substring(1), 16);
        const register = parseInt(operands[0], 16);

        this.messages = [];
        let success = true;
        switch (opcode) {
            case "0":
                this.playing = false;
                this.messages = [
                    { text: "Opcode not found. Halting", type: "error" },
                ];
                success = false;
                break;
            case "1":
                this.cpu[register] = this.ram[ramTarget];
                this.messages = [
                    { text: `Copied from cell ${operands.substring(1)} to register ${operands[0]}` },
                ];
                break;
            case "2":
                this.cpu[register] = ramTarget;
                break;
            case "3":
                this.ram[ramTarget] = this.cpu[register];
                break;
            case "4":
                this.cpu[parseInt(operands[2], 16)] = this.cpu[parseInt(operands[1], 16)];
                break;
            default:
                this.playing = false;
                this.messages = [
                    { text: "Unknown opcode found. Halting", type: "error" },
                ];
                success = false;
                break;
        }

        if (success) {
            this.frame += 2;
        }
    }

    tick() {
        if (this.playing) {
            this.execute();
        }

        const speed = this.speed;
        setTimeout(
            this.tick,
            Math.max(1000 / speed, 60)
        );
    }
}

export default (new BrookshearMachine());
