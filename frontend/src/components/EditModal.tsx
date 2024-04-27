import React, { useRef, useState } from "react";
import { useBearStore } from "../store";
import axios from "axios";
import { Modal, Button, Input, Slider } from "antd";
import ReactPlayer from "react-player";
import { FaPlay, FaPause } from "react-icons/fa";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

interface EditModalProps {
  // Define your props here
}

const EditModal: React.FC<EditModalProps> = () => {
  const openEditModel = useBearStore((state) => state.openEditModel);
  const videoData = useBearStore((state) => state.videoData);
  const setVideoData = useBearStore((state) => state.setVideoData);
  const videoRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState([0, duration]);
  const [isLoading, setIsLoading] = useState(false);

  const [trimmedVideo, setTrimmedVideo] = useState(null);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSliderChange = (value: [number, number]) => {
    setSliderValue(value);
    if (videoRef.current) {
      videoRef.current.seekTo(value[0], "seconds");
      videoRef.current.play();
    }
  };

  const togglePlayPause = () => {
    setPlaying(!playing); // Toggle playing state

    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        const endTime = sliderValue[1];
        videoRef.current.onProgress = (progress) => {
          if (progress.playedSeconds >= endTime) {
            videoRef.current.pause();
          }
        };
      }
    }
  };

  const ffmpeg = createFFmpeg({ log: true });

  const trimVideo = async (inputFile, startTime, endTime, outputFile) => {
    // Load ffmpeg
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    // Write the file to memory
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(inputFile));

    // Run the FFmpeg command
    await ffmpeg.run(
      "-i",
      "input.mp4",
      "-ss",
      startTime,
      "-to",
      endTime,
      "-c",
      "copy",
      outputFile
    );

    // Read the result
    const data = ffmpeg.FS("readFile", outputFile);

    // Create a URL for the trimmed video file
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    return url;
  };

  const handleOk = async () => {
    setIsLoading(true);
    const startTime = formatTime(sliderValue[0]);
    const endTime = formatTime(sliderValue[1]);
    const inputFile = videoData.source;
    const outputFile = "trimmed-video.mp4";

    try {
      const url = await trimVideo(inputFile, startTime, endTime, outputFile);

      setVideoData({
        source: url,
        videoRef: videoRef,
      });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    useBearStore.setState({ openEditModel: false });
  };

  return (
    <Modal
      title="Edit Video"
      open={openEditModel}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Return
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          loading={isLoading}
          style={{ backgroundColor: "orange", borderColor: "orange" }}
        >
          Apply
        </Button>,
      ]}
    >
      <div>
        <ReactPlayer
          ref={videoRef}
          url={videoData.source}
          width="100%"
          height="300px"
          playing={playing}
          onProgress={({ playedSeconds, playedPercent, loadedPercent }) => {
            setCurrentTime(playedSeconds);
            setDuration(videoRef.current?.getDuration() || 0);
          }}
        />
        {playing ? (
          <FaPause onClick={togglePlayPause} color="black" />
        ) : (
          <FaPlay onClick={togglePlayPause} color="black" />
        )}
        <div>
          <p>
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
          <Slider
            range
            min={0}
            max={duration}
            value={sliderValue}
            onChange={handleSliderChange}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
