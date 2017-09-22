import machine from "./machine";
import { importData } from "./utils";

const existingData = window.location.hash.substr(1);
if (existingData) {
    importData(existingData, true);
} else if (localStorage) {
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
