import React from "react";
import ReactDOM from "react-dom";
import { autorun } from "mobx";

import App from "./components/app";
import machine from "./machine";
import "./load";
import { importData, exportData } from "./utils";
import registerServiceWorker from "./registerServiceWorker";

// handle our URL updating
if (history && history.replaceState) {
    autorun(
        () => {
            const newData = exportData(true);
            history.replaceState("", "", `#${newData}`);
        }
    );

    window.addEventListener("popstate",
        () => {
            const existingData = window.location.hash.substr(1);
            if (existingData) {
                importData(existingData, true);
            }
        }
    );
}

// save our data to local storage when it changes
// also loads existing data
if (localStorage) {
    // exceptions are usually caused by faulty content. Make sure user can reload
    window.onerror = () => {
        localStorage.clear();
    };

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
                2500
            );
        }
    );
}

ReactDOM.render(
    <App />, // eslint-disable-line
    document.getElementById("root")
);
registerServiceWorker();
