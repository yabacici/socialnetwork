// src/welcome.js
import Registration from "./registration";

// "dumb"/"presentational" are alternative names for function components
export default function Welcome() {
    return (
        <div>
            <h1>Welcome to your new favorite community</h1>
            <Registration />
        </div>
    );
}
