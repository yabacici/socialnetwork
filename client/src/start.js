import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    // here goes style/image
    elem = <p>I am not the welcome route!</p>;
}

ReactDOM.render(elem, document.querySelector("main"));

////////MY NOTES///////
// import ReactDOM from "react-dom";
// // import HelloWorld from "./helloworld.js";
// import Welcome from "./welcome";

// // if user on /welcome path,
// //the location obj knows about the url
// let elem;
// if (location.pathname == "/welcome") {
//     elem = <Welcome />;
// } else {
//     elem = <p>I am not the welcome route!</p>;
// }
// // attches our react app to the DOM
// // 1st arg : what element
// //2nd arg: where the element should be placed
// // ReactDOM.render(<HelloWorld />, document.querySelector("main"));
// ReactDOM.render(elem, document.querySelector("main"));