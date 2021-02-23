// pres component so func component
import ProfilePic from "./profile-pic";
import BioEditor from "./bio-editor";
import DeleteProfilePic from "./delete-profile-pic";
// DIRECT CHILD of APP component
// render the user's firstname, lastname, and the <ProfilePic /> and <BioEditor /> components
// ProfilePic is the EXACT same component you have used in App
// However, the image will be bigger this time

export default function Profile(props) {
    console.log(" props profile: ", props);
    return (
        <div className="card">
            <ProfilePic
                className="card-container"
                style="width:300px;height:300px"
                firstName={props.firstName}
                lastName={props.lastName}
                profilePicUrl={props.profilePicUrl}
            />
            <DeleteProfilePic
                profilePicUrl={props.profilePicUrl}
                deletePic={props.deletePic}
                id={props.id}
            />
            <h2>
                Welcome {props.firstName} {props.lastName} !
            </h2>

            <BioEditor
                firstName={props.firstName}
                lastName={props.lastName}
                bio={props.bio}
            />
            {/* <button onClick={() => props.toggleUploader()}>
                New profile picture
            </button> */}
        </div>
    );
}
