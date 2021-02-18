import ReactDOM from "react-dom";
// import React from "react";
import Welcome from "./welcome";
import App from "./app.js";
// encounter redux
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { reducer } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";

// import Logo from "./logo";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    // elem = <p>I am not the welcome route!</p>;
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
    // elem = <Logo />;
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
