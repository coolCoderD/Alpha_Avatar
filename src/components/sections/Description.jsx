import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path as necessary
import Header from "../layout/Header";
import Header2 from "../layout/Header2";

// Styling remains the same as in your provided code...

const Description = () => {
  const navigate = useNavigate();
  const {state}=useLocation();

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
    <Header2/>
    <div className=""
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#0b0c10",
     
      }}
    >
      <div
  
        style={{
      
          zIndex: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="login-bg  w-[60%]   " >
          <div className="flex flex-col md:flex-col justify-center w-[100%] md:pl-10 pr-14 pr-10 pt-10">
            <div className="bigText pl-9 text-center mb-4 ">
              What description suits you best ?
            </div>
            <div className="grid grid-cols-1 px-auto place-items-center ">
            <form className="flex flex-col gap-3 w-[100%] md:w-[75%]">
      {[
        "Corporate Gifting",
        "Personal Gifting",
        "Gaming Avatar",
        "I’m creating just for fun!",
        "School And Education"
      ].map((option) => (
        <div
          key={option}
          className={`flex rounded-md w-full cursor-pointer z-20 mx-9 bg-gradient-to-tr from-blue-500 to-pink-500 p-1 shadow-lg ${selectedOption === option ? "active" : ""}`}
          style={{
            padding: 2,
            border: selectedOption === option ? "2px solid #6a5acd" : "none",
          }}
          onClick={() => handleOptionSelect(option)}
        >
          <div
            className={`flex-1 font-bold text-xl  px-6 py-3 rounded-md ${
              selectedOption === option ? "bg-[#7186FF] text-white" : "bg-[#41324c]"
            }`}
          >
            {option}
          </div>
        </div>
      ))}
      <div className="flex flex-row justify-center items-center cursor-pointer ml-9">
                  <div onClick={()=>{window.location.href = "/avatar-creation"}} className="flex download-img-btn rounded-lg flex-row justify-center items-center w-[90%] mt-10">
                  <div className="text-2xl font-semibold  cursor-pointer p-1">Let's Start Creating Some Avatars</div>
                  <div>

                  </div>
                </div>
                </div>
    </form>
              {/* <div onClick={()=>{navigate('/otp',{state})}} className="flex flex-row justify-end items-center w-[90%] mt-10">
                  <div className="next-gradient-text p-1">Next</div>
                  <div>
                    <img style={{width:70}} src="/assets/images/Arrow 1.png" />
                  </div>
                </div> */}
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Description;
