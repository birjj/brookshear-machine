import React, { Component } from "react";
import { observer } from "mobx-react";

import machine from "../machine";
import Icon from "./icon";
import "./modal/modal.css";
import { toHex, exportData } from "../utils";

/** @augments {Component<{}, {}>} */
@observer
class ExportModal extends Component {
    formatValue() {
        let outp = "";
        for (let i = 0; i < machine.ram.length; i += 2) {
            outp += "\n";
            if (machine.ram[i] || machine.ram[i + 1] || machine.comments[i / 2]) {
                outp += toHex(machine.ram[i]) + toHex(machine.ram[i + 1]);
            }
            if (machine.comments[i / 2]) {
                outp += `;${machine.comments[i / 2]}`;
            }
        }
        return outp.replace(/^\s*|\s*$/g, "");
    }

    render() {
        return (
            <div className="modal">
                <div className="container">
                    <button
                        className="close"
                        onClick={() => { machine.showingModal = ""; }}
                    >
                        <Icon icon="close" />
                    </button>
                    <p>You can share the URL of this page.<br />
                        Alternatively, copy the below code.
                        You can later import it using the import button:</p>
                    <textarea
                        readOnly
                        value={exportData(false)}
                    />
                </div>
            </div>
        );
    }
}

export default ExportModal;
