import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import axios from "axios";
import generateAvatar from "../api.js"; // Adjust the path as needed
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useSearchParams } from 'react-router-dom';
import { db, setDoc, doc ,updateDoc, getAuth} from '../../firebase'; // Import Firestore methods
import { useUser } from "../../Context/UserContext.js";



const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AvatarCreation = () => {

  const {user,membership,saveMembership,loadFromLocalStorage,saveToLocalStorage} = useUser();
  console.log(membership);
  const [searchParams] = useSearchParams();
  // const userL = localStorage.getItem('user');
  const parsedUser = loadFromLocalStorage("user");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarText, setAvatarText] = useState("");
  const [open, setOpen] = useState(false);
  const [features, setFeatures] = useState({});
  const [visibleCount, setVisibleCount] = useState(3);
  // const membershipL = localStorage.getItem('memberships');
  const parsedMembership = membership;
  const navigate=useNavigate();
  
  const [freeAvatarCount, setFreeAvatarCount] = useState(
    parsedUser.freeAvatarCount || 0
  );
    // Retrieve query parameters
    const avatarCount = searchParams.get('avatarCount');
    const price = searchParams.get('price');
    const priceId = searchParams.get('priceId');
    const userId = searchParams.get('uid');
    
    // Function to store membership data in Firebase
    // const storeUserDataInFirebase = async (userId, membershipData) => {
    //   try {
    //     const subscriptionDocRef = doc(db, 'memberships', userId);
    //     await setDoc(subscriptionDocRef, {
    //       ...membershipData,
    //       createdAt: new Date(), // Add a timestamp
    //     });
    //     console.log(membershipData)
    //     // saveMembership(membershipData)
    //     console.log('Subscription data successfully stored.');
    //   } catch (error) {
    //     console.log('Error storing subscription data:', error);
    //   }
    // };
    
    // Validate parameters before running the function
    // if (avatarCount && price && priceId && userId) {
    //   const membershipData = {
    //     userId:parsedUser.uid,
    //     membershipPlan: `${avatarCount} Plan`,
    //     totalCount:parseInt(avatarCount,10),
    //     name:parsedUser.displayName,
    //     email:parsedUser.email,
    //     avatarCountRemaining: parseInt(avatarCount, 10),
    //     price: parseFloat(price),
    //     priceId,
    //     status: 'active',
    //   };
    
    //   storeUserDataInFirebase(userId, membershipData);
    // } else {
    //   console.log('Missing required parameters. Function will not run.');
    // }
    

  // useEffect(() => {
  //   if (parsedUser && avatarCount && price && priceId) {
  //     const membershipData = {
  //       userId:parsedUser.uid,
  //       membershipPlan: `${avatarCount} Plan`,
  //       totalCount:parseInt(avatarCount,10),
  //       name:parsedUser.displayName,
  //       email:parsedUser.email,
  //       avatarCountRemaining: parseInt(avatarCount, 10),
  //       price: parseFloat(price),
  //       priceId,
  //       status: 'active',
  //     };



  //     console.log('Membership Data:', membershipData);
      
  //     // Store data in Firebase
  //     storeUserDataInFirebase(parsedUser.uid, membershipData);
  //     saveMembership(membershipData);
  //     saveToLocalStorage("memberships", membershipData);
  //   } else {
  //     console.warn('Membership data is incomplete or missing.');
  //   }
  // }, [avatarCount, price, priceId]);
  


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGenerateAvatar = async () => {
    if (avatarText === "") {
      alert("Enter Name");
      return;
    }
  
    const isValid = /^[a-zA-Z]{3,14}$/.test(avatarText);
  
    if (!isValid) {
      alert(
        "Invalid name. The name must only contain letters (a-z, A-Z), be at least 3 characters, and no more than 14 characters."
      );
      return;
    }
  
    if (!membership && freeAvatarCount <= 0) {
      alert("You have used all your free avatar generations.");
      return;
    }
  
    if (membership && parsedMembership === null) {
      alert("Membership information is not available.");
      return;
    }
  
    if (membership && parsedMembership.avatarCountRemaining <= 0) {
      alert("You have used all your membership avatar generations.");
      return;
    }
  
    setAvatarUrl(undefined);
    setLoading(true);
  
    try {
      const result = await generateAvatar(avatarText);
      setAvatarUrl(result);
      setLoading(false);
      localStorage.setItem("avatars", JSON.stringify(result));
      const storedAvatars = JSON.parse(localStorage.getItem("avatars"));
      console.log("Stored avatars:", storedAvatars);
  
      if (!membership) {
        // Ensure freeAvatarCount does not go below 0
        if (freeAvatarCount > 0) {
          const updatedCount = freeAvatarCount - 1;
          setFreeAvatarCount(updatedCount);
  
          parsedUser.freeAvatarCount = updatedCount;
          localStorage.setItem("user", JSON.stringify(parsedUser));
  
          // Update freeAvatarCount in Firebase
          if (parsedUser && parsedUser.uid) {
            const userRef = doc(db, "users", parsedUser.uid);
            await updateDoc(userRef, { freeAvatarCount: updatedCount });
            console.log("freeAvatarCount updated in Firebase");
          } else {
            console.error("User not found in localStorage");
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate avatar", error);
      setLoading(false);
    }
  };
  

  const loadMoreImages = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Load two more images on button click
  };

  

  const info = [
    {
      imageSrc: "/assets/images/Union.png",
      text: "Faces (Avatar) - designed using letters of a name",
      imageClass: "top-1 bottom-0",
    },
    {
      imageSrc: "/assets/images/005-happy 1.png",
      text: "Customizable - emotions, gender, ethnicity, language",
      imageClass: "top-0 bottom-0",
    },
    {
      imageSrc: "/assets/images/Group.png",
      text: "Multiple design options to choose from",
      imageClass: "-top-2 bottom-0",
      textClass: "ml-9",
    },
    {
      imageSrc: "/assets/images/Vector.png",
      text: "Customized fonts, size and techniques",
      imageClass: "bottom-0",
    },
    {
      imageSrc: "/assets/images/Group1.png",
      text: "Letters used in a unique way to symbolize the character",
      imageClass: "top-1 bottom-0",
    },
    {
      imageSrc: "/assets/images/Group2.png",
      text: "Use for printing, casting, laser cut, molding, & embossed",
      imageClass: "top-1 bottom-0",
    },
  ];

  return (
    <section
      className=" py-10 overflow-hidden gradient-img  md:px-4 flex flex-col md:flex-row w-full "
      style={{ alignItems: "flex-start" }}
    >

<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="child-modal-title"
  aria-describedby="child-modal-description"
>
  <Box className="rounded-xl relative" sx={{ ...style, }}>
    {/* Close Button */}
    <button
      onClick={handleClose}
      className="ml-1"
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color:"black"

      }}
    >
      X
    </button>

    {/* Features Content */}
    {Object.entries(features).map(([key, value]) => {
      if (key === "features") return null; // Skip rendering for 'Features'

      return (
        <div
          key={key} // Add key for unique identification
          className="small-text flex mx-4  flex-col"
          style={{ color: "#000000" }}
        >
          <div className="small-text" style={{ color: "#000" }}>
            {key}: {value[0]}
          </div>
        </div>
      );
    })}
  </Box>
</Modal>
      <div className="creation-div1 p-8 h-[100%]  rounded-2xl gap-4  w-[100%] md:w-[30%] flex flex-col items-center"
       style={{ minWidth: "500px" }}
      >
        <div className=" mt-12  text-2xl">Generate Avatars !</div>
        <div className="gradient-border w-[100%]">
          <input
            onChange={(e) => {
              setAvatarText(e.target.value);
            }}
            className="styled-input   h-[48px] "
            placeholder="Type your name here...!"
          />
        </div>


        {
         !membership  &&         <div className="text-center text-gray-500 mt-2">
          Free Avatars Left: {freeAvatarCount}/3
        </div>
        }


      {
        membership?
        <div className=" flex  gap-5"> 
        <button
          onClick={() => {
            if (!loading) handleGenerateAvatar();
          }}
          disabled={loading }
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 16,
            width: "100%",
            height: 55,
          }}
          className={`create-your-avatar-btn ${
            loading 
              ? "opacity-50 cursor-not-allowed animate-pulse"
              : ""
          }`}
          >
  <img src="/assets/images/Fantasy.png" alt="Create Avatar" />
  {loading ? "GENERATING..." : "GENERATE"}
