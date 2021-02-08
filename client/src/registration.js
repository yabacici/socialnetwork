// src/registration.js
// class component have state!
// (class components also have lifecycle methods (like componentDidMount))
import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            first: "",
            last: "",
            email: "",
            password: "",
        };
        // strategy #1 for binding
        // this.handleChange = this.handleChange.bind(this);
    }

    // 1. we need to store the user's input in state
    // 2. when user clicks "submit," we need to take the input we got from the user
    // and send it off to the server in a `POST` request
    // in .then read the response, and based on the response:
    // a. render an error message for the user
    // b. redirect to /
    handleClick() {
        axios
            .post("/registration", this.state) //dataToSendToServer
            .then((resp) => {
                console.log("resp from server: ", resp);
                if (this.state.error) {
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
        // this.setState is used to put/update state!
        // if (e.target.name === "first") {
        //     this.setState({
        //         first: e.target.value,
        //     });
        // } else if (e.target.name === "last") {
        //     this.setState({
        //         last: e.target.value,
        //     });
        // }
    }

    render() {
        return (
            <div className="form">
                {this.state.error && <p>Something broke</p>}
                <h1>Registration</h1>
                {/* strategy #2 for binding: arrow functions! */}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="first"
                    type="text"
                    placeholder="first"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="last"
                    type="text"
                    placeholder="last"
                />
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
                <button onClick={() => this.handleClick()}>submit</button>
            </div>
        );
    }
}

///////MY NOTES/////
// // srec/registration.js
// // class components can do things with states
// // states becuz we will be dealing with user inputs
// import React from "react";
// import axios from "axios";

// // OR we can also do import {Component} from "react";
// export default class Registration extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             error:false,
//         };
//         // strategy #1
//         // this.handleChange = this.handleChange.bind(this);
//     }
//     handleClick(){
//         console.log("click!");
//         axios.post("/registration", dataToSendToServer)
//         .then((resp)=>{
//             console.log('err in registration:', err);
//         })
//         this.setState({
//             error:true,
//         })
//     }
//     // when user types on the field
//     handleChange(e) {
//         // with event obj we have access to what the user typed
//         // console.log("change is firing");
//         // console.log("e target val", e.target.value);
//         console.log("e target name:", e.target.name);

//         this.setState({ [e.target.name]: e.target.value,
//          });
//         // 1arg ob - 2 arg a cb fn
//     //     this.setState(
//     //         {
//     //             // val of first is whatever the user is typing
//     //             first: e.target.value,
//     //         },
//     //         () => console.log("this.state", this.state)
//     //     );
//     // }
//     render() {
//         return (
//             <div>
//                 {/* if this this.error is true then render this p tag */}
//                 {this.state.error && <p>Something broke</p>}
//                 {/* listen to the change event when user types then run */}
//                 {/* handlechange fn */}

//                 <h1>Registration</h1>
//                 <input
//                     onChange={(e) => this.handleChange(e)}
//                     name="first"
//                     type="text"
//                     placeholder="first"
//                 ></input>
//                 <input
//                     onChange={(e) => this.handleChange(e)}
//                     name="last"
//                     type="text"
//                     placeholder="last"
//                 ></input>
//                 <input
//                     onChange={(e) => this.handleChange(e)}
//                     name="email"
//                     type="text"
//                     placeholder="email"
//                 ></input>
//                 <input
//                     onChange={(e) => this.handleChange(e)}
//                     name="password"
//                     type="password"
//                     placeholder="password"
//                 ></input>
//                 <button onClick={() =>this.handleClick()}>submit</button>
//             </div>
//         );
//     }
// }
