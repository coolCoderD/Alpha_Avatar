import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,

  createUserWithEmailAndPassword,
  sendEmailVerification,
  collection,
  setDoc, doc, db,query, where,
  getDocs
} from "../../firebase";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from "@mui/material/Snackbar";
import { getAuth, fetchSignInMethodsForEmail, RecaptchaVerifier, signInWithPhoneNumber } from '../../firebase'
import Header2 from "../layout/Header2";

// Styling remains the same as in your provided code...

const SignIn = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState(""); // Temporary password for registration
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message state
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [selectedValue, setSelectedValue] = useState('+1')

  // // Initialize Recaptcha on Component Mount
  // useEffect(() => {
  //   if (!window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       "recaptcha-container",
  //       {
  //         size: "invisible",
  //         callback: (response) => {
  //           console.log("ReCAPTCHA solved:", response);
  //         },
  //         "expired-callback": () => {
  //           setError("ReCAPTCHA expired. Please try again.");
  //         },
  //       },
  //       auth
  //     );
  //   }
  // }, []);

  // const handleSendOtp = async (e) => {
  //   e.preventDefault();
  //   const fullPhoneNumber = `${phoneCode}${phoneNumber}`;
  //   if (!/^\+\d{10,15}$/.test(fullPhoneNumber)) {
  //     setError("Please enter a valid phone number.");
  //     return;
  //   }

  //   try {
  //     const confirmationResult = await signInWithPhoneNumber(
  //       auth,
  //       fullPhoneNumber,
  //       window.recaptchaVerifier
  //     );
  //     console.log("OTP sent!");
  //     window.confirmationResult = confirmationResult;
  //     setIsOtpSent(true);
  //   } catch (err) {
  //     setError(err.message || "Failed to send OTP. Please try again.");
  //   }
  // };

  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const result = await window.confirmationResult.confirm(verificationCode);
  //     console.log("User signed in successfully:", result.user);
  //     navigate("/dashboard"); // Adjust navigation as needed
  //   } catch (err) {
  //     setError(err.message || "Invalid OTP. Please try again.");
  //   }
  // };
  const verifyPhoneNumber = async (phoneNumber) => {
    try {
      console.log(window.recaptchaVerifier, "here")

      // Step 1: Set up the Recaptcha verifier
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('recaptcha resolved..')
        }
      });

      // Step 2: Trigger OTP
      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      // Step 3: Ask for OTP input from the user


      // Continue your workflow here, like storing user details in Firestore
    } catch (error) {
      console.log("Error during phone number verification:", error);
      alert("OTP verification failed. Please try again.");
    }
  };
  const validateForm = () => {
    const errors = {};

    // First name validation
    if (!firstName.trim()) {
      errors.firstName = "First name is required.";
    }

    // Last name validation
    if (!lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }

    // Mobile number validation based on selected country
    const countryMobileRegex = {
      "+1": /^[2-9]\d{9}$/, // USA and Canada: 10 digits, first digit can't be 0 or 1
      "+91": /^[6-9]\d{9}$/, // India: 10 digits, starts with 6-9
      "+44": /^7\d{9}$/, // UK: 10 digits, starts with 7
      "+61": /^4\d{8}$/, // Australia: 9 digits, starts with 4
      "+81": /^\d{10}$/, // Japan: 10 digits, no specific starting digit
      "+49": /^1[5-7]\d{8}$/, // Germany: 10 digits, starts with 15, 16, or 17
      "+33": /^6\d{8}|7\d{8}$/, // France: 9 digits, starts with 6 or 7
      "+39": /^3\d{9}$/, // Italy: 10 digits, starts with 3
      "+86": /^[1][3-9]\d{9}$/, // China: 11 digits, starts with 13-19
      "+55": /^[1-9]\d{10}$/, // Brazil: 11 digits, starts with 1-9
      "+7": /^[3479]\d{9}$/, // Russia: 10 digits, starts with 3, 4, 7, or 9
      "+27": /^[6-8]\d{8}$/, // South Africa: 9 digits, starts with 6-8
      "+34": /^[6-7]\d{8}$/, // Spain: 9 digits, starts with 6 or 7
      "+64": /^2\d{8,9}$/, // New Zealand: 9 or 10 digits, starts with 2
      "+32": /^[4]\d{8}$/, // Belgium: 9 digits, starts with 4
      "+20": /^[1]\d{9}$/, // Egypt: 10 digits, starts with 1
      "+82": /^[1]\d{9}$/, // South Korea: 10 digits, starts with 1
      "+60": /^[1-9]\d{7,9}$/, // Malaysia: 8-10 digits
      "+63": /^[9]\d{9}$/, // Philippines: 10 digits, starts with 9
      "+92": /^[3]\d{9}$/, // Pakistan: 10 digits, starts with 3
      "+62": /^[8]\d{9,10}$/, // Indonesia: 10-11 digits, starts with 8
      "+65": /^[89]\d{7}$/, // Singapore: 8 digits, starts with 8 or 9
      "+254": /^[17]\d{8}$/, // Kenya: 10 digits, starts with 1 or 7
      "+971": /^[5]\d{8}$/, // UAE: 9 digits, starts with 5
      "+974": /^\d{8}$/ // Qatar: 8 digits

    };
    
    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!selectedValue || !countryMobileRegex[selectedValue]?.test(mobile)) {
      errors.mobile = `Invalid mobile number for ${selectedValue}.`;
    }
    if(!selectedValue){
      errors.mobile = `Please select Country Code.`;

    }

    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!selectedValue || !countryMobileRegex[selectedValue]?.test(mobile)) {
      errors.mobile = `Invalid number as per the country code`;
    }

    // // Password validation
    // if (!password) {
    //   errors.password = "Password is required.";
    // } else if (password.length < 6) {
    //   errors.password = "Password must be at least 6 characters long.";
    // }

    setErrors(errors);
    setTimeout(() => setErrors(""), 3000);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterUser = async (e) => {
    console.log(mobile)
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Initialize Firebase Auth
    const auth = getAuth();

    try {
      // Check if email is already in use
      const signInMethods = await fetchSignInMethodsForEmail(auth, email.trim());
      console.log(signInMethods, "signInMethods")
      if (signInMethods.length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "This email is already in use. Please use a different email.",
        }));
        setLoading(false); // Reset loading if error occurs
        return;
      }

      const mobileQuery = query(
        collection(db, "users"),
        where("phoneNumber", "==", mobile.trim())
      );
      const mobileSnapshot = await getDocs(mobileQuery);
      console.log(mobileSnapshot.empty, "mobileSnapshot")


    if (!mobileSnapshot.empty) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "This mobile number is already in use. Please use a different number.",
      }));
      setLoading(false); // Reset loading if error occurs
      return;
    }

      // // Navigate to account verification page if the email is not in use
      navigate("/otp", {
        state: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobile: mobile,
          countryCode: selectedValue,
        },
      });
    } catch (error) {
      setLoading(false);
      console.error("Error checking email:", error);
      if (error.code === "auth/network-request-failed") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Network error. Please check your connection and try again.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "An error occurred while verifying the email. Please try again.",
        }));
      }

    }
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: "", // Clear the email error
    }));
    setLoading(false); // Reset loading state when user changes input
  };


  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
    <Header2/>
    <div style={{ display: "flex", justifyContent: "center", backgroundColor: "#0b0c10", height: "100%" }}>
      <div style={{ zIndex: 0 }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackbarOpen}
          autoHideDuration={1000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
        <div className="login-bg md:top-[15%]">
          <div id="recaptcha-container"></div>

          <div className="login-gradient-text flex justify-center items-center h-[80px]">Sign up as new user</div>
          <div className=""></div>
          <div className="flex flex-col md:flex-row">
            <div
              className="flex justify-center items-center w-[100%] md:w-[50%] p-[20px]"
            >
              <img src="/assets/images/Layer_1_color.png" />
            </div>
            <div className="flex justify-center items-center w-[100%] md:w-[50%] p-[20px]">

              <form className="flex flex-col gap-3 w-[75%]">
                {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
                <input
                  type="text"
                  className="styled-input"
                  placeholder="Enter First Name *"
                  value={firstName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z]*$/.test(value)) {
                      setFirstName(value);
                    }
                  }}
                  required
                />
                {errors.firstName && <div style={{ color: "red" }}>{errors.firstName}</div>}

                <input
                  type="text"
                  className="styled-input"
                  placeholder="Enter Last Name *"
                  value={lastName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z]*$/.test(value)) {
                      setLastName(value);
                    }
                  }}
                  required
                />

                {errors.lastName && <div style={{ color: "red" }}>{errors.lastName}</div>}

                <input
                  type="email"
                  className="styled-input"
                  placeholder="Enter Email ID *"
                  value={email}
                  onChange={handleEmailChange}
                  required

                />
                {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}

                <div className="dropdown-container">
                  {selectedValue === 'Select' && (
                    <div className="flex  absolute  ml-2 text-gray-400 justify-center items-center gap-2">

                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 33 21">
                        <path d="M16.5 20.121L0.879 4.5l2.121-2.121L16.5 15.879 29.879 2.5l2.121 2.121-15.5 15.5z" fill="#fff" />
                      </svg>
                    </div>

                  )}

                  <select className="styled-dropdown " value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}
                  >
 <option value="+1" className="text-black">US +1</option>
