import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
// import Logo from "./logo";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            // email: "",
            // password: "",
        };
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then((resp) => {
                console.log("resp from server: ", resp);
                if (resp.data.success) {
                    location.replace("/");
                } else {
                    console.log("error");
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err in registration: ", err);
                this.setState({
                    error: true,
                });
                // render an error message
            });
    }

    // this is how we handle user input in React!
    handleChange(e) {
        // console.log("e target value: ", e.target.value);
        // which input field is the user typing in?
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    render() {
        return (
            <>
                <div className="hero">
                    <div className="form-box">
                        <div className="button-box">
                            <div id="btn"></div>
                            <button
                                type="button"
                                className="toggle-btn"
                                // onClick={() => this.handleClick()}
                            >
                                LOG IN
                            </button>
                            {/* <button
                                type="button"
                                className="toggle-btn"
                                onClick={() => this.handleClick()}
                            >
                                register
                            </button> */}
                        </div>
                        <div id="login" className="input-group">
                            {this.state.error && (
                                <p>Something went wrong, Please try again!</p>
                            )}
                            {/* <h1>LogIn</h1> */}
                            {/* strategy #2 for binding: arrow functions! */}
                            <input
                                className="input-field"
                                onChange={(e) => this.handleChange(e)}
                                name="email"
                                type="text"
                                placeholder="email"
                            />
                            <input
                                className="input-field"
                                onChange={(e) => this.handleChange(e)}
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                            <button
                                type="submit"
                                className="submit-btn"
                                onClick={() => this.handleClick()}
                            >
                                Sign in
                            </button>
                            <div className="login-text">
                                <p>
                                    Click <Link to="/">here</Link> to register
                                </p>
                                <p>
                                    Forgot your password? {""}
                                    <Link to="/password/reset/start">
                                        reset
                                    </Link>
                                </p>
                            </div>
                            {this.state.error && (
                                <p>
                                    This email or password does not exist. Try
                                    again.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
