import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mavLogo from "../assets/mav-logo.svg";
import machineImage from "../assets/machine.png";
import { Modal, Form, Input, Button } from "antd";
import { IoAdd } from "react-icons/io5";

const Profile = () => {
  const [machines, setMachines] = useState([
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
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        setMachines([...machines, values]);
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleNavigate = () => {
    navigate("/d");
  }

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
      <div className="mx-8 pt-8 flex gap-[5vw] flex-wrap">
        {machines.map((machine) => (
          <div className="pb-8 min-h-[62vh] min-w-[20vw] max-w-[20vw] border-2 border-white rounded-xl" onClick={handleNavigate}>
            <img className="w-[100%] " src={machineImage} alt="" />
            <div className="flex justify-center mt-3 text-white text-[1.5rem]">
              <p>{machine.name}</p>
            </div>
            <div className="mt-6 text-[1rem] font-semibold text-white flex flex-col justify-center items-center gap-4">
              <button className="p-3 bg-[#fe4900] rounded-lg w-[60%]">
                See Machine Info
              </button>
              <button className="p-3 bg-[#fe4900] rounded-lg w-[60%]">
                Recent FFTs and TWFs
              </button>
              <button className="p-3 bg-[#fe4900] rounded-lg w-[60%]">
                Add New Analysis
              </button>
            </div>
          </div>
        ))}

        <div
          className="min-h-[60vh] min-w-[20vw] max-w-[20vw] border-2 border-white rounded-xl flex justify-center items-center cursor-pointer"
          onClick={showModal}
        >
          <IoAdd color="white" size={130} />
        </div>
      </div>
      <Modal
        title="Add Machine"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} style={{backgroundColor: 'orange', borderColor: 'orange'}}>
            Apply
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="name"
            label="Machine Name"
            rules={[
              {
                required: true,
                message: "Please input the name of the machine!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