<option value="+91" className="text-black">IN +91</option>
<option value="+44" className="text-black">UK +44</option>
<option value="+61" className="text-black">AU +61</option>
<option value="+81" className="text-black">JP +81</option>
<option value="+49" className="text-black">DE +49</option>
<option value="+33" className="text-black">FR +33</option>
<option value="+39" className="text-black">IT +39</option>
<option value="+86" className="text-black">CN +86</option>
<option value="+55" className="text-black">BR +55</option>
<option value="+7" className="text-black">RU +7</option>
<option value="+27" className="text-black">ZA +27</option>
<option value="+34" className="text-black">ES +34</option>
<option value="+64" className="text-black">NZ +64</option>
<option value="+32" className="text-black">BE +32</option>
<option value="+20" className="text-black">EG +20</option>
<option value="+82" className="text-black">KR +82</option>
<option value="+60" className="text-black">MY +60</option>
<option value="+63" className="text-black">PH +63</option>
<option value="+92" className="text-black">PK +92</option>
<option value="+62" className="text-black">ID +62</option>
<option value="+65" className="text-black">SG +65</option>
<option value="+254" className="text-black">KE +254</option>
<option value="+971" className="text-black">AE +971</option>
<option value="+974" className="text-black">QA +974</option>


                  </select>
                  <input
                    type="tel"
                    className="styled-input"
                    placeholder="Mobile Number *"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 10) {
                        setMobile(value);
                      }
                    }}
                    maxLength={10} // Enforces max length in input field
                    required
                  />

                </div>
                {errors.mobile && <div style={{ color: "red" }}>{errors.mobile}</div>}



                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-row items-baseline gap-2 w-[100%]">
                    <div className="small-dmsans text-left pt-2 flex">
                      Already have an account?
                    </div>
                    <div
                      onClick={() => navigate("/login")}
                      style={{
                        fontFamily: "DM Sans",
                        fontSize: 16,
                        color: "#FFF",
                        textDecoration: "underline",
                        marginLeft: 5,
                        cursor: "pointer",
                      }}
                    >
                      Sign in
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div
                    className={`flex rounded-md w-full mx-9 bg-gradient-to-tr from-blue-500 to-pink-500 p-1 shadow-lg  ${loading ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}>
                    <button className="flex-1 z-50 font-bold text-xl bg-[#7186FF] px-6 py-1 rounded-md"
                      onClick={(e) => handleRegisterUser(e)}
                      disabled={loading}
                    >

                      {!loading ? "Next " : "Processing..."}
                    </button>
                  </div>
                      
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

      <div id="recaptcha-container"></div> {/* Container for reCAPTCHA */}
    </div>
    </>
  );
};

export default SignIn;
