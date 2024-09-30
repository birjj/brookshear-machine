import React, { ChangeEvent, Component } from "react";
import { observer } from "mobx-react";
import { action, makeObservable } from "mobx";
import swal, { SweetAlertOptions } from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import Icon, { IconProps } from "./icon";
import machine from "../machine";
import "./toolbar/toolbar.scss";
import ExponentialSliderInput from "./exponential-slider";

type ToolbarAction =
    | "play"
    | "pause"
    | "step"
    | "reset"
    | "delete"
    | "help"
    | "import"
    | "export";
type ToolbarButton = {
    icon: ToolbarAction;
    separator?: boolean;
    text: string;
};

/** @augments {Component<{}, {}>} */
const Toolbar = observer(
    class Toolbar extends Component<{}, {}> {
        playSpeed: number = 0;
        $playSpeed?: HTMLInputElement;
        playSpeed$?: JSX.Element;

        constructor(props: {}) {
            super(props);

            makeObservable(this, {
                onAction: action,
                onPlaySpeed: action,
            });

            this.onPlaySpeed = this.onPlaySpeed.bind(this);
        }

        onAction(name: ToolbarAction) {
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
                case "delete":
                    swal.fire({
                        title: "Are you sure?",
                        text:
                            "This will delete your program for all of eternity",
                        type: "warning",
                        confirmButtonColor: "#d33",
                        confirmButtonText: "Reset",
                        showCancelButton: true,
                    } as SweetAlertOptions)
                        .then((result) => {
                            if (result && result.isDismissed) {
                                return;
                            }
                            machine.ram.fill(0);
                            machine.comments.fill("");
                        })
                        .catch(() => {});
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

        onPlaySpeed(value: number) {
            this.playSpeed = value;
            machine.speed = value;
        }

        updatePlaySpeed(value: number) {
            this.playSpeed = value;
        }

        renderPlaySpeed() {
            return (
                <div key="play-speed" className="play-speed">
                    <ExponentialSliderInput
                        min={1}
                        max={100}
                        exponent={5}
                        step={0.01}
                        value={this.playSpeed}
                        onChange={this.onPlaySpeed}
                    />
                    <span>Play speed ({Math.round(this.playSpeed).toFixed(0)} IPS)</span>
                </div>
            );
        }
        renderFiller() {
            return (
                <div key="filler" className="filler warning">
                    {machine.messages.map((msg) => (
                        <span key={msg.text} className={msg.type}>
                            {msg.type === "error" ? (
                                <Icon icon="alert" />
                            ) : undefined}
                            {msg.type === "loader" ? (
                                <Icon icon="load" />
                            ) : undefined}
                            {msg.text}
                        </span>
                    ))}
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
        renderButton(btn: ToolbarButton) {
            return (
                <button
                    key={btn.icon}
                    className={`btn-${btn.icon} ${
                        btn.separator ? "separator" : ""
                    }`}
                    onClick={() => this.onAction(btn.icon)}
                >
                    <Icon icon={btn.icon} />
                    {btn.text ? <span>{btn.text}</span> : undefined}
                </button>
            );
        }

        render() {
            if (machine.speed !== this.playSpeed) {
                this.updatePlaySpeed(machine.speed);
            }

            const elements = [
                ...[
                    { text: "Reset RAM", icon: "delete" },
                    { text: "Import", icon: "import" },
                    { text: "Export", icon: "export", separator: true },
                    { text: "Reset CPU", icon: "reset" },
                    machine.playing
                        ? { text: "Pause", icon: "pause" }
                        : { text: "Play", icon: "play" },
                    this.renderPlaySpeed(),
                    { text: "Step", icon: "step" },
                    this.renderFiller(),
                    {
                        text: machine.showingHelp ? "Hide" : "Help",
                        icon: "help",
                    },
                    <a
                        className="btn-github"
                        key="github"
                        href="https://github.com/birjolaxew/brookshear-machine"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icon icon="github" />
                    </a>,
                ].map((v) =>
                    React.isValidElement(v)
                        ? v
                        : this.renderButton(v as ToolbarButton)
                ),
            ];

            return <section className="toolbar">{elements}</section>;
        }
    }
);

export default Toolbar;
