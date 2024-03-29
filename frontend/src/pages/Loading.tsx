import React from "react";
import { useEffect, useState } from "react";
import mav from "../assets/mav.svg";
import "./styles.css"

const Loading = () => {

    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     setLoading(false);
    //   }, 5000); // Example loading time, adjust as needed
  
    //   return () => clearTimeout(timer);
    // }, []);

  return (
    <div className="flex flex-col gap-20 justify-center items-center h-[100vh] w-[100vw] bg-[#1f1f1f]">
      <img src={mav} className="h-[25vh]" />
      {loading && (
        <div className="min-w-[20vw] min-h-[0.5vh] max-h-[0.5vh] flex justify-center items-center bg-[#3c1b0e]">
            <div className="min-h-[0.6vh] max-h-[0.6vh]  min-w-[10vw] bg-[#fa764d] animate-bar"></div>
        </div>
      )}
    </div>
  );
};

export default Loading;
