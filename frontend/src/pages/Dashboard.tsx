import React from "react";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Topbar from "../components/Topbar";
import BottomControlPanel from "../components/BottomControlPanel";
import VideoComponent from "../components/VideoComponent";

const Dashboard: React.FC = () => {

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const videoRef = React.useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
      });
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current?.duration || 0);
      });
    }
  }, []);

  const togglePlayPause = () =>{
    if(videoRef.current){
      if(playing){
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setPlaying(!playing)
    }
  }

  const fastBackward=()=>{
    if(videoRef.current){
      videoRef.current.currentTime -= 10
    }
  }

  return (
    <div className="min-h-[100vh] max-h-[100vh] min-w-[100vw] max-w-[100vw] bg-[#343434] flex flex-col justify-center overflow-hidden">
      <div className="absolute top-0">

      <Navigation />
      <Topbar />
      </div>
      <div className="flex min-h-[100%] justify-center items-center bg-transparent">
        <VideoComponent videoRef={videoRef}/>
      </div>
      <BottomControlPanel onPlayPause={togglePlayPause} onFastBackward={fastBackward} currentTime={currentTime} duration={duration} playing={playing}/>
    </div>
  );
};

export default Dashboard;
