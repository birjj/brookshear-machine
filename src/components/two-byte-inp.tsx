import React, { ChangeEvent, Component } from "react";
import PropTypes from "prop-types";
import { toHex, fromHex } from "../utils";

type TwoByteInputProps = typeof TwoByteInput.defaultProps & {
    onChange: (val: number) => void;
    value: number;
};

class TwoByteInput extends Component<TwoByteInputProps> {
    static defaultProps = {
        value: 0,
        id: "",
        className: "",
    };

    lastEmitted: number;
    $inp?: HTMLInputElement;

    constructor(props: TwoByteInputProps) {
        super(props);

        this.lastEmitted = props.value;
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidUpdate(prevProps: TwoByteInputProps) {
        if (prevProps.value !== this.props.value) {
            if (this.$inp) {
                if (this.props.value !== this.lastEmitted) {
                    this.$inp.value = this.formatValue(this.props.value);
                }
                this.lastEmitted = this.props.value;
            }
        }
    }

    onKeyDown(e: KeyboardEvent) {
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
            if (this.$inp) {
                this.$inp.value = this.formatValue(newValue);
            }
            this.emit(newValue);
        }
    }

    onInputChange() {
        if (!this.$inp) {
            return;
        }
        const value = this.formatInput(this.$inp.value);
        this.$inp.value = value;
        this.emit(fromHex(value));
    }

    onInputBlur(event: ChangeEvent<HTMLInputElement>) {
        const value = fromHex(this.formatInput(event.target.value));
        if (this.$inp) {
            this.$inp.value = this.formatValue(value);
        }
        this.emit(value);
    }

    emit(num: number) {
        if (num !== this.lastEmitted) {
            this.props.onChange(num || 0);
            this.lastEmitted = num || 0;
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
            <input
                type="text"
                className={`two-byte ${this.props.className}`}
                defaultValue={this.formatValue(this.props.value)}
                onChange={this.onInputChange}
                onBlur={this.onInputBlur}
                onKeyDown={this.onKeyDown as any}
                id={this.props.id}
                ref={(inp) => {
                    if (!inp) {
                        return;
                    }
                    this.$inp = inp;
                }}
                maxLength={2}
            />
        );
    }
}

export default TwoByteInput;
