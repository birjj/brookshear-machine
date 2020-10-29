import React, { Component } from "react";
import { observer } from "mobx-react";
import { action, makeObservable } from "mobx";

import machine from "../machine";
import TwoByte from "./two-byte-inp";
import "./cpu/cpu.css";
import { toHex } from "../utils";

/** @augments {Component<{}, {}>} */
const CPU = observer(class CPU extends Component {
    constructor(props) {
        super(props);

        makeObservable(this, {
            onFrameInput: action,
            updateRegister: action
        });

        this.onFrameInput = this.onFrameInput.bind(this);
    }

    /**
     * Updates the frame value based on an input
     * @param {Number} value
     */
    onFrameInput(value) {
        this.lastEmittedFrame = value;
        machine.frame = Math.floor(value / 2) * 2;
    }

    updateRegister(num, val) {
        machine.cpu[num] = val;
    }

    generateRegisters() {
        const registers$ = [];
        for (let i = 0; i < 16; i += 1) {
            const id = `reg-${i}`;
            registers$.push(
                <div className="register" key={id}>
                    <TwoByte
                        className={[
                            machine.highlights.inputs.cpu.indexOf(i) !== -1
                                ? "highlight-input"
                                : "",
                            machine.highlights.outputs.cpu.indexOf(i) !== -1
                                ? "highlight-output"
                                : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        id={id}
                        onChange={this.updateRegister.bind(this, i)} // eslint-disable-line
                        value={machine.cpu[i]}
                    />
                    <label htmlFor={id}>Register {toHex(i, 1)}:</label>
                </div>
            );
        }

        return registers$;
    }

    render() {
        let frameVal = this.lastEmittedFrame;
        if (machine.frame !== Math.floor(this.lastEmittedFrame / 2) * 2) {
            frameVal = machine.frame;
        }

        return (
            <section className="cpu">
                <div className="counter">
                    <TwoByte
                        id="program-counter"
                        onChange={this.onFrameInput}
                        value={frameVal}
                    />
                    <label htmlFor="program-counter">Program counter:</label>
                </div>
                <div className="registers">{this.generateRegisters()}</div>
            </section>
        );
    }
});

export default CPU;
