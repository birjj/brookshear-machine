import React, { Component } from "react";
import PropTypes from "prop-types";

/** @augments {Component<{onChange: function, value: number}, {}>} */
class TwoByteInput extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.number,
        id: PropTypes.string,
        className: PropTypes.string,
    }
    static defaultProps = {
        value: 0,
        id: undefined,
        className: undefined,
    }

    constructor(props) {
        super(props);

        this.lastEmitted = props.value;
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
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

    onInputChange(event) {
        const value = this.formatInput(event.target.value);
        this.$inp.value = value;
        this.emit(parseInt(value, 16));
    }

    onInputBlur(event) {
        const value = parseInt(this.formatInput(event.target.value), 16) || 0;
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
            <input
                type="text"
                className={`two-byte ${this.props.className}`}
                defaultValue={this.formatValue(this.props.value)}
                onChange={this.onInputChange}
                onBlur={this.onInputBlur}
                id={this.props.id}
                ref={(inp) => { this.$inp = inp; }}
                maxLength={2}
            />
        );
    }
}

export default TwoByteInput;
