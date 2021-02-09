// src/adeeoprrssstw.js;
import React from "react";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderView: 1,
        };
    }

    determineWhichViewToRender() {
        if (this.state.renderView === 1) {
            return (
                <div>
                    <input name="email" />
                    <button></button>
                </div>
            );
        } else if (this.state.renderView === 2) {
            return (
                <div>
                    <input name="password" />
                    <input name="code" />
                    <button></button>
                </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <h1>success</h1>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <h1>reset password</h1>
                {this.state.error && <p>error</p>}
                {this.determineWhichViewToRender()}
            </div>
        );
    }
}
