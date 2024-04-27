import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import frontImage from "../assets/frontImage.png";
import mavLogo from "../assets/mav-logo.svg";
import { Input } from "antd";
import { Button, Spin } from "antd";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [loginToggle, setLoginToggle] = useState(true);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/profile");
    }, 3000);
  };

  const handleLoginToggle = () => {
    setLoginToggle(!loginToggle);
  };

  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-[#1f1f1f] grid grid-cols-2 ">
      <div>
        <img src={frontImage} alt="" className="h-[100vh]" />
      </div>
      <div className="flex flex-col items-center">
        <img src={mavLogo} alt="" className="h-[5rem] mt-16" />
        <div className="bg-white rounded-xl mt-12 flex flex-col items-center px-10 pb-10 pt-3 gap-6">
          <div
            className={`rounded-full border-2 w-max border-orange-500 flex text-white text-sm`}
          >
            <div
              className={`m-1 p-2 rounded-full cursor-pointer ${
                loginToggle ? "bg-orange-500" : "text-black"
              } `}
              onClick={handleLoginToggle}
            >
              <p>Login</p>
            </div>
            <div
              className={`m-1 p-2 rounded-full cursor-pointer ${
                loginToggle ? " text-black" : "bg-orange-500"
              } `}
              onClick={handleLoginToggle}
            >
              <p>Register</p>
            </div>
          </div>
          <div>
            {loginToggle ? (
              <div className="flex flex-col gap-8">
                <div className="text-xs m">
                  <p>Username:</p>
                  <Input placeholder="Username" />
                </div>
                <div className="text-xs m">
                  <p>Password:</p>
                  <Input placeholder="Username" />
                </div>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleLogin}
                  style={{ backgroundColor: "#f97316", borderColor: "#f97316" }}
                >
                  {loading ? <div></div>: 'Submit'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="text-xs m">
                  <p>Username:</p>
                  <Input placeholder="Username" />
                </div>
                <div className="text-xs m">
                  <p>Company Name:</p>
                  <Input placeholder="Email" />
                </div>
                <div className="text-xs m">
                  <p>Email:</p>
                  <Input placeholder="Password" />
                </div>
                <div className="text-xs m">
                  <p>Password:</p>
                  <Input placeholder="Password" />
                </div>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleLogin}
                  style={{ backgroundColor: "#f97316", borderColor: "#f97316" }}
                >
                  {loading ? <div></div>: 'Submit'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
