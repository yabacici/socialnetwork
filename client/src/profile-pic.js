//  showing so use fn component

// Receives props from App to display the profile pic
// (it should render a default if none is available).
// It also receives a method from App allowing it to toggle the uploader when it is clicked.

export default function ProfilePic({
    firstName,
    lastName,
    profilePicUrl,
    toggleUploader,
    size = "",
}) {
    return (
        <div className="profile-pic">
            <img
                className={`${size} avatar`}
                onClick={toggleUploader}
                src={profilePicUrl || "default.jpg"}
                alt={`${firstName} ${lastName}`}
            />
            <div className="profile-name">
                {/* <label>{firstName + " " + lastName}</label> */}
                <p>{`${firstName} ${lastName}`}</p>
            </div>
        </div>
    );
}
