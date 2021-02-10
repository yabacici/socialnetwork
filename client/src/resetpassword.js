// src/adeeoprrssstw.js;
import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            // email: "",
            renderView: 1,
        };
    }
    handleClick() {
        let route = [
            "/password/reset/start",
            "/password/reset/verify",
            "/password/reset/verify",
        ];
        axios
            .post(route[this.state.renderView], this.state)
            .then((resp) => {
                console.log("resp from server: ", resp);
                if (resp.data.success) {
                    // location.replace("/");
                    this.setState({
                        renderView: this.state.renderView + 1,
                    });
                } else {
                    console.log("error");
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err in resetpassword: ", err);
                this.setState({
                    error: true,
                });
            });
    }
    handleChange(e) {
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    determineWhichViewToRender() {
        if (this.state.renderView === 1) {
            return (
                <>
                    <div>
                        <h1>reset password</h1>
                        <div className="hero">
                            <div className="form-box">
                                <div className="button-box">
                                    <div id="btn"></div>
                                    <div id="login" className="input-group">
                                        {this.state.error && <p>error</p>}
                                        {this.determineWhichViewToRender()}
                                        <p>
                                            Please enter the email address with
                                            which you registered
                                        </p>
                                        <input
                                            className="input-field"
                                            onChange={(e) =>
                                                this.determineWhichViewToRender(
                                                    e
                                                )
                                            }
                                            name="email"
                                            type="text"
                                            placeholder="email"
                                        />
                                        <button
                                            type="submit"
                                            className="submit-btn"
                                            onClick={() => this.handleClick()}
                                        >
                                            submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (this.state.renderView === 2) {
            return (
                <>
                    <div>
                        <h1>reset password</h1>
                        <div className="hero">
                            <div className="form-box">
                                <div className="button-box">
                                    <div id="btn"></div>
                                    <div id="login" className="input-group">
                                        {this.state.error && <p>error</p>}
                                        {this.determineWhichViewToRender()}
                                        <p>
                                            Please enter the code you received
                                        </p>
                                        <input
                                            className="input-field"
                                            onChange={(e) =>
                                                this.determineWhichViewToRender(
                                                    e
                                                )
                                            }
                                            name="code"
                                            type="text"
                                            placeholder="code"
                                        />
                                        <p>Please enter a new password</p>
                                        <input
                                            className="input-field"
                                            onChange={(e) =>
                                                this.determineWhichViewToRender(
                                                    e
                                                )
                                            }
                                            name="newPassword"
                                            type="password"
                                            placeholder=" new password"
                                        />
                                        <button
                                            type="submit"
                                            className="submit-btn"
                                            onClick={() => this.handleClick()}
                                        >
                                            submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                // <div>
                //     <input name="password" />
                //     <input name="code" />
                //     <button></button>
                // </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <h1>RESET PASSWORD: SUCCESS</h1>
                    <p>
                        You can now <Link to="/login">log in</Link> your new
                        password.
                    </p>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {/* call the method */}
                {this.determineWhichViewToRender()}
            </div>
        );
    }
}
