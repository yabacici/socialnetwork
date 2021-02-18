import { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendshipButton(props) {
    const [buttonText, setButtonText] = useState("");
    // const [error, setError] = useState(false);

    // const buttonText = {
    //     send: "Make Friendship Request",
    //     accept: "Accept Friendship Request",
    //     cancel: "Cancel Friendship Request",
    //     end: "End Friendship",
    // };

    useEffect(() => {
        console.log("useEffect in friendship effect!");
        // needs to get passed the id of the user that we are currently viewing
        // we will either want to befriend that user, cancel a request we made in the past,
        // accept a pending friend request, or end our friendship
        // the id of the other user lives in the OtherProfile component

        axios
            .get(`/friendship-status/${props.id}`)
            .then((results) => {
                console.log("results button: ", results.data.button);
                setButtonText(results.data.button);
            })
            .catch((err) => {
                console.log("err in get friendship users: ", err);
            });
    }, [props.buttonText]);

    const submitButton = async () => {
        if (buttonText === "Make Friendship Request") {
            const status = await axios.post("/friendship/send", {
                id: props.id,
            });
            setButtonText(status.data.button);
        } else if (
            buttonText === "End Friendship" ||
            buttonText === "Cancel Friendship Request"
        ) {
            const status = await axios.post("/friendship/end", {
                id: props.id,
            });
            setButtonText(status.data.button);
        } else if (buttonText === "Accept Friendship Request") {
            const status = await axios.post("/friendship/accept", {
                id: props.id,
            });
            console.log(status);
            setButtonText(status.data.button);
        }
    };
    return (
        // <div onClick={submitButton} className="btn-friend">
        //     {buttonText}
        // </div>
        <div>
            <button onClick={() => submitButton()}>{buttonText}</button>
        </div>
    );
}

// export default function Friendshipbutton() {
//     const [buttonText, setButtonText] = useState("");
//     const [clicked, setClicked] = useState(false);

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
