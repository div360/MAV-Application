import React from "react";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Topbar from "../components/Topbar";
import BottomControlPanel from "../components/BottomControlPanel";
import VideoComponent from "../components/VideoComponent";
import ToDoModal from "../components/ToDoModal";

const Dashboard: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [isToDoModalVisible, setIsToDoModalVisible] = useState(false);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        setDuration(videoRef.current.duration || 0);
      });

      const updateCurrentTime = () => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
        }
        requestAnimationFrame(updateCurrentTime);
      };
      updateCurrentTime();
    }
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const fastBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const [showToDoModal, setShowToDoModal] = useState(false);
  const [toDos, setToDos] = useState([]); // Example state to store to-dos

  const handleOpenToDoModal = () => {
    setIsToDoModalVisible(true);
  };

  const addToDo = (newToDo) => {
    setToDos([...toDos, newToDo]);
  };

  const deleteToDo = (index) => {
    setToDos(toDos.filter((_, idx) => idx !== index));
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }

  return (
    <div className="min-h-[100vh] max-h-[100vh] min-w-[100vw] max-w-[100vw] bg-[#343434] flex flex-col justify-center overflow-hidden">
      <div className="absolute top-0">
        <Navigation />
        <Topbar />
      </div>
      <div className="flex min-h-[100%] justify-center items-center bg-transparent">
        <VideoComponent videoRef={videoRef} />
      </div>
      <BottomControlPanel
        onPlayPause={togglePlayPause}
        onFastBackward={fastBackward}
        currentTime={currentTime}
        duration={duration}
        playing={playing}
        isMuted={isMuted}
        onListClick={handleOpenToDoModal}
        onMuteToggle={handleMuteToggle}
      />
        <ToDoModal
          visible={isToDoModalVisible}
          onClose={() => setIsToDoModalVisible(false)}
          toDos={toDos}
          addToDo={addToDo}
          deleteToDo={deleteToDo}
        />
    </div>
  );
};

export default Dashboard;
