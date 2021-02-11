import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";
import Logo from "./logo";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Initialize App's state
            uploaderVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        // BIND means we can use "this" within our methods
    }

    componentDidMount() {
        //req.session.userId (send it back with res.json)
        axios
            .get("/user")
            .then((res) => {
                console.log("fetch user's data from DB");
                console.log("successful res data ", res.data.rows);
                this.setState({
                    // when data back, set it to the state
                    firstName: res.data.rows.first,
                    lastName: res.data.rows.last,
                    profilePicUrl: res.data.rows.profile_pic_url,
                });
            })
            .catch((err) => {
                console.log("err in user: ", err);
            });
    }

    toggleUploader() {
        // TODO: Toggles the "uploaderVisible" state
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    setProfilePicUrl(profilePicUrl) {
        // TODO: Updates the "profilePicUrl" in the state
        // TODO: Hides the uploader
        this.setState({
            profile_pic_url: profilePicUrl,
            uploaderVisible: false,
        });
    }

    render() {
        // console.log("this state in app:", this.state);
        // if (!this.state.id) {
        //     return null;
        // }
        return (
            <div className="app">
                <Logo />
                <ProfilePic
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    profilePicUrl={this.state.profilePicUrl}
                    uploaderVisible={this.state.uploaderVisible}
                    toggleUploader={this.toggleUploader}
                    // size="small"
                />
                {/* <div className="editProfilePic">
                    <button onClick={() => this.toggleUploader()}>
                        Edit Profile Pic
                    </button>
                </div> */}
                {/* <Profile
                    id={this.state.id}
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.profile_pic_url}
                    onClick={() => this.toggleUploader()}
                    bio={this.state.bio}
                    setBio={(e) => this.setBio(e)}
                /> */}

                {/* <a onClick={() => this.toggleUploader()}>
                    <img className="camera" src="camera.jpg" />
                </a> */}
                {this.state.uploaderVisible && (
                    <Uploader setProfilePicUrl={this.setProfilePicUrl} />
                )}
                <button
                    type="submit"
                    className="submit-btn"
                    onClick={() => this.toggleUploader()}
                >
                    Click here
                </button>
            </div>
        );
    }
}
