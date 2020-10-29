import React, { Component } from "react";

import "./help/help.scss";

class Help extends Component<{}, {}> {
    generateTable() {
        const operations = [
            /* 1 */ [
                "RXY",
                <span>
                    Copy the content of RAM cell <em>XY</em> to register{" "}
                    <em>R</em>.
                </span>,
            ],
            /* 2 */ [
                "RXY",
                <span>
                    Copy the bit-string <em>XY</em> to register <em>R</em>.
                </span>,
            ],
            /* 3 */ [
                "RXY",
                <span>
                    Copy the content of register <em>R</em> to RAM cell{" "}
                    <em>XY</em>.
                </span>,
            ],
            /* 4 */ [
                "xRS",
                <span>
                    Copy the content of register <em>R</em> to register{" "}
                    <em>S</em>.
                </span>,
            ],
            /* 5 */ [
                "RST",
                <span>
                    Add the content of register <em>S</em> and register{" "}
                    <em>T</em>, and put the result in register <em>R</em>. Data
                    is interpreted as integers in two&#x27;s-complement
                    notation.
                </span>,
            ],
            /* 6 */ [
                "RST",
                <span>
                    Add the content of register <em>S</em> and register{" "}
                    <em>T</em>, and put the result in register <em>R</em>. Data
                    is interpreted as floats in floating point notation.
                </span>,
            ],
            /* 7 */ [
                "RST",
                <span>
                    Bitwise OR (∨) the content of register <em>S</em> and{" "}
                    <em>T</em>, and put the result in register <em>R</em>.
                </span>,
            ],
            /* 8 */ [
                "RST",
                <span>
                    Bitwise AND (∧) the content of register <em>S</em> and{" "}
                    <em>T</em>, and put the result in register <em>R</em>.
                </span>,
            ],
            /* 9 */ [
                "RST",
                <span>
                    Bitwise XOR (⊕) the content of register <em>S</em> and{" "}
                    <em>T</em>, and put the result in register <em>R</em>.
                </span>,
            ],
            /* A */ [
                "RxX",
                <span>
                    Rotate the content of register <em>R</em> cyclically right{" "}
                    <em>X</em> steps.
                </span>,
            ],
            /* B */ [
                "RXY",
                <span>
                    Jump to instruction in RAM cell <em>XY</em> if the content
                    of register <em>R</em> equals the content of register{" "}
                    <em>0</em>.
                </span>,
            ],
            /* C */ ["xxx", <span>Halt execution.</span>],
            /* D */ [
                "RXY",
                <span>
                    Jump to instruction in RAM cell <em>XY</em> if the content
                    of register <em>R</em> is greater than (&gt;) the content of
                    register <em>0</em>. Data is interpreted as integers in
                    two&#x27;s-complement notation.
                </span>,
            ],
        ];
        return (
            <table>
                <thead>
                    <tr>
                        <th title="Opcode">Opc.</th>
                        <th title="Operands">Opr.</th>
                        <th>Effect</th>
                    </tr>
                </thead>
                <tbody>
                    {operations.map((op, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <tr key={i}>
                            <td>{(i + 1).toString(16).toUpperCase()}</td>
                            <td>{op[0]}</td>
                            <td>{op[1]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div className="help-container">
                <div className="help">
                    <h1>Operations Set</h1>
                    {this.generateTable()}

                    <h2>Floating point</h2>
                    <p>
                        The floating point notation used by this machine uses 1
                        bit for sign (0 for positive, 1 for negative), 3 bits
                        for the exponent (excess notation) and 4 mantissa bits
                        (the bits following the first &quot;1&quot; bit).
                    </p>

                    <h2>GUI</h2>
                    <p>The machine uses several GUI elements:</p>
                    <ul>
                        <li>
                            The program counter arrow (
                            <span className="counter-arrow" />) - this shows
                            which command will be executed next.
                        </li>
                        <li>
                            Input highlights (
                            <span className="highlight-input highlight-example" />
                            ) - this shows from which registers or cells data
                            will be read when the next command is executed.
                        </li>
                        <li>
                            Output higlights (
                            <span className="highlight-output highlight-example" />
                            ) - this shows which registers or cells will receive
                            data when the next command is executed.
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Help;
