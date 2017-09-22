import React, { Component } from "react";
import { observer } from "mobx-react";
import { action } from "mobx";
import Icon from "./icon";
import machine from "../machine";
import "./toolbar/toolbar.css";

/** @augments {Component<{}, {}>} */
@observer
class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.onPlaySpeed = this.onPlaySpeed.bind(this);
    }

    @action
    onAction(name) {
        switch (name) {
            case "play":
                machine.playing = true;
                machine.warning = "";
                break;
            case "pause":
                machine.playing = false;
                break;
            case "step":
                machine.execute();
                break;
            case "reset":
                machine.frame = 0;
                machine.cpu.fill(0);
                machine.messages = [];
                break;
            case "help":
                machine.showingHelp = !machine.showingHelp;
                break;
            case "import":
                machine.showingModal = "import";
                break;
            case "export":
                machine.showingModal = "export";
                break;
            default:
                break;
        }
    }

    @action
    onPlaySpeed(event) {
        const value = +event.target.value;
        this.playSpeed = value;
        machine.speed = value;
    }

    updatePlaySpeed(value) {
        if (this.$playSpeed) {
            this.$playSpeed.value = value;
        }
    }

    renderPlaySpeed() {
        if (this.playSpeed$) {
            return this.playSpeed$;
        }

        this.playSpeed$ = (
            <div key="play-speed" className="play-speed">
                <input
                    type="range"
                    min="0.25"
                    max="10"
                    step="0.1"
                    ref={(inp) => { this.$playSpeed = inp; }}
                    defaultValue={`${machine.speed}`}
                    onChange={this.onPlaySpeed}
                />
                <span>Play speed</span>
            </div>
        );
        return this.playSpeed$;
    }
    renderFiller() {
        return (
            <div key="filler" className="filler warning">
                { machine.messages.map(
                    msg => (
                        <span key={msg.text} className={msg.type}>
                            { msg.type === "error"
                                ? (<Icon icon="alert" />)
                                : undefined }
                            { msg.type === "loader"
                                ? (<Icon icon="load" />)
                                : undefined }
                            { msg.text }
                        </span>
                    )
                ) }
            </div>
        );
    }
    /**
     * Renders a button.
     * @param {Object} btn
     * @param {String} btn.icon  The icon to display
     * @param {String} [btn.text]  The text to display
     * @param {Boolean} [btn.separator]  Whether to show separator to the right of the button
     */
    renderButton(btn) {
        return (
            <button
                key={btn.icon}
                className={btn.separator ? "separator" : ""}
                onClick={() => this.onAction(btn.icon)}
            >
                <Icon icon={btn.icon} />
                { btn.text ? (
                    <span>{btn.text}</span>
                ) : undefined}
            </button>
        );
    }

    render() {
        if (machine.speed !== this.playSpeed) {
            this.updatePlaySpeed(machine.speed);
        }

        const elements = [
            ...([
                { text: "Import", icon: "import" },
                { text: "Export", icon: "export", separator: true },
                { text: "Reset CPU", icon: "reset" },
                (machine.playing ?
                    { text: "Pause", icon: "pause" }
                    : { text: "Play", icon: "play" }),
                this.renderPlaySpeed(),
                { text: "Step", icon: "step" },
                this.renderFiller(),
                { text: (machine.showingHelp ? "Hide" : "Help"), icon: "help" },
                (
                    <a
                        key="github"
                        href="https://google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icon icon="github" />
                    </a>
                ),
            ].map(
                v => (React.isValidElement(v) ? v : this.renderButton(v))
            )),
        ];

        return (
            <section className="toolbar">
                { elements }
            </section>
        );
    }
}

export default Toolbar;
