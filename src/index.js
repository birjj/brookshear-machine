import React from "react";
import ReactDOM from "react-dom";
import { autorun } from "mobx";
import App from "./components/app";
import machine from "./machine";
import registerServiceWorker from "./registerServiceWorker";

// save our data to local storage when it changes
// also loads existing data
if (localStorage) {
    const SAVE_PROPS = [
        "speed",
        "frame",
        "showingHelp",
        "cpu",
        "ram",
        "comments",
    ];
    let saveTimeout;
    autorun(
        () => {
            clearTimeout(saveTimeout);
            const brookshearProgram = {};
            SAVE_PROPS.forEach(
                (key) => {
                    if (machine[key] instanceof Array) {
                        brookshearProgram[key] = [...machine[key]];
                    } else {
                        brookshearProgram[key] = machine[key];
                    }
                }
            );
            saveTimeout = setTimeout(
                () => {
                    console.log("Saving to localStorage"); // eslint-disable-line no-console
                    localStorage.setItem("brookshear", JSON.stringify(brookshearProgram));
                },
                500
            );
        }
    );

    const oldProgram = localStorage.getItem("brookshear");
    if (oldProgram) {
        const program = JSON.parse(oldProgram);
        Object.keys(program)
            .forEach(
                (key) => {
                    const val = program[key];
                    if (val instanceof Array) {
                        val.forEach(
                            (v, i) => {
                                machine[key][i] = v;
                            }
                        );
                    } else {
                        machine[key] = val;
                    }
                }
            );
    }
}

ReactDOM.render(
    <App />, // eslint-disable-line
    document.getElementById("root")
);
registerServiceWorker();
