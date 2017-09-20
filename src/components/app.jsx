import React, { Component } from "react";
import { observer } from "mobx-react";
import machine from "../machine";

import Toolbar from "./toolbar";
import CPU from "./cpu";
import RAM from "./ram";
import Help from "./help";
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
                <Toolbar />
                <section className="emulator">
                    <CPU />
                    <RAM />
                    { machine.showingHelp ? <Help /> : undefined }
                </section>
            </div>
        );
    }
}

export default App;
