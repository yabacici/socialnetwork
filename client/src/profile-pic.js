//  showing so use fn component

// export default function ProfilePic(props) {
//     console.log(props);
//     return (
//         <div onClick={props.toggleUploader} className="profile-pic">
//             <img
//                 className="avatar"
//                 src={props.profilePicUrl || "default.jpg"}
//                 alt={`${props.firstName}`}
//             />
//         </div>
//     );
// }

export default function (props) {
    return (
        <div className="profile-pic">
            <img
                className="avatar"
                onClick={props.toggleUploader}
                src={props.profilePicUrl || "default.jpg"}
                // alt={props.firstName + props.lastName}
            />
            <div>
                <label>{props.firstName + " " + props.lastName}</label>
            </div>
        </div>
    );
}
