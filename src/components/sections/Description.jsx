import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path as necessary

// Styling remains the same as in your provided code...

const Description = () => {
  const navigate = useNavigate();
  const {state}=useLocation();

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className=""
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#0b0c10",

      }}
    >
      <div
        style={{
          height: 900,
          zIndex: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="login-bg w-[60%] left-[20%]  " >
          <div className="flex flex-col md:flex-col justify-center w-[100%] pl-10 pr-10 pt-10">
            <div className="bigText text-center">
              What description suits you best ?
            </div>
            <div className="flex flex-col justify-center items-center w-[100%] md:w-[100%] p-[20px]">
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
          className={`flex rounded-md  cursor-pointer z-20 mx-9 bg-gradient-to-tr from-blue-500 to-pink-500 p-1 shadow-lg ${selectedOption === option ? "active" : ""}`}
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
    </form>
              {/* <div onClick={()=>{navigate('/otp',{state})}} className="flex flex-row justify-end items-center w-[90%] mt-10">
                  <div className="next-gradient-text p-1">Next</div>
                  <div>
                    <img style={{width:70}} src="/assets/images/Arrow 1.png" />
                  </div>
                </div> */}
                              <div onClick={()=>{window.location.href = "/avatar-creation"}} className="flex flex-row justify-end items-center w-[90%] mt-10">
                  <div className="next-gradient-text cursor-pointer p-1">Let's Start Creating Some Avatars</div>
                  <div>

                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
