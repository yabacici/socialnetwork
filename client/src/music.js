// import React from "react";
// import { useState, useEffect } from "react";

// function Music() {
//     // I used my mp3 as a test
//     // I need to create a db
//     // need to use upload
//     // let audio = new Audio("/cecile.mp3");
//     // let [audio] = useState(new Audio("/cecile.mp3"));
//     const [audio] = useState(new Audio(url));
//     const [playing, setPlaying] = useState(false);
//     const toggle = () => setPlaying(!playing);
//     useEffect(() => {
//         playing ? audio.play() : audio.pause();
//     }, [playing]);

//     return (
//         <div>
//             {/* <button className="music-btn" onClick={toggle}>
//                 Play your music
//             </button> */}
//             <img className="music-play" src="/play.jpg" onClick={toggle}></img>
//         </div>
//     );
// }

// export default Music;
