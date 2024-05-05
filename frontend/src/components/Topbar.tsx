import React from "react";
import { useState } from "react";
import "./styles.css";
import activity from "../assets/activity.svg";
import nav1 from "../assets/nav1.svg";
import nav2 from "../assets/nav2.svg";
import nav3 from "../assets/nav3.svg";
import nav4 from "../assets/nav4.svg";
import nav5 from "../assets/nav5.svg";
import nav6 from "../assets/nav6.svg";
import nav7 from "../assets/nav7.svg";
import nav8 from "../assets/nav8.svg";
import folderDetails from "../assets/folder-details.svg";
import folderSync from "../assets/folder-sync.svg";
import decrease from "../assets/decrease.svg";
import record from "../assets/record.svg";
import chatbot from "../assets/chatbot.svg";
import { toast } from "react-toastify";
import { Modal, Button, InputNumber, Slider, Switch, Select } from "antd";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useBearStore } from "../store";
import Plot from "react-plotly.js";

const { Option } = Select;
const Topbar = () => {
  const generateData = () => {
    const fftData = [];
    const twfData = [];

    for (let i = 0; i < 100; i++) {
      fftData.push({ x: i, y: Math.random() * 100 });
      twfData.push({ x: i, y: Math.random() * 100 });
    }

    return { fftData, twfData };
  };
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(1);
  
  const [visible1, setVisible1] = useState(false);
  const [fftvisible, setFFTVisible] = useState(false);
  const [amplification, setAmplification] = useState(1);
  const [motionBlur, setMotionBlur] = useState(false);
  const [data, setData] = useState(generateData());
  const videoData = useBearStore((state) => state.videoData);
  const setVideoData = useBearStore((state) => state.setVideoData);
  const videoRef = videoData.videoRef;
  const [videoType, setVideoType] = useState("mp4");
  const [videoSize, setVideoSize] = useState("1080p");

  const showModal1 = () => {
    setVisible1(true);
  };

  const notify = () =>
    toast.success("Processing Complete", {
      position: "top-center", // Position options: 'top-left', 'top-right', etc.
      autoClose: 3000, // Time in milliseconds
    });

  const showFFTModal = () => {
    setData(generateData());
    setFFTVisible(true);
  };


  const handleOk1 = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible1(false);
    }, 3000);
  };

  const handleCancel1 = () => {
    setVisible1(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setLoading(true);
    const inputFile = videoData.source;
    const outputFile = "frame-changed-video.mp4";
    try {
      const url = await changeFrameRate(inputFile, counter, outputFile);

      setVideoData({
        source: url,
        videoRef: videoRef,
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    notify();
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const ffmpeg = createFFmpeg({ log: true });
  const changeFrameRate = async (inputFile, frameRate, outputFile) => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(inputFile));
    try {
      console.log("Starting FFmpeg processing...");
      await ffmpeg.run(
        "-i",
        "input.mp4",
        "-filter:v",
        `setpts=0.5*PTS`,
        "-r",
        `${frameRate}`,
        outputFile
      );
      console.log("FFmpeg processing complete.");
      const data = ffmpeg.FS("readFile", outputFile);
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );

      return url;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFFTCancel =()=>{
    setFFTVisible(false);
  }

  const handleFFTOk =()=>{
    setFFTVisible(false);
  }

  return (
    <div className="px-4 pt-4 pb-2 bg-[#1f1f1f] min-w-[100vw] max-w-[100vw] flex">
      <div className="flex flex-col gap-5 max-w-[25vw]">
        <div className="flex gap-10 pr-10 border-r-2 ">
          <div
            className="gradient-border bg-transparent flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] z-0 hover:scale-110 transition-all "
            onClick={showModal}
          >
            <img src={nav8} alt="" className="h-6 w-auto z-20" />
            <p className="text-xs text-center text-white z-20">
              Frame Rate 10x
            </p>
          </div>
          <div className="gradient-border flex flex-col justify-between max-w-[4rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={activity} alt="" className="h-8 w-auto" />
            <p className="text-xs text-white text-center">
              Add Calibration Point
            </p>
          </div>
          <div className="gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={folderDetails} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Process Vibration</p>
          </div>
          <div className="gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={folderSync} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Select Frequency</p>
          </div>
        </div>
        <div className="flex justify-center ">
          <p className="text-white tracking-wider text-xs">Processing</p>
        </div>
      </div>

      <div className="flex flex-col max-w-[8vw] gap-5">
        <div className="flex gap-10 px-10 border-r-2">
          <div className="gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all" onClick={showFFTModal}>
            <img src={nav7} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Show TWF/FFT</p>
          </div>
        </div>
        <div className="flex justify-center">
          <p className="text-white tracking-wider text-xs">Signals</p>
        </div>
      </div>

      <div className="flex flex-col max-w-[20vw] gap-5">
        <div className="flex gap-10 px-10 border-r-2">
          <div className="gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={nav6} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Increase</p>
          </div>
          <div className="gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={decrease} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Decrease</p>
          </div>
        </div>
        <div className="flex justify-center">
          <p className="text-white tracking-wider text-xs">Amplification</p>
        </div>
      </div>

      <div className="flex flex-col max-w-[25vw] gap-5">
        <div className="flex gap-10 px-10 border-r-2">
          <div className="gradient-border flex flex-col justify-between min-w-[4.5rem] max-w-[4.5em] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={nav4} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">
              Play Phase Simulation
            </p>
          </div>
          <div className="gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={nav3} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Stop</p>
          </div>
          <div className=" gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={nav2} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Create Video</p>
          </div>
          <div className="gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={record} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Record</p>
          </div>
        </div>
        <div className="flex justify-center">
          <p className="text-white tracking-wider text-xs">Phase Simulation</p>
        </div>
      </div>

      <div className="flex flex-col max-w-[8vw] gap-5" onClick={showModal1}>
        <div className="flex gap-10 px-10 border-r-2">
          <div className="gradient-border flex flex-col justify-between max-w-[3rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={nav1} alt="" className="h-6 w-auto" />
            <p className="text-xs text-white text-center">Settings</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col max-w-[10vw]">
        <div className="flex border-r-2">
          <div className="flex flex-col justify-between min-w-[10rem] max-w-[10rem] min-h-[8vh] max-h-[8vh] hover:scale-110 transition-all">
            <img src={chatbot} alt="" className="h-8 w-auto" />
            <p className="text-xs text-white text-center">Need Assistant ?</p>
          </div>
        </div>
      </div>

      <Modal
        title=""
        styles={{
          header: { backgroundColor: "#343434", color: "white" }, // changes the color of the "Modal's title"
          body: { backgroundColor: "#343434" }, // changes the background of the "Modal's body"
          content: { backgroundColor: "#343434" }, // turns the "Modal's body" to red
        }}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="back"
            onClick={handleCancel}
            style={{
              backgroundColor: "#343434",
              borderColor: "white",
              color: "white",
            }}
          >
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
            style={{ backgroundColor: "#c95a18", borderColor: "#c95a18" }}
          >
            Submit
          </Button>,
        ]}
      >
        <p className="mb-4">Frame Rate</p>
        <p>Set Frame Rate:</p>
        <InputNumber
          min={1}
          max={10}
          defaultValue={1}
          onChange={(value: number | null) => setCounter(value || 1)}
        />
      </Modal>
      <Modal
        title="Settings"
        visible={visible1}
        onOk={handleOk1}
        onCancel={handleCancel1}
        footer={[
          <Button key="back" onClick={handleCancel1}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk1}
            style={{ backgroundColor: "orange", borderColor: "orange" }}
          >
            Apply
          </Button>,
        ]}
      >
        <p>Amplification Factor:</p>
        <Slider min={1} max={10} defaultValue={1} onChange={setAmplification} />
        <p>Motion Blur:</p>
        <Switch checked={motionBlur} onChange={setMotionBlur} />
        <p>Video Type:</p>
        <Select
          defaultValue={videoType}
          style={{ width: 120 }}
          onChange={setVideoType}
        >
          <Option value="mp4">MP4</Option>
          <Option value="avi">AVI</Option>
          <Option value="mov">MOV</Option>
        </Select>
        <p>Video Size:</p>
        <Select
          defaultValue={videoSize}
          style={{ width: 120 }}
          onChange={setVideoSize}
        >
          <Option value="720p">720p</Option>
          <Option value="1080p">1080p</Option>
          <Option value="4k">4K</Option>
        </Select>
      </Modal>
      <Modal
        title="FFT and TWF Graphs"
        open={fftvisible}
        onOk={handleFFTOk}
        onCancel={handleFFTCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div className="flex flex-col">
          <div className="w-1/2">
            <p className="text-white tracking-wider text-xs">FFT Graph</p>
            <Plot
              data={[
                {
                  x: data.fftData.map((d) => d.x),
                  y: data.fftData.map((d) => d.y),
                  type: "scatter",
                  mode: "lines",
                  marker: { color: "blue" },
                },
              ]}
              layout={{
                width: 400,
                height: 400,
                title: "FFT Graph",
                xaxis: { title: "Time" },
                yaxis: { title: "Amplitude" },
              }}
            />
          </div>
          <div className="w-1/2">
            <p className="text-white tracking-wider text-xs">TWF Graph</p>
            <Plot
              data={[
                {
                  x: data.twfData.map((d) => d.x),
                  y: data.twfData.map((d) => d.y),
                  type: "scatter",
                  mode: "lines",
                  marker: { color: "red" },
                },
              ]}
              layout={{
                width: 400,
                height: 400,
                title: "TWF Graph",
                xaxis: { title: "Time" },
                yaxis: { title: "Amplitude" },
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Topbar;
