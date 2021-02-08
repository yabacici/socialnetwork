// child of helloworld.js

export default function Greetee(props) {
    console.log("props in greetee: ", props);
    return <span>{props.firstName || "AWSOME_USER"}</span>;
}
