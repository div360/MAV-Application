import React from "react";
import {
  FaPlay,
  FaPause,
  FaBackward,
  FaVolumeUp,
  FaCog,
  FaList,
} from "react-icons/fa";

interface BottomControlPanelProps {
  onPlayPause: () => void;
  onFastBackward: () => void;
  currentTime: number;
  duration: number;
  playing: boolean;
}

const BottomControlPanel: React.FC<BottomControlPanelProps> = ({
  onPlayPause,
  onFastBackward,
  currentTime,
  duration,
  playing,
}) => {
  const progress = (currentTime / duration) * 100;
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
      <FaVolumeUp color="white" />
      <FaCog color="white" />
      <FaList color="white" />
    </div>
  );
};

export default BottomControlPanel;
