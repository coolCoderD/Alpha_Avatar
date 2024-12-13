import React,{useDebugValue, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { 
  auth, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  collection, 
  setDoc,doc,db
} from "../../firebase";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


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



const AccountVerification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
console.log(state,"state")
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState(""); // Temporary password for registration
  const [confirmPassword, setConfirmPassword] = useState(""); // Temporary password for registration
const [showPass,setShowPass]=useState(false)
const [showConfPass,setShowConfPass]=useState(false);
const[success,setSuccess]=useState("");
const[loading,setLoading]=useState(false);

  const [error, setError] = useState("");
const[errors,setErrors]=useState({})

  const validateForm = () => {
    const errors = {};

    console.log("in here")

    // Password validation
    if (!password) {
      errors.password = "Password is required.";
    }
    else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    } else if(password !== confirmPassword){
      errors.password = "Passwords do not match";


    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  console.log(errors?.password,"errors")
  const handleRegisterUser = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setError("Please fill in all required fields correctly.");
      return;
    }
    setLoading(true);
    try {
      // Attempt to create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        state?.email,
        password
      );
      const user = userCredential.user;
  
      // Send verification email
      await sendEmailVerification(user);
  
      // Construct user data
      const userData = {
        uid: user.uid,
        email: user.email,
        firstName: state?.firstName,
        lastName: state?.lastName,
        phoneNumber: state?.countryCode + state?.mobile,
        createdAt: new Date(),
        password:password,
        emailVerified: false,
        freeAvatarCount: 3,
      };


  
      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), userData);


      const enhancedUser = {
        ...userData,
        freeAvatarCount:3, // Use the fetched or default value
        displayName: `${state?.firstName} ${state?.lastName}`,
      };
  
      // Save user data to local storage
      localStorage.setItem("user", JSON.stringify(enhancedUser));
  
      console.log("User registered successfully.");
      setLoading(false);
      setSuccess("Registration successful! Please verify your email.");
      setTimeout(() => {
        navigate("/description", { state });
      }, 1500);
    } catch (error) {
      setLoading(false);
      // Handle specific Firebase errors
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Please log in instead.");
          break;
        case "auth/weak-password":
          setError("The password is too weak. Please use at least 6 characters.");
          break;
        case "auth/invalid-email":
          setError("The email address is not valid.");
          break;
        default:
          setError("An unexpected error occurred. Please try again later.");
          console.log(error.code);
      }
  
      console.error("Error registering user:", error);
    }
  };
  
  
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#0b0c10",
        height: "100%",
      }}
    >
      <div style={{ zIndex: 0 }}>
        <div className="login-bg">
          <div className="login-gradient-text flex justify-center items-center h-[80px]">
            Sign in
          </div>

          <div className="flex flex-col md:flex-row ">
          <div
              className="flex justify-center items-center w-[100%] md:w-[50%] p-[20px]"
            >
              <img src="/assets/images/Layer_1_color.png" />
            </div>
            <div className="flex justify-center items-center w-[100%] md:w-[50%] p-[20px]">
              <div className="flex flex-col w-[60%] gap-4">
                <div>
                  <div
                    className=" w-[100%] bigText"
                    style={{ textAlign: "left" }}
                  >
                    Account security
                  </div>
                  <div
                    className="small-dmsans  w-[100%] text-left"
                    style={{ textAlign: "left" }}
                  >
                    Create a password to secure your account.
                  </div>
                </div>
                {errors && <div style={{ color: "red", marginBottom: "10px" }}>{errors?.password}</div>}
                <div class="gradient-border w-[100%]">
                  <input
                    type={showPass? "text":"password"}
                    class="styled-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                                                    {errors.password && <div style={{ color: "red" }}>{errors.lastName}</div>}
<div onClick={()=>{setShowPass(!showPass)}}>
{
  !showPass? (
    <div className="absolute top-[8px] w-20px h-20px right-[8px] z-50 ">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
    </div>
  ) : (
    <div className="absolute top-[8px] w-20px h-20px right-[8px] z-50 ">
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
    </div>
  )
}


</div>
                
                </div>

                <div class="gradient-border">
                  <input
                    type={showConfPass? "text":"password"}
                    class="styled-input"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
              <div onClick={()=>{setShowConfPass(!showConfPass)}}>
              {
  !showConfPass? (
    <div className="absolute top-[8px] w-20px h-20px right-[8px] z-50 ">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
    </div>
  ) : (
    <div className="absolute top-[8px] w-20px h-20px right-[8px] z-50 ">
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
    </div>
  )
}

</div>
                </div>
                <div className="flex  flex-row justify-between gap-4 w-[100%]">
                  <div className="gradient-border w-[100%]">
                    <button
                    disabled={loading}
                      onClick={(e) => {
                        handleRegisterUser(e)
                      }}
                      className={`styled-button  ${loading ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {error && (
  <div className="absolute top-60 alert alert-danger">
    {error}
  </div>
)}
{success && (
  <div className="alert alert-success">
    {success}
  </div>
)}

    </div>
  );
};

export default AccountVerification;
