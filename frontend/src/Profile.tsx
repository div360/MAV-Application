import React from "react";
import mavLogo from "./assets/mav-logo.svg";
import machineImage from "./assets/machine.png";
import { IoAdd } from "react-icons/io5";

const Profile = () => {
  const machines = [
    {
      id: 1,
      name: "CNC Machine",
      image: "machine1.png",
      status: "Online",
      location: "Location 1",
      lastUpdated: "1 minute ago",
    },
    {
      id: 2,
      name: "Lathe Machine",
      image: "machine2.png",
      status: "Offline",
      location: "Location 2",
      lastUpdated: "2 minutes ago",
    },
    {
      id: 3,
      name: "Stirring Machine",
      image: "machine3.png",
      status: "Online",
      location: "Location 3",
      lastUpdated: "3 minutes ago",
    },
  ];

  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-[#1f1f1f]">
      <div className="pt-8 flex flex-col justify-center items-center">
        <img src={mavLogo} className="max-h-[14vh]" />
        <div className="mt-3">
          <p
            className="dm-sans text-[2.8rem] font-semibold"
            style={{
              background: "linear-gradient(0deg, #FC575E 13.61%, #F7B42C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Select Your Machine
          </p>
        </div>
      </div>
      <div className="mx-8 pt-8 flex gap-[5vw]">
        {machines.map((machine) => (
          <div className="min-h-[62vh] min-w-[20vw] max-w-[20vw] border-2 border-white rounded-xl">
            <img className="w-[100%] " src={machineImage} alt="" />
            <div className="flex justify-center mt-3 text-white text-[1.5rem]">
              <p>{machine.name}</p>
            </div>
            <div className="mt-6 text-[1rem] font-semibold text-white flex flex-col justify-center items-center gap-4">
                <button className="p-3 bg-[#fe4900] rounded-lg w-[60%]">See Machine Info</button>
                <button className="p-3 bg-[#fe4900] rounded-lg w-[60%]">Recent FFTs and TWFs</button>
                <button className="p-3 bg-[#fe4900] rounded-lg w-[60%]">Add New Analysis</button>
            </div>
          </div>
        ))}

        <div className="min-h-[60vh] min-w-[20vw] max-w-[20vw] border-2 border-white rounded-xl flex justify-center items-center cursor-pointer">
          <IoAdd color="white" size={130} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
