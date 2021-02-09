// src/welcome.js
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

// "dumb"/"presentational" are alternative names for function components
export default function Welcome() {
    return (
        <div>
            <h1>Welcome to your new favorite community</h1>
            <img src="/micro.jpg" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
            {/* <Registration /> */}
        </div>
    );
}
