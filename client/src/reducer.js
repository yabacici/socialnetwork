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
    } else if (action.type === "END_FRIENDSHIP") {
        state = {
            ...state,
            friendsList: state.friendsList.filter(
                (friend) => friend.id !== action.id
            ),
        };
    }

    return state;
}
