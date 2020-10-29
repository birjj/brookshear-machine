import React, { Component } from "react";
import { observer } from "mobx-react";
import machine from "../machine";

import Toolbar from "./toolbar";
import CPU from "./cpu";
import RAM from "./ram";
import Help from "./help";
import ImportModal from "./import-modal";
import ExportModal from "./export-modal";
import "./app/app.css";

@observer
class App extends Component {
    constructor(props) {
        super(props);

        machine.tick();
    }
    render() {
        return (
            <div className="app">
                {machine.showingModal === "import" ? (
                    <ImportModal />
                ) : undefined}
                {machine.showingModal === "export" ? (
                    <ExportModal />
                ) : undefined}
                <Toolbar />
                <section className="emulator">
                    <CPU />
                    <RAM />
                    {machine.showingHelp ? <Help /> : undefined}
                </section>
            </div>
        );
    }
}

export default App;
