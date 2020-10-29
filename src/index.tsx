import React from "react";
import ReactDOM from "react-dom";
import { autorun } from "mobx";

import App from "./components/app";
import machine from "./machine";
import "./load";
import { importData, exportData } from "./utils";

// handle our URL updating
if (history && history.replaceState) {
    let urlTimeout;
    autorun(() => {
        clearTimeout(urlTimeout);
        const newData = exportData(true);
        urlTimeout = setTimeout(() => {
            history.replaceState("", "", newData !== "Q" ? `#${newData}` : "#");
        }, 500);
    });

    window.addEventListener("popstate", () => {
        const existingData = window.location.hash.substr(1);
        if (existingData) {
            importData(existingData, true);
        }
    });
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
    autorun(() => {
        clearTimeout(saveTimeout);
        const brookshearProgram = {};
        SAVE_PROPS.forEach((key) => {
            if (machine[key] instanceof Array) {
                brookshearProgram[key] = [...machine[key]];
            } else {
                brookshearProgram[key] = machine[key];
            }
        });
        saveTimeout = setTimeout(() => {
            console.log("Saving to localStorage"); // eslint-disable-line no-console
            localStorage.setItem(
                "brookshear",
                JSON.stringify(brookshearProgram)
            );
        }, 2500);
    });
}

ReactDOM.render(
    <App />, // eslint-disable-line
    document.getElementById("root")
);
