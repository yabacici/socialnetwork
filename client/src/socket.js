import { chatMessages, newChatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("newChatMessage", (msg) =>
            store.dispatch(newChatMessage(msg))
        );
    }
};
