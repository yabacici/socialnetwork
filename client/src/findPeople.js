import axios from "axios";
import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

function FindPeople() {
    const [users, setUsers] = useState("");
    const [userInput, setUserInput] = useState([]);

    const handleChange = (e) => {
        setUsers(e.target.value);
    };
    // When FindPeople mounts...
    useEffect(() => {
        axios
            .get("/users")
            .then(({ data }) => {
                console.log("data: ", data);
                setUsers(data.rows);
            })
            .catch((err) => {
                console.log("error in axios GET users", err);
            });
    }, []);

    useEffect(() => {
        let abort = false;
        if (userInput) {
            axios
                .get(`/findpeople/${userInput}`)
                .then(({ data }) => {
                    console.log("data in find users: ", data);

                    if (!abort) {
                        setUsers(data.rows);
                    } else {
                        abort = true;
                    }
                })
                .catch((err) => {
                    console.log("error finfing people: ", err);
                });
        }
    }, [userInput]);

    return (
        // WORK ON THIS PART
        <div>
            <h1>this is the list of {users}</h1>
            <input name="users" type="text" onChange={handleChange} />{" "}
        </div>
    );
}
