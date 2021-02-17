import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import FriendshipButton from "./friendshipButton";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            profilePicUrl: this.props.profilePicUrl,
            bio: this.props.bio,
            error: false,
        };
    }

    componentDidMount() {
        console.log("this.props.match: ", this.props.match);
        console.log("id: ", this.props.match.params.id);
        // we should  make a request to our server to get the other user's data using the id
        // If we are trying to view our own profile,
        // we should make sure to send the user back to the '/' route
        axios
            .get(`/user-display/${this.props.match.params.id}`)
            .then((res) => {
                console.log("res: ", res);
                // When we receive a response from the server about the user's profile we're trying to view,
                //  we need to store that user info in state & then render it
                this.setState({
                    id: res.data.rows.id,
                    firstName: res.data.rows.first,
                    lastName: res.data.rows.last,
                    profilePicUrl: res.data.rows.profile_pic_url,
                    bio: res.data.rows.bio,
                    error: false,
                });
                // We'll also need the id of the user currently logged in (make sure you send it back to the client)
                // We'll need to do a check and make sure we cannot view our own profile (redirect them to / if they try to go to their page)
                // On the client-side, we can see the id of the person whose page we're on by console.logging → this.props.match.params.id
                //  COOKIE holds userId
                //
                if (this.props.match.params.id == res.data.cookie) {
                    this.props.history.push("/");
                }
            })
            .catch((err) => {
                console.log("error api/user: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        if (this.state.id) {
            return (
                <div className="profile-box">
                    <img
                        className="profile-pic"
                        src={this.state.profilePicUrl}
                        alt={`${this.state.firstName} ${this.state.lastName}`}
                    />
                    <h3>
                        {this.state.firstName} {this.state.lastName}
                    </h3>

                    <p className="bio-text">{this.state.bio}</p>
                </div>
            );
        }
        return (
            <div className="no-user-container">
                {this.state.error && (
                    <p className="error-msg">this user does not exist!</p>
                )}

                <Link to="/">
                    <button className="btn-box">Back to my profile</button>
                </Link>
                <FriendshipButton recipientId={this.state.id} />
            </div>
        );
    }
}

// render() {

//     <Link to="/">
//         <button className="btn-purple">Back to my profile</button>
//     </Link>;
//     if (this.state.id)
//         return (
//             <div>
//                 <h1>I am the other profile!!!</h1>
//                 <h2>Bio</h2>
//                 <img
//                     src={this.state.ProfilePicUrl}
//                     alt={this.state.firstName + this.state.lastName}
//                 />
//                 <div>This is :{this.state.bio}</div>
//                 <div>first name: {this.state.firstName}</div>
//                 <div>last name: {this.state.lastName}</div>
//             </div>
//         );
// }

// render() {
//     if (this.state.id)
//         return (
//             <div>
//                 <h1>I am the other profile!!!</h1>
//                 <h2>
//                     I will display the other user's information including
//                     their profile picture and bio but NOONE will be able to
//                     edit information in here! cause it's not your profile to
//                     edit!
//                     {this.state.bio}
//                 </h2>
//             </div>
//         );
// }
// }
