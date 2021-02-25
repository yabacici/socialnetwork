import React from "react";
import { useState, useEffect } from "react";

function Music() {
    // let audio = new Audio("/cecile-aaliyah.mp3");
    let [audio] = useState(new Audio("/cecile-aaliyah.mp3"));
    // const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);
    const toggle = () => setPlaying(!playing);
    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing]);

    return (
        <div>
            {/* <button className="music-btn" onClick={toggle}>
                Play your music
            </button> */}
            <img className="music-play" src="/play.jpg" onClick={toggle}></img>
        </div>
    );
}

export default Music;
