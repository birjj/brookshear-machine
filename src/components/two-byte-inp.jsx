import React, { Component } from "react";
import PropTypes from "prop-types";
import { toHex, fromHex } from "../utils";

/** @augments {Component<{onChange: function, value: number}, {}>} */
class TwoByteInput extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.number,
        id: PropTypes.string,
        className: PropTypes.string,
    };
    static defaultProps = {
        value: 0,
        id: undefined,
        className: undefined,
    };

    constructor(props) {
        super(props);

        this.lastEmitted = props.value;
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            if (this.$inp) {
                if (this.props.value !== this.lastEmitted) {
                    this.$inp.value = this.formatValue(this.props.value);
                }
                this.lastEmitted = this.props.value;
            }
        }
    }

    onKeyDown(e) {
        let newValue;
        if (e.keyCode === 40) {
            // ArrowDown
            newValue = this.lastEmitted - 1;
        } else if (e.keyCode === 38) {
            // ArrowUp
            newValue = this.lastEmitted + 1;
        }

        if (newValue !== undefined) {
            newValue = (2 ** 8 + newValue) % 2 ** 8;
            this.$inp.value = this.formatValue(newValue);
            this.emit(newValue);
        }
    }

    onInputChange() {
        const value = this.formatInput(this.$inp.value);
        this.$inp.value = value;
        this.emit(fromHex(value));
    }

    onInputBlur(event) {
        const value = fromHex(this.formatInput(event.target.value));
        this.$inp.value = this.formatValue(value);
        this.emit(value);
    }

    emit(num) {
        if (num !== this.lastEmitted) {
            this.props.onChange(num || 0);
            this.lastEmitted = num || 0;
        }
    }

    /**
     * Takes a hex string, strips non-hex characters and upper cases
     * @param {String} inp
     * @returns {String}
     */
    formatInput(inp) {
        return inp.replace(/[^0-9a-f]/gi, "").toUpperCase();
    }

    formatValue(num) {
        return toHex(num);
    }

    render() {
        return (
            <input
                type="text"
                className={`two-byte ${this.props.className}`}
                defaultValue={this.formatValue(this.props.value)}
                onChange={this.onInputChange}
                onBlur={this.onInputBlur}
                onKeyDown={this.onKeyDown}
                id={this.props.id}
                ref={(inp) => {
                    this.$inp = inp;
                }}
                maxLength={2}
            />
        );
    }
}

export default TwoByteInput;
