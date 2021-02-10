// src/welcome.js
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpassword";
import Logo from "./logo";

// "dumb"/"presentational" are alternative names for function components
export default function Welcome() {
    return (
        <div>
            <Logo />
            <h1>Welcome: find your peers!</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </div>
            </HashRouter>
            {/* <Registration /> */}
        </div>
    );
}
