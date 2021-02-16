import { Component } from "react";
import axios from "./axios";
// import ProfilePic from "./profile-pic";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            error: false,
        };
    }

    // file select handler
    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    submit(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("file", this.state.file);
        // Allows the user to upload a profile picture
        // (work neeeded to save the selected file to the state of Uploader
        // and send it pack with FormData to the server)
        axios
            .post("/profile-pic", formData)
            .then((resp) => {
                // console.log("profile pic !");
                // console.log("resp.data.rows: ", resp.data.rows);
                // this.props.setProfilePicUrl(resp.data.rows);
                this.props.setProfilePicUrl(resp.data.rows);
            })
            .catch((err) => {
                console.log("err profile pic: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    delete(e) {
        e.preventDefault();
        console.log("delete button");
        const pic = "default.jpg";
        axios.post("/delete-profile-pic", pic).then((resp) => {
            console.log(resp);
            this.props.setProfilePicUrl("default.jpg");
        });
    }

    render() {
        return (
            <div className="uploader">
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="file"
                    type="file"
                    accept="image/*"
                ></input>
                <p>Drag your files here or click in this area.</p>
                <button
                    type="submit"
                    className="submit-btn"
                    onClick={(e) => this.submit(e)}
                >
                    Upload
                </button>
                <div className="delete-btn">
                    <button
                        type="submit"
                        className="submit-btn"
                        onClick={(e) => this.delete(e)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}
