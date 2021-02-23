import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { receiveFriendsWannabes, acceptFriend, unfriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter((friend) => friend.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter((friend) => friend.accepted == false)
    );

    const pendingUser = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter(
                (friend) => !friend.accepted && friend.sender_id == friend.id
            )
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    console.log("friends: ", friends);
    console.log("wannabes: ", wannabes);
    console.log("pendingUser: ", pendingUser);

    // if (!friends || !wannabes || !pendingUser) {
    if (!friends || !wannabes) {
        return null;
        // return <div className=""></div>; // possibly add sth here
    }

    return (
        <div className="show-all">
            <div className="friends-container">
                <h1>Hey there!</h1>
                <h2>Look at who your friends are</h2>
                <div className="friends">
                    {friends.length === 0 && (
                        <p>No friends? Time to socialize!</p>
                    )}
                    {friends &&
                        friends.map((friend) => (
                            <div className="accepted-friends" key={friend.id}>
                                <img src={friend.profile_pic_url} />
                                <p>
                                    {friend.first} {friend.last}
                                </p>
                                <div>
                                    <button
                                        className="btn-friends"
                                        onClick={() => {
                                            console.log("in unfriend");
                                            dispatch(unfriend(friend.id));
                                        }}
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {/* <div className="pending-container">
                <h2>Pending requests</h2>
                {pendingUser.length === 0 && (
                    <p>No friends? Time to socialize!</p>
                )}
                {pendingUser.map((friend) => {
                    return (
                        <div className="pending-req" key={friend.id}>
                            <img
                                src={friend.profile_pic_url}
                                alt={friend.first}
                            />
                            <span>
                                {friend.first} {friend.last}
                            </span>
                            <button
                                className="btn-pending"
                                onClick={() => {
                                    console.log("in pendingUser");
                                    dispatch(unfriend(friend.id));
                                }}
                            >
                                Cancel request
                            </button>
                        </div>
                    );
                })}
            </div> */}
            {/* <div className="pending-container">
                <h2>Pending requests</h2>
                <h2>No friends? Time to socialize!</h2>
                {pendingUser.length === 0 && (
                    <p>No friends? Time to socialize!</p>
                )}

                {pendingUser &&
                    pendingUser.map((friend) => (
                        <div className="wannabes" key={friend.id}>
                            <img src={friend.profile_pic_url} />
                            <p>
                                {friend.first} {friend.last}
                            </p>
                            <div>
                                <button
                                    className="btn-pending"
                                    onClick={() =>
                                        dispatch(acceptFriend(friend.id))
                                    }
                                >
                                    Cancel request
                                </button>
                            </div>
                        </div>
                    ))}
            </div> */}
            <div className="wannabes-container">
                <h2>Wannabes</h2>
                <h2>You are popular! Look at who wants to be your friend</h2>
                {wannabes.length === 0 && (
                    <p>No Requests? Time to socialize!</p>
                )}

                {wannabes &&
                    wannabes.map((friend) => (
                        <div className="wannabes" key={friend.id}>
                            <img src={friend.profile_pic_url} />
                            <p>
                                {friend.first} {friend.last}
                            </p>
                            <div>
                                <button
                                    className="btn-wannabes"
                                    onClick={() =>
                                        dispatch(acceptFriend(friend.id))
                                    }
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
