import React, { Component } from "react";
import PropTypes from "prop-types";

import { toHex } from "../utils";
import "./cell/cell.css";

/** @augments {Component<{ids: string[], values: number[]}, {}>} */
class Cell extends Component {
    static propTypes = {
        ids: PropTypes.arrayOf(
            PropTypes.string
        ),
        values: PropTypes.arrayOf(
            PropTypes.number
        ).isRequired,
        classNames: PropTypes.arrayOf(
            PropTypes.string
        ),
        onChange: PropTypes.func.isRequired,
    }
    static defaultProps = {
        ids: [undefined, undefined],
        classNames: ["", ""],
    }

    constructor(props) {
        super(props);

        this.$inps = [];
        this.lastEmitted = [...props.values];

        this.state = {
            focused: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.focused !== this.state.focused) {
            return true;
        }

        if (nextProps.classNames.some(
            (v, i) => this.props.classNames[i] !== v
        )) {
            return true;
        }

        if (nextProps.values.some(
            (v, i) => this.lastEmitted[i] !== v
        )) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps) {
        this.props.values.forEach(
            (v, i) => {
                if (prevProps[i] !== v) {
                    if (this.lastEmitted[i] !== v) {
                        this.$inps[i].value = this.formatValue(v);
                    }
                }
            }
        );
    }

    onInput(index, val) {
        const value = this.formatInput(val);
        this.$inps[index].value = value;

        const outp = [...this.lastEmitted];
        outp[index] = parseInt(value, 16) || 0;
        this.emit(outp);
    }

    onInputBlur(index) {
        this.setState({ focused: false });
        const $inp = this.$inps[index];
        const value = parseInt(this.formatInput($inp.value), 16) || 0;
        $inp.value = this.formatValue(value);

        const outp = [...this.lastEmitted];
        outp[index] = value;
        this.emit(outp);
    }

    emit(arr) {
        if (!arr.every((v, i) => this.lastEmitted[i] === v)) {
            this.lastEmitted = arr;
            this.props.onChange(arr);
        }
    }

    /**
     * Takes a hex string, strips non-hex characters and upper cases
     * @param {String} inp
     * @returns {String}
     */
    formatInput(inp) {
        return inp.replace(/[^0-9a-f]/gi, "")
            .toUpperCase();
    }

    formatValue(num) {
        return num.toString(16)
            .padStart(2, "0")
            .toUpperCase();
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
                    onChange={e => this.onInput(0, e.target.value)}
                    onFocus={() => this.setState({ focused: true })}
                    onBlur={() => this.onInputBlur(0)}
                    ref={(inp) => { this.$inps[0] = inp; }}
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
                    onChange={e => this.onInput(1, e.target.value)}
                    onFocus={() => this.setState({ focused: true })}
                    onBlur={() => this.onInputBlur(1)}
                    ref={(inp) => { this.$inps[1] = inp; }}
                    maxLength={2}
                />
            </div>
        );
    }
}

export default Cell;
