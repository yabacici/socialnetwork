// series of if statement where we check the action
// very 1st time we create state it will always be undefine then will always be an obj
//thats why we use state ={} this is a default value
export function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsList: action.friendsList,
        };
    }
    if (action.type === "ACCEPT_FRIENDSHIP") {
        state = {
            ...state,
            friendsList: state.friendsList.map((friend) => {
                if (friend.id === action.id) {
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }
    if (action.type === "END_FRIENDSHIP") {
        state = {
            ...state,
            friendsList: state.friendsList.filter(
                (friend) => friend.id !== action.id
            ),
        };
    }
    if (action.type === "DISPLAY_MESSAGES") {
        state = {
            ...state,
            messages: action.messages,
        };
    }
    if (action.type === "SEND_MESSAGE") {
        state = {
            ...state,
            textMessage: action.textMessage,
        };
    }
    if (action.type === "DISPLAY_NEW_MESSAGE") {
        state = {
            ...state,
            messages: [...state.messages, action.newMessage],
        };
    }
    if (action.type === "DELETE_MESSAGE") {
        state = {
            ...state,
            messages: state.messages.filter(
                (message) => message.id != action.messageId
            ),
        };
    }

    return state;
}
