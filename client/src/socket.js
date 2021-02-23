import { chatMessages, chatMessage, newMessage, deleteMsg } from "./actions";
import { io } from "socket.io-client";
// The idea is that this file creates the socket connect in a way that ensures there can be only one.
// It also listens for all the events that are expected to happen
// and makes sure the appropriate Redux actions are dispatched when they do.
//  It also makes the socket object available to be imported in other files
// so they can emit events to the server

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        // to see ALL messages
        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
        socket.on("newMessage", (lastMessage) =>
            store.dispatch(newMessage(lastMessage))
        );
        socket.on("deleteMsg", (messageId) => {
            store.dispatch(deleteMsg(messageId));
        });
    }
};
