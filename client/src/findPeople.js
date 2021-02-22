import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [userInput, setUserInput] = useState("");
    // const [error, setError] = useState(false);

    // const handleChange = (e) => {
    //     setUsers(e.target.value);
    // };
    // When FindPeople mounts...
    useEffect(() => {
        console.log("useEffect in effect!");
        axios
            .get("/users")
            .then(({ data }) => {
                console.log(data);
                setUsers(data);
            })
            .catch((err) => {
                console.log("error in get users", err);
            });
    }, []);

    useEffect(() => {
        console.log("useEffect in effect for the second time!");
        let abort = false;
        console.log("this is user input:", userInput);
        if (userInput) {
            axios
                .get(`/findpeople/${userInput}`)
                .then(({ data }) => {
                    if (!abort) {
                        console.log(data);
                        setUsers(data);
                    } else {
                        abort = true;
                    }
                })
                .catch((err) => {
                    console.log("error finding people: ", err);
                });
        }
    }, [userInput]);

    return (
        <div className="searchppl-container">
            {/* <div className="text-findpeople">
                <h3>Look, they just joined your network</h3>
            </div> */}

            {users &&
                users.map((user) => {
                    return (
                        <Link
                            to={`/user/${user.id}`}
                            key={user.id}
                            className="user-search"
                        >
                            <img
                                className="column"
                                src={user.profile_pic_url || "avatar.png"}
                                alt={`${user.first} ${user.last}`}
                            />
                            <p className="p-column">{`${user.first} ${user.last}`}</p>
                        </Link>
                    );
                })}

            <input
                name="users"
                type="text"
                className="search-input"
                placeholder="find people"
                onChange={(e) => setUserInput(e.target.value)}
                autoComplete="off"
            />
        </div>
    );
}
