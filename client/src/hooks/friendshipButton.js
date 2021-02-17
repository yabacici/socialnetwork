import { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendshipButton(props) {
    const [friendshipStatus, setFriendshipStatus] = useState("send");
    const [error, setError] = useState(false);

    const buttonText = {
        send: "Make Friendship Request",
        accept: "Accept Friendship",
        cancel: "Cancel Friendship Request",
        end: "End Friendship",
    };

    useEffect(() => {
        console.log("useEffect in friendship effect!");

        axios
            .get(`/friendshipstatus//${props.id}`)
            .then((results) => {
                console.log("results friend: ", results.data.friend);
                console.log("results button: ", results.data.button);
                setFriendshipStatus(results.data.button);

                if (results.data.button == "accept") {
                    props.updateFriendShipStatus(true);
                }
            })
            .catch((err) => {
                console.log("err in get friendship users: ", err);
            });
    }, []);

    const submitRequest = () => {
        // console.log("submit function");

        axios
            .post(`/friendshipstatus/${friendshipStatus}`, {
                id: props.id,
            })
            .then((results) => {
                // console.log(" results data: ", results.data);
                setFriendshipStatus(results.data.button);

                if (results.data.button == "accept") {
                    props.updateFriendShipStatus(true);
                }
            })
            .catch((err) => {
                console.log("err in axios get users: ", err);
            });
    };

    return (
        <>
            {friendshipStatus && (
                <button className="btn-friend" onClick={() => submitRequest()}>
                    {buttonText[friendshipStatus]}
                </button>
            )}
        </>
    );
}

// export default function Friendshipbutton() {
//     const [buttonText, setButtonText] = useState("");
//     const [clicked, setClicked] = useState(false);
//     // needs to get passed the id of the user that we are currently viewing
//     // we will either want to befriend that user, cancel a request we made in the past,
//     // accept a pending friend request, or end our friendship
//     // the id of the other user lives in the OtherProfile component

//     // in useEffect we will want to make a request to the server to find out our
//     // relationship status with the user we are looking at, and send over some button text

//     // on submit/ btn click we want to send the button text to the server,
//     //to update our db, and change the btn text asgain, once the DB has
//     // been successfully updated

//     return (
//         <>
//             <button className="btn"> BUTTON TEXT !!</button>
//         </>
//     );
// }
