// pres component so func component
import ProfilePic from "./profile-pic";
import BioEditor from "./bio-editor";
// DIRECT CHILD of APP component
// render the user's firstname, lastname, and the <ProfilePic /> and <BioEditor /> components
// ProfilePic is the EXACT same component you have used in App
// However, the image will be bigger this time

export default function Profile(props) {
    console.log(" props profile: ", props);
    return (
        <div className="border-green">
            <h1>
                I am the profile component {props.firstName} {props.lastName}
            </h1>
            <ProfilePic
                firstName={props.firstName}
                lastName={props.lastName}
                profilePicUrl={props.profilePicUrl}
            />
            <BioEditor bio={props.bio} />
        </div>
    );
}
