import React, { ChangeEvent, Component } from "react";

type ExponentialSliderInputProps = typeof ExponentialSliderInput.defaultProps & {
    onChange: (val: number) => void;
    value: number;
};

class ExponentialSliderInput extends Component<ExponentialSliderInputProps> {
    static defaultProps = {
        value: 1,
        exponent: 2,
        min: 1,
        max: 100,
        step: 0.1,
        id: "",
        className: "",
    };

    lastEmitted: number;
    $inp?: HTMLInputElement;

    constructor(props: ExponentialSliderInputProps) {
        super(props);

        this.lastEmitted = props.value;
        this.onInputChange = this.onInputChange.bind(this);
    }

    componentDidUpdate(prevProps: ExponentialSliderInputProps) {
        if (prevProps.value !== this.props.value) {
            if (this.$inp) {
                this.$inp.valueAsNumber = this.toLinear(this.props.value);
            }
        }
    }

    onInputChange() {
        if (!this.$inp) {
            return;
        }

        const linearValue = this.$inp.valueAsNumber;
        this.emit(this.fromLinear(linearValue));
    }

    emit(num: number) {
        if (num !== this.lastEmitted) {
            this.props.onChange(num || 0);
            this.lastEmitted = num || 0;
        }
    }

    /** Converts from a linear number (e.g. 5) to its exponential value (25) */
    fromLinear(x: number) {
        return Math.pow(x, this.props.exponent);
    }
    toLinear(x: number) {
        return Math.pow(x, 1/this.props.exponent);
    }

    render() {
        return (
            <input
                type="range"
                min={this.toLinear(this.props.min)}
                max={this.toLinear(this.props.max)}
                step={this.props.step}
                ref={(inp) => {
                    if (!inp) {
                        return;
                    }
                    this.$inp = inp;
                }}
                defaultValue={this.toLinear(this.props.value)}
                onInput={this.onInputChange}
            />
        );
    }
}

export default ExponentialSliderInput;
