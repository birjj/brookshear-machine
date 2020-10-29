import React, { Component } from "react";

import { toHex, fromHex } from "../utils";
import "./cell/cell.scss";

type CellProps = typeof Cell.defaultProps & {
    ids: [string, string];
    values: [number, number];
    classNames?: [string, string];
    onChange: (vals: [number, number]) => void;
};

type CellState = {
    focused: boolean;
};

class Cell extends Component<CellProps, CellState> {
    static defaultProps = {
        ids: ["", ""],
        classNames: ["", ""],
    };

    $inps: HTMLInputElement[] = [];
    lastEmitted: number[];

    constructor(props: CellProps) {
        super(props);

        this.lastEmitted = [...props.values];

        this.state = {
            focused: false,
        };
    }

    shouldComponentUpdate(nextProps: CellProps, nextState: CellState) {
        if (nextState.focused !== this.state.focused) {
            return true;
        }

        if (
            !!nextProps.classNames !== !!this.props.classNames ||
            nextProps.classNames.some(
                (v, i) => (this.props.classNames || [])[i] !== v
            )
        ) {
            return true;
        }

        if (nextProps.values.some((v, i) => this.lastEmitted[i] !== v)) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps: CellProps) {
        this.props.values.forEach((v, i) => {
            if (prevProps.values[i] !== v) {
                if (this.lastEmitted[i] !== v) {
                    this.$inps[i].value = this.formatValue(v);
                    this.lastEmitted[i] = v;
                }
            }
        });
    }

    onInput(index: number, val: string) {
        const value = this.formatInput(val);
        this.$inps[index].value = value;

        const outp = [...this.lastEmitted] as [number, number];
        outp[index] = fromHex(value);
        this.emit(outp);
    }

    onInputBlur(index: number) {
        this.setState({ focused: false });
        const $inp = this.$inps[index];
        const value = fromHex($inp.value);
        $inp.value = this.formatValue(value);

        const outp = [...this.lastEmitted] as [number, number];
        outp[index] = value;
        this.emit(outp);
    }

    emit(arr: [number, number]) {
        if (!arr.every((v, i) => this.lastEmitted[i] === v)) {
            this.lastEmitted = arr;
            this.props.onChange(arr);
        }
    }

    /** Takes a hex string, strips non-hex characters and upper cases */
    formatInput(inp: string) {
        return inp.replace(/[^0-9a-f]/gi, "").toUpperCase();
    }

    formatValue(num: number) {
        return toHex(num);
    }

    render() {
        return (
            <div className="cell">
                <input
                    className={[
                        this.state.focused ? "focused" : "",
                        this.props.classNames[0],
                    ].join(" ")}
                    type="text"
                    id={this.props.ids[0]}
                    defaultValue={toHex(this.props.values[0])}
                    onChange={(e) => this.onInput(0, e.target.value)}
                    onFocus={() => this.setState({ focused: true })}
                    onBlur={() => this.onInputBlur(0)}
                    ref={(inp) => {
                        if (!inp) {
                            return;
                        }
                        this.$inps[0] = inp;
                    }}
                    maxLength={2}
                />
                <input
                    className={[
                        this.state.focused ? "focused" : "",
                        this.props.classNames[1],
                    ].join(" ")}
                    type="text"
                    id={this.props.ids[1]}
                    defaultValue={toHex(this.props.values[1])}
                    onChange={(e) => this.onInput(1, e.target.value)}
                    onFocus={() => this.setState({ focused: true })}
                    onBlur={() => this.onInputBlur(1)}
                    ref={(inp) => {
                        if (!inp) {
                            return;
                        }
                        this.$inps[1] = inp;
                    }}
                    maxLength={2}
                />
            </div>
        );
    }
}

export default Cell;
