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
      image: machineImage,
      status: "Online",
      location: "Location 1",
      lastUpdated: "1 minute ago",
    },
    {
      id: 2,
      name: "Lathe Machine",
      image: machineImage,
      status: "Offline",
      location: "Location 2",
      lastUpdated: "2 minutes ago",
    },
    {
      id: 3,
      name: "Stirring Machine",
      image: machineImage,
      status: "Online",
      location: "Location 3",
      lastUpdated: "3 minutes ago",
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // To store the image

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
        setMachines([
          ...machines,
          { ...values, image: uploadedImage || machineImage }, // Include image
        ]);
        setIsModalVisible(false);
        setUploadedImage(null); // Reset image state
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string); // Store image (e.g., as a Base64 data URL)
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleNavigate = () => {
    navigate("/d");
  };

  return (
    <div className="min-h-[100vh] min-w-[100vw] max-w-[100vw] overflow-hidden bg-[#1f1f1f]">
      <div className="pt-8 flex flex-col justify-center items-center">
        <img src={mavLogo} className="h-[4rem]" />
        <div className="mt-3">
          <p
            className="dm-sans text-[2rem] font-semibold"
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
          <div
            className="pb-8 min-h-[30vh] min-w-[20vw] max-w-[20vw] border-2 border-white rounded-xl"
            onClick={handleNavigate}
          >
            <div className="max-h-[25vh] overflow-hidden rounded-xl">
            <img className="w-[100%] h-auto" src={machine.image} alt={machine.name} />
            </div>
            <div className="flex justify-center mt-3 text-white text-[1.2rem]">
              <p>{machine.name}</p>
            </div>
            <div className="mt-6 text-white flex flex-col justify-center items-center gap-4 text-[0.8rem]">
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
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            style={{ backgroundColor: "orange", borderColor: "orange" }}
          >
            Apply
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="image"
            label="Machine Image"
            rules={[
              { required: true, message: "Please upload a machine image" },
            ]}
          >
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Item>
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
