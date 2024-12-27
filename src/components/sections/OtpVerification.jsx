import React,{useEffect,useState} from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { db,doc,setDoc,auth } from "../../firebase"; // 
import {getAuth,fetchSignInMethodsForEmail,RecaptchaVerifier,signInWithPhoneNumber} from '../../firebase'
import Header2 from "../layout/Header2";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #141e30, #243b55);
  border: 4px solid;

  border-image-source: linear-gradient(180deg, #7186ff 0%, #f97689 100%);
`;

const Card = styled.div`
  width: 400px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.4);
  color: #ffffff;
`;

const Logo = styled.h1`
  font-family: "Brush Script MT", cursive;
  font-size: 60px;
  text-align: center;
  color: #d18ce0;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 2px solid transparent; /* Base border */
  border-radius: 8px; /* Rounded corners */
  background: linear-gradient(#2a2a3d, #2a2a3d),
    linear-gradient(90deg, #7186ff, #f97689); /* Gradient border */
  background-origin: border-box; /* Ensure the background is properly aligned */
  background-clip: padding-box, border-box; /* Ensure the border gradient is visible */
  color: white;
  font-size: 14px;
  font-weight: 500;

  &:focus {
    outline: none;
    background: linear-gradient(#3a3a52, #3a3a52),
      linear-gradient(90deg, #7186ff, #f97689); /* Focused gradient */
    box-shadow: 0px 0px 5px rgba(113, 134, 255, 0.4); /* Add subtle glow on focus */
  }

  &::placeholder {
    color: #a5a5b5; /* Subtle placeholder color */
    font-size: 14px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  margin: 15px 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #8743ff, #4136f1);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #9c59ff, #5553f6);
  }
`;

const Divider = styled.div`
  text-align: center;

  position: relative;
  color: #a5a5b5;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background: #a5a5b5;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const OAuthButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  color: #333;
  font-size: 14px;
  height: 35px;
  width: 250px;
  border-radius: 14px;
  &:hover {
    background: #f1f1f1;
  }

  img {
    width: 18px;

    margin-right: 10px;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-top: 15px;
  font-size: 14px;
  color: #a5a5b5;

  input {
    margin-right: 10px;
    width: 16px;
    height: 16px;
  }
`;

const OtpVerification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [firstName, setFirstName] = useState(state?.firstName || "");
  const [lastName, setLastName] = useState(state?.lastName || "");
  const [email, setEmail] = useState(state?.email || "");
  const [mobile, setMobile] = useState(state?.mobile || "");
  const [phoneNumber, setPhoneNumber] = useState(state?.mobile || "");
  const [countryCode, setCountryCode] = useState(state?.countryCode || "");

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);


  useEffect(() => {
    if (state?.mobile) {
     verifyPhoneNumber(state?.mobile)
    }
  }, []); // Send OTP when the component mounts and phoneNumber is available



    // Timer logic
    useEffect(() => {
      let timerInterval;
  
      if (timeLeft > 0) {
        timerInterval = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      } else {
        setIsResending(false); // Enable the Resend OTP button when timer reaches 0
        clearInterval(timerInterval);
      }
  
      // Cleanup interval on unmount
      return () => clearInterval(timerInterval);
    }, [timeLeft]);

  const verifyPhoneNumber = async (phoneNumber) => {
    try {
      console.log(window.recaptchaVerifier,"here")

      // Step 1: Set up the Recaptcha verifier
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
            console.log('recaptcha resolved..')
        }
    });

      // Step 2: Trigger OTP
      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(auth, countryCode + phoneNumber, appVerifier);
      // Step 3: Ask for OTP input from the user
      
  console.log(confirmationResult,"confirm")
  setConfirmationResult(confirmationResult)
      // Continue your workflow here, like storing user details in Firestore
    } catch (error) {
      console.error("Error during phone number verification:", error);
      alert("OTP verification failed. Please try again.");
    } 
  };
  const handleVerifyOtp = async () => {
    try {
      const fullOtp = otp.join("");
      if (!confirmationResult) {
        setMessage("No confirmation result available. Please resend OTP.");
        return;
      }

      setMessage("Verifying OTP...");

      const userCredential = await confirmationResult.confirm(fullOtp);
      console.log("User signed in successfully:", userCredential.user);

      // Store user details in Firestore
      const userDoc = doc(db, "users", userCredential.user.uid);
      await setDoc(userDoc, {
        phoneNumber,
        ...state.userDetails, // Add any additional user details passed in the state
        uid: userCredential.user.uid,
      });

      setMessage("OTP verified successfully. Redirecting...");

      // Navigate to the next page
      navigate("/account-verification", {
        state: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobile: mobile,
          countryCode: countryCode,
        },
      });
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      setMessage("Invalid OTP. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };


  const resendOTP = () => {
    setIsResending(true); // Disable button while resending OTP
    setTimeLeft(30); // Reset the timer to 30 seconds

    // Simulate OTP resend action
    verifyPhoneNumber();
  };

  return (
    <>
    <Header2/>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#0b0c10",
        height: "100%",
      }}
    >
      <div style={{zIndex: 0 }}>
        <div className="login-bg">
          <div className="login-gradient-text flex justify-center items-center h-[80px]">
            Sign in
          </div>



          <div className="flex flex-col justify-center items-center md:flex-row ">
          <div
              className="flex justify-center items-center w-[100%] md:w-[30%] p-[10px]"
            >
              <img src="/assets/images/Layer_1_color.png" />
            </div>
            <div className="flex flex-col justify-center  items-center w-[100%] md:w-[50%] p-[20px]">
              <div className=" w-[[100%] md:w-[70%]">
              <div className=" w-[100%] bigText  md:text-left mt-10">
                OTP Verification
              </div>
              <div className="flex flex-col xl:flex-row gap-12 mt-2 mb-6">
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            readOnly
            className="styled-input"
          />
      <button
        onClick={resendOTP}
        disabled={isResending || timeLeft > 0}
        className="styled-button gradient-border-otp"
      >
        {timeLeft > 0 ? `Resend OTP in ${formatTime(timeLeft)}` : "Resend OTP"}
      </button>

          <div id="recaptcha-container"></div>
        </div>
        <div className="text-[13px] ">
  Enter the six-digit code sent to your email  and mobile number.
</div>
              <div className="flex flex-nowrap gap-2 mt-10 justify-center md:justify-start w-full">
  {[...Array(6)].map((_, index) => (
    <div key={index} className="gradient-border-otp ">
<input
  id={`otp-input-${index}`}
  type="text"
  maxLength={1}
  inputMode="numeric" // Ensures numeric keyboard is shown
  pattern="[0-9]*"    // Ensures it only accepts numbers
  className="styled-input text-center"
  style={{ width: 50, height: 50 }}
  value={otp[index]}
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) { // Only allow 0-9 and a single character
      handleChange(value, index);

      // Auto-focus to the next input if a digit is entered
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Backspace" && !otp[index]) {
      // Handle backspace navigation
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  }}
/>

    </div>
  ))}
</div>

              <div className="flex flex-row text-center md:text-left w-[100%]">
              {/* <div className="small-dmsans w-[100%] mt-1" style={{ fontSize: 13 }}>
  Code will expire in {formatTime(timeLeft)}
</div> */}

              </div>
<div className="flex ">

<div className="gradient-border  w-[60%] mt-10">
                <button
onClick={()=>{handleVerifyOtp()}}
                  className="flex-1 z-50 font-bold text-xl bg-[#7186FF] px-6 py-1 w-full rounded-md"
                >
                  Verify
                </button>
              </div>
</div>
{message && <div style={{ marginTop: "10px", color: "red" }}>{message}</div>}
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </div>
    </>
  );
};

export default OtpVerification;
