// import React from "react";
// import axios from "./axios";

// export default class BioEditor extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             // state of button will change upon click
//             editingMode: false,
//         };
//     }
//     render() {
//         console.log("this.props in BioEditor", this.props);
//         if (this.state.editingMode) {
//             return (
//                 <div>
//                     <h1>EDIT MODE</h1>
//                     <textarea defaultValue="This is bio" />
//                     <button>Save Bio</button>
//                 </div>
//             );
//         }
//         return (
//             <div>
//                 <h1>I am the Bio Editor</h1>
//                 <p>this will be the users bio that we get from props</p>
//                 <button>Click me</button>
//             </div>
//         );
//     }
// }
