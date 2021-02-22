import React from "react";
import axios from "./axios";
// CHILD of Profile component
// 1.If the user has NO existing bio, then it will display a button/clickable element saying 'ADD BIO'
// 2.If the user HAS a bio, then it will display the bio, along with a button/clickable element saying 'EDIT BIO'
// 3.If the user clicks either 'ADD BIO' or 'EDIT BIO', the component will switch to EDIT MODE and a textarea will be displayed
//  If EDIT BIO was clicked then the text area will be prepopulated with the existing bio before the user makes any changes
export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            // state of button will change upon click
            // If editingMode, is false then the component is in DISPLAY mode,
            // and the textarea is hidden
            // If this value becomes true, then the component is in EDIT mode and
            // the textarea becomes visible
            editingMode: false,
            bio: this.props.bio,
        };
        this.toggleEditingMode = this.toggleEditingMode.bind(this);
    }

    // componentDidMount() {
    //     this.setState({
    //         bio: this.props.bio,
    //     });
    // }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    toggleEditingMode() {
        this.setState({
            editingMode: !this.state.editingMode,
        });
    }
    // Upon clicking SAVE/UPDATE, we will need to call a function which we have defined in the BioEditor component
    // This will make a POST request storing the new BIO in the DB
    // Once successful, the BioEditor will update the value of BIO in the state of <App />
    // It will do that by calling a function passed down from App as props,
    // which receives the new bio as an argument, and updates the state in App.

    submitBio(e) {
        // console.log("hello");
        e.preventDefault();
        axios
            .post("/bio", this.state)
            .then((res) => {
                console.log("res: ", res);

                this.setState({
                    editingMode: false,
                    bio: res.data.bio,
                });
            })
            .catch((err) => {
                console.log("error in axios bio: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        console.log("this.props in BioEditor", this.props);
        if (this.state.editingMode) {
            return (
                <div className="bio-edit">
                    <h2>EDIT MODE</h2>
                    <textarea
                        name="bio"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={
                            this.state.bio
                                ? `${this.state.bio}`
                                : "Don't be shy, tell us more about yourself"
                        }
                        // defaultValue="Don't be shy, tell us more about yourself"
                    />

                    <button
                        className="save-btn"
                        onClick={(e) => this.submitBio(e)}
                    >
                        save
                    </button>
                </div>
            );
        }
        return (
            <div className="bio-container">
                <p className="bio-text">{this.state.bio}</p>
                <button
                    className="save-btn"
                    // className="edit-click"
                    onClick={() => this.toggleEditingMode()}
                >
                    {this.state.bio ? "Edit Bio" : "Add Bio"}
                </button>
                {this.state.error && (
                    <p className="error-message">
                        Oops something went wrong! Please try again.
                    </p>
                )}
            </div>
        );
        // return (
        //     <div>
        //         <h1>I am the Bio Editor</h1>
        //         <p>this will be the users bio that we get from props</p>
        //         <button onClick={() => this.toggleEditingMode()}>click</button>
        //     </div>
        // );
    }
}
