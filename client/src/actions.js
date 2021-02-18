//contains action creators
//an action createor is a fn that returns an obj
import axios from "./axios";
export async function myFirstActionCreator() {
    // we can OPTIONALLY "talk" to the server here
    const { data } = await axios.get("/someroute");
    return {
        type: "UPDATE_STATE_SOMEHOW",
        data: data.user.id,
    };
}
