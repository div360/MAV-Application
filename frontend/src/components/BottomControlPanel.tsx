import React from "react";
import { useEffect, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaList,
} from "react-icons/fa";
import { LuScissorsSquare } from "react-icons/lu";
import { useBearStore } from "../store";

interface BottomControlPanelProps {
  onPlayPause: () => void;
  onFastBackward: () => void;
  currentTime: number;
  duration: number;
  playing: boolean;
  isMuted: boolean;
  onMuteToggle: () => void; // Fix: Specify the correct type for onMuteToggle
  onListClick: () => void;
}

const BottomControlPanel: React.FC<BottomControlPanelProps> = ({
  onPlayPause,
  onFastBackward,
  currentTime,
  duration,
  playing,
  isMuted,
  onMuteToggle,
  onListClick,
}) => {
  const progress = (currentTime / duration) * 100;

  const videoData = useBearStore((state) => state.videoData);

  const toggleEditModal = useBearStore((state) => state.handleEditModel);

  const handleEditClick = () => {
    toggleEditModal();
  };
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setForceUpdate((prev) => prev + 1);
    }, 500); // Update every 500ms (adjust if needed)

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute bottom-0 min-w-[100vw] max-w-[100vw] min-h-[6vh] bg-[#1f1f1f] w-full flex justify-center items-center gap-10">
      <FaBackward onClick={onFastBackward} color="white" />
      {playing ? (
        <FaPause onClick={onPlayPause} color="white" />
      ) : (
        <FaPlay onClick={onPlayPause} color="white" />
      )}
      <div className="min-w-[40vw] max-w-[40vw] h-1 bg-gray-500 relative my-2 rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-orange-500 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <button onClick={onMuteToggle}>
        {isMuted ? (
          <FaVolumeMute color="white" />
        ) : (
          <FaVolumeUp color="white" />
        )}
      </button>
      {/* <FaCog color="white" /> */}
      <button onClick={onListClick}>
        <FaList color="white" />
      </button>
      <button onClick={handleEditClick}>
        <LuScissorsSquare color="white" />
      </button>
    </div>
  );
};

export default BottomControlPanel;
