import ProfilePic from "./profile-pic";
import Logo from "./logo";
import Logout from "./Logout";

export default function Nav(props) {
    console.log("props: ", props);
    return (
        <nav>
            <Logo />
            <div className="logo">
                <h4>Making The Band</h4>
            </div>

            <ul className="nav-links">
                <li>
                    <a href="/find-users">Find People</a>
                </li>
                <li>
                    <a href="#">Chat</a>
                </li>
                <li>
                    <a href="/logout">logout</a>
                </li>
            </ul>
            <div className="logout-container">
                <Logout />
                <ProfilePic {...props} />{" "}
            </div>
        </nav>
    );
}
