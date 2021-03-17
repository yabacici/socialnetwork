// src/welcome.js
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpassword";
// import Logo from "./logo";
import Nav from "./nav";

// "dumb"/"presentational" are alternative names for function components
export default function Welcome() {
    return (
        <div>
            {/* <Nav /> */}

            <HashRouter>
                {/* <span className="blinking">Am I blinking?</span> */}
                <div className="welcome-tag">
                    <h1> ACOUSTIC LOUNGE</h1>
                </div>

                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route
                        path="/password/reset/start"
                        component={ResetPassword}
                    />
                </div>
            </HashRouter>
            {/* <Registration /> */}
        </div>
    );
}
