//contains action creators
//an action createor is a fn that returns an obj
import axios from "./axios";
// export async function myFirstActionCreator() {
//     // we can OPTIONALLY "talk" to the server here
//     const { data } = await axios.get("/someroute");
//     return {
//         type: "UPDATE_STATE_SOMEHOW",
//         data: data.user.id,
//     };
// }

export async function receiveFriendsWannabes() {
    // we can OPTIONALLY "talk" to the server here
    const { data } = await axios.get("/friends-wannabes");
    console.log("this is the accept friend data:", data);
    if (data.success)
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            friendsList: data.rows,
        };
}

export async function acceptFriend(id) {
    // we can OPTIONALLY "talk" to the server here
    const { data } = await axios.post("/friendship/accept", { id });
    console.log("this is the accept friend data:", data.id);
    return {
        type: "ACCEPT_FRIENDSHIP",
        id: id,
    };
}

export async function unfriend(id) {
    // we can OPTIONALLY "talk" to the server here
    const { data } = await axios.post("/friendship/end", { id });
    console.log("this is the end friendship data:", data.id);
    return {
        type: "END_FRIENDSHIP",
        id: id,
    };
}

// export async function pending() {
//     // we can OPTIONALLY "talk" to the server here
//     const { data } = await axios.post("/friendship/wannabes");
//     return {
//         type: "RECIEVE_LIST",
//         data: data.users.id,
//     };
// }
