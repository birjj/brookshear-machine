import React, { Component } from "react";
import { observer } from "mobx-react";
import { action, makeObservable } from "mobx";

import "./ram/ram.css";
import machine from "../machine";
import Cell from "./cell";
import { indexToComment } from "../utils";

/** @augments {Component<{}, {}>} */
const RAM = observer(class RAM extends Component {
    constructor(props) {
        super(props);

        makeObservable(this, {
            onRamChange: action,
            onCommentChange: action
        });
    }

    onRamChange(i, val) {
        machine.ram[i] = val[0];
        machine.ram[i + 1] = val[1];
    }

    onCommentChange(i, val) {
        machine.comments[i / 2] = val;
    }

    generateCells() {
        const cells = [];
        for (let i = 0; i < 2 ** 8; i += 2) {
            const j = i;
            const index = i.toString(16).padStart(2, "0").toUpperCase();
            const index2 = (i + 1).toString(16).padStart(2, "0").toUpperCase();
            const isActive = machine.frame === i || machine.frame === i + 1;
            const classNames = [
                [
                    machine.highlights.inputs.ram.indexOf(i) !== -1
                        ? "highlight-input"
                        : "",
                    machine.highlights.outputs.ram.indexOf(i) !== -1
                        ? "highlight-output"
                        : "",
                ].join(" "),
                [
                    machine.highlights.inputs.ram.indexOf(i + 1) !== -1
                        ? "highlight-input"
                        : "",
                    machine.highlights.outputs.ram.indexOf(i + 1) !== -1
                        ? "highlight-output"
                        : "",
                ].join(" "),
            ];
            cells.push(
                <div
                    className={["row", isActive ? "is-active" : ""].join(" ")}
                    key={index}
                >
                    <label htmlFor={`cell-${index}`} className="index">
                        {index}
                    </label>
                    <Cell
                        classNames={classNames}
                        ids={[`cell-${index}`, `cell-${index2}`]}
                        values={[machine.ram[i], machine.ram[i + 1]]}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={this.onRamChange.bind(this, i)}
                    />
                    <label htmlFor={`cell-${index2}`} className="index">
                        {index2}
                    </label>
                    <input
                        type="text"
                        className="comment"
                        value={indexToComment(i)}
                        onChange={(e) =>
                            this.onCommentChange(j, e.target.value)
                        }
                        tabIndex={-1}
                    />
                </div>
            );
        }
        return cells;
    }

    render() {
        return <section className="ram">{this.generateCells()}</section>;
    }
});

export default RAM;
