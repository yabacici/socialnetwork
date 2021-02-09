import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            email: "",
            password: "",
        };
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then((resp) => {
                console.log("resp from server: ", resp);
                if (!this.state.success) {
                    console.log("error");
                    this.setState({
                        error: true,
                    });
                } else {
                    location.replace("/");
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
            <div className="form">
                {this.state.error && <p>Something broke</p>}
                <h1>LogIn</h1>
                {/* strategy #2 for binding: arrow functions! */}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="text"
                    placeholder="email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <button onClick={() => this.handleClick()}>logIn</button>
            </div>
        );
    }
}
