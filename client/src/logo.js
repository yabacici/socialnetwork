import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <>
            <div className="logo-container">
                {/* <p>I am the logo component</p> */}
                <Link to="/">
                    <img className="icon" src="/micro.jpg"></img>
                </Link>
            </div>
        </>
    );
}
