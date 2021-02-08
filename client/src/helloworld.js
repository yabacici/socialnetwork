// export default function HelloWorld() {

// // component only returns 1 child
// // we know it is a component bcuz of capital letter
// function HelloWorld() {
//     // JSX describes what UI should look like
//     // always RETURN the jsx
//     const name = "Cécile";
//     return <div clasName="newClass">Hello, World! {name}</div>;
// }

import Greetee from "./greetee";
import Counter from "./counter";
// this is a functional component whose job is only to render information
// (they cannot have state)
export default function HelloWorld() {
    const name = "Cécile";

    return (
        <div className="adobo">
            <div className="newClass">
                Hello <Greetee firstName={name} />
            </div>
            <div className="newClass">
                Hello <Greetee firstName="adobo" />
            </div>
            <div className="newClass">
                Hello <Greetee />
            </div>
            <Counter />
        </div>
    );
}
