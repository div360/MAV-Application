import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mavLogo from "../assets/mav-logo.svg";
import { Spin } from "antd";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/profile");
    }, 3000);
  };

  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-[#1f1f1f] ">
      <div className="pt-8 flex flex-col justify-center items-center">
        <img src={mavLogo} className="max-h-[14vh]" />
        <div className="border-2 flex flex-col p-10 mt-10 rounded-xl justify-center items-center">
          <div className="mt-3">
            <p
              className="dm-sans text-[2.8rem] font-semibold"
              style={{
                background:
                  "linear-gradient(0deg, #FC575E 13.61%, #F7B42C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Login
            </p>
          </div>
          <div className="mt-6 text-[1rem] font-semibold text-white flex flex-col justify-center items-center gap-4">
            <input
              className="p-3 bg-[#fe4900] rounded-lg w-[80%]"
              type="text"
              placeholder="Username"
            />
            <input
              className="p-3 bg-[#fe4900] rounded-lg w-[80%]"
              type="password"
              placeholder="Password"
            />
            <button
              className="p-3 bg-[#fe4900] rounded-lg w-[80%]"
              onClick={handleLogin}
            >
              {loading ? <Spin style={{ color: "white" }} /> : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
