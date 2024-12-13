import React ,{useState}from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  auth,
  signInWithEmailAndPassword,
  db,
  setDoc,
  doc,
  getDoc,provider, signInWithPopup
} from "../../firebase.js"; // Adjust the path as needed

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from "@mui/material/Snackbar";

import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
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
  margin: 2px 0;
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

const Login = () => {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message state
  const [activeButton, setActiveButton] = useState("login");



  const handleButtonClick = (button) => {
    setActiveButton(button);
    console.log('login is active')
    if (button === "login") {
      signIn();
    } else if (button === "signIn") {
      navigate("/sign-in");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [loginDetails, setLoginDetails] = useState([
    {
      email: "",

      password: "",
    },
  ]);
  const [showPassword, setShowPassword] = useState(false);

  const [showAlert, setShowAlert] = useState({ type: "", message: "" });

  const [errors, setErrors] = useState({
    email: "",

    password: "",
  });const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if user exists in Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      let freeAvatarCount = 3; // Default value if user doesn't exist
  
      if (!docSnap.exists()) {
        // Save user details to Firestore if not exists
        await setDoc(docRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          signInMethod: "Google",
          freeAvatarCount, // Set the initial count
        });
        console.log("User added to Firestore");
      } else {
        // Fetch the existing user's freeAvatarCount
        const userData = docSnap.data();
        freeAvatarCount = userData.freeAvatarCount || 0; // Fallback to default if undefined
        console.log("User already exists in Firestore with freeAvatarCount:", freeAvatarCount);
      }
  
      // Add freeAvatarCount to the user object
      const enhancedUser = {
        ...user,
        freeAvatarCount, // Use the fetched or default value
      };
  
      // Save the enhanced user object to localStorage
      localStorage.setItem("user", JSON.stringify(enhancedUser));
  
      setTimeout(() => {
        window.location.href = "/avatar-creation";
      }, 1500);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };
  
  

  const signIn = async () => {
    if (!validateForm()) {
      setShowAlert({ type: "error", message: "All fields are required" });
      return;
    }
  
    try {
      setOpen(true); // Start loading spinner
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginDetails.email,
        loginDetails.password
      );
      const user = userCredential.user;
      console.log("Logged in user:", user);
  
      // Retrieve user details from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("User data:", userData);
  
        // Store in localStorage or state as needed
        localStorage.setItem("user", JSON.stringify(userData));
  
        setTimeout(() => {
          window.location.href = "/avatar-creation";
        }, 1500);
      } else {
        console.error("No such user in Firestore!");
      }
    } catch (error) {
      setSnackbarMessage("Invalid email or password");
      setSnackbarOpen(true);
      console.error("Error logging in:", error);
    } finally {
      setOpen(false); // Ensure loading spinner is closed
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const validateForm = () => {
    const { email, password } = loginDetails;
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Validate Email
    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email format is invalid.";
      valid = false;
    }

    // Validate Password
    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password should be at least 6 characters.";
      valid = false;
     }
     //else {
    //   // Strong password regex: At least 1 uppercase, 1 lowercase, 1 number, and 1 special character
    //   const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //   if (!strongPasswordRegex.test(password)) {
    //     newErrors.password =
    //       "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    //     valid = false;
    //   }
    // }

    // Set Errors in State
    setErrors(newErrors);

    return valid;
  };

  console.log(errors,"errors")
  // Handle Snackbar close
const handleSnackbarClose = (event, reason) => {
  if (reason === "clickaway") {
    return;
  }
  setSnackbarOpen(false);
};
  return (
    <div className="">
    <div
      className="flex  justify-center "
    >
        <Backdrop
        sx={(theme) => ({ color: '#000', zIndex: theme.zIndex.drawer + 1 })}

  open={open}
  onClick={handleClose}
>
  <Stack alignItems="center">
  <CircularProgress sx={{color:'#FFF'}}/>
  <Typography variant="mont16Bold" sx={{color:'white',marginTop:2,fontSize:20}}>
    Logging in .....
  </Typography>
  </Stack>
 
</Backdrop>
<Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      <div style={{   height: '100%', zIndex: 1 ,}}>
        <div className="login-bg ">
        <div className="login-gradient-text flex justify-center items-center h-[80px] " >
                Login
            </div>
          {/* <div className="login-border " ></div> */}
          <div className="flex flex-col md:flex-row ">
            <div
              className="flex justify-center items-center w-[100%] md:w-[50%] p-[20px]"
            >
              <img src="/assets/images/Layer_1_color.png" />
            </div>
            <div
              className="flex flex-col justify-center items-center w-[100%] md:w-[50%] p-[20px] gap-2"
            >
              <OAuthButton onClick={handleGoogleSignIn}>
                <img src="/assets/images/image 12.png" alt="Google Logo" />
                Sign in with Google
              </OAuthButton>
              <hr/>
                
           <div>
            or
            </div>
              <div className="flex flex-col gap-3 w-[75%]">
                <div class="gradient-border">
                  <input
                    type="email"
                    class="styled-input"
                    placeholder="Enter Email ID"
                    name="email"
                    onChange={handleInputChange}
                    error={errors?.email}
                    helperText={errors?.email}
                  />
                </div>
                {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}

                <div class="gradient-border">
                  <input
                    class="styled-input"
                    placeholder="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
        
                    onChange={handleInputChange}
                    error={errors.password}
                    helperText={errors?.password}
                  />
                  <div onClick={()=>{
                    setShowPassword(!showPassword)
                  }}>

              
{
  !showPassword ? (
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
                {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}

                <div className="flex flex-row justify-between gap-4 w-[100%]">
      <div
        className={`gradient-border w-[80%] ${
          activeButton === "login" ? "bg-[#7186FF]" : ""
        }`}
      >
        <button
          onClick={() => handleButtonClick("login")}
          className={`styled-button-login hover:bg-black ${
            activeButton === "login" ? "text-white" : ""
          }`}
        >
          Sign in 
        </button>
      </div>
      <div
        className={`gradient-border w-[80%] ${
          activeButton === "signIn" ? "bg-[#7186FF]" : ""
        }`}
      >
        <button
          onClick={() => handleButtonClick("signIn")}
          className={`styled-button ${
            activeButton === "signIn" ? "text-white" : ""
          }`}
        >
          Sign up
        </button>
      </div>
    </div>
              </div>

              <div className="small-dmsans text-[16px] text-opacity-50 text-left w-[75%] pt-2">
                Don't remember password ?
              </div>
            </div>
          </div>
          {/* <div className="login-border " style={{ marginTop: 40 }}></div> */}

        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