</button>



<button
          onClick={() => navigate('/memberships')}
          
          style={{
            cursor: "pointer",
            fontSize: 16,
            width: "70%",
            height: 55,
          }}
          className={`create-your-avatar-btn mr-24 `}
          >Explore Memberships
</button>
          </div>
        
        :

        <div className=" flex  gap-5"> 
        <button
          onClick={() => {
            if (!loading) handleGenerateAvatar();
          }}
          disabled={loading || freeAvatarCount <= 0}
          style={{
            cursor: loading || freeAvatarCount <= 0 ? "not-allowed" : "pointer",
            fontSize: 16,
            width: "100%",
            height: 55,
          }}
          className={`create-your-avatar-btn ${
            loading || freeAvatarCount <= 0
              ? "opacity-50 cursor-not-allowed animate-pulse"
              : ""
          }`}
          >
  <img src="/assets/images/Fantasy.png" alt="Create Avatar" />
  {loading ? "GENERATING..." : "GENERATE"}
</button>



<button
          onClick={() => navigate('/memberships')}
          
          style={{
            cursor: "pointer",
            fontSize: 16,
            width: "70%",
            height: 55,
          }}
          className={`create-your-avatar-btn `}
          >Explore Memberships
</button>
          </div>
      }

        <div className="gradient-border mr-20  md:mr-0 w-[100%]">
          <div className="styled-input flex flex-col gap-4 ">
          {info.map(({ imageSrc, text, imageClass, textClass = "ml-12" }, index) => (
      <div key={index} className="flex flex-row relative justify-center items-center gap-1">
        <img src={imageSrc} className={`w-[10%] absolute left-0 ${imageClass}`} />
        <div className={`small-dmsans ${textClass}`}>{text}</div>
      </div>
    ))}
          </div>
        </div>

      </div>

      {!avatarUrl && !loading ? (
        <div
  className="h-[200px] mt-5 flex justify-center items-center my-auto mx-auto text-[48px] font-bold opacity-50 "
>
  <span>Start Creating Some <br />
  Amazing Avatars!</span>
</div>

      ) : null}

      {loading ? (
        <div className="scrollbar-hidden overflow-y-scroll w-[100%] md:w-[70%] grid-container flex justify-center items-center">
<div class="spinner mt-8 mb-3">
    <div class="spinnerin "></div>
</div>
        </div>
      ) : null}

      {avatarUrl ? (
        <div className=" flex flex-col items-center gap-5 justify-center">
        <div className=" w-[100%] md:w-[70%] mt-12  relative grid grid-cols-3 gap-12 mx-12 ">
          {Object.entries(avatarUrl).slice(0, visibleCount).map(([key, value]) => {
            return (
              <div
                key={key}
                className="avatar-card bg-[#FFF] grid-item flex flex-col justify-between p-1 relative"
              >
                <div className=" absolute  flex flex-col items-end right-0">
                  {/* <div>
                    <a
                      href={`https://alphavatar.fun/Results/${avatarText}/${key}`}
                      download={key}
                      target="_blank"
                    >
                      <img src="/assets/images/Download.png" />
                    </a>
                  </div> */}
                  <div
                    onClick={() => {
                      handleOpen();
                      setFeatures(value);
                    }}
                  >
                    <div className="text-black z-50 px-2  cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      </div>
                  </div>
                </div>
                <div className="avatar-container  relative flex flex-col gap-4 items-center justify-center mt-4  mb-2">
                  <CircularProgress color="secondary" className="absolute mb-24  mx-auto  inset-0"/>
                  <img
                    key={key}
                    src={`https://alphavatar.fun/Results/${avatarText}/${key}`}
                    className="w-200px h-400px z-20"
                  />
                  {
                    membership?                   <Link  to="/edit-avatar" state={{ imageURL: `https://alphavatar.fun/Results/${avatarText}/${key}`,text:{avatarText}}} className="edit-bg rounded-lg mx-4 w-[60px] py-1  text-center" > 
                    <div className="hover:text-white text-white ">Edit</div>
                    </Link> :                  <Link  to="/memberships" className="edit-bg rounded-lg mx-4 w-[60px] py-1  text-center" > 
                    <div className="hover:text-white text-white ">Edit</div>
                    </Link>
                  }
                </div>

              </div>
            );
          })}
        </div>
        {visibleCount < Object.keys(avatarUrl).length && (
            <button
              onClick={loadMoreImages}
              className="  h-[49px] download-img-btn w-[30%]"
            >
              Load More
            </button>
          )}
        </div>
      ) : null}



      {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((item) => { 
          return (
            <div className="avatar-bg bg-[#FFF] grid-item flex flex-col justify-between p-1">
              <div className="flex flex-col items-end">
                <div>
                  <img src="/assets/images/Download.png" />
                </div>
                <div>
                  <img src="/assets/images/Bulleted List.png" />
                </div>
              </div>
              <div
                onClick={() => {
                  navigate("/edit-avatar");
                }}
                className="edit-bg w-[60px] rounded-[12px] "
              >
                Edit
              </div>
            </div>
          );
        })}*/}
    </section>
  );
};

export default AvatarCreation;

