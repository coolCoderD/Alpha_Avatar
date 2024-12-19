import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, FormControl, RadioGroup, FormControlLabel, Radio, Slider } from "@mui/material";
import interact from "interactjs";
import html2canvas from "html2canvas";
import axios from 'axios'
import AvatarPreview from "./AvatarPreview";
import { useNavigate } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";
import { doc, deleteDoc, updateDoc, db ,collection,setDoc,arrayUnion} from '../../firebase'
import { useFeedbackState } from "../../Context/FeedbackStateProvider";
import { useUser } from "../../Context/UserContext";

const FeatureControlPanel = ({ features, imageURL,text }) => {
  const [open, setOpen] = useState(false);

  console.log(text.avatarText);

  const { feedbackOpen, feedbackImageURL, openFeedback, closeFeedback } = useFeedbackState()
  console.log(feedbackOpen)
  const [loading, setLoading] = useState(false);
  const mainCanvasRef = useRef(null);
  const [featureStates, setFeatureStates] = useState(features);
  const [selectedFeatureName, setSelectedFeatureName] = useState("Face");
  const navigate = useNavigate();

  const {saveMembership,loadFromLocalStorage,saveToLocalStorage,clearLocalStorage,fetchUserAndMembership} = useUser();
  


  const handleFeedbackOpen = () => {
     openFeedback(); // Use the global function
  };

  // const handleFeedbackClose = () => setFeedbackOpen(false);

  const user = localStorage.getItem("user");

  const parsedUser = JSON.parse(user);
  console.log(parsedUser.uid);



  const handleModalOpen = () => {

    setOpen(true);
  }

  useEffect(() => {
    if (mainCanvasRef.current) {
      const ctx = mainCanvasRef.current.getContext("2d");
      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  }, []);




  const handleModalClose = () => setOpen(false);


  const originalWidth = 5000; // Original image width
  const originalHeight = 5000; // Original image height
  const canvasWidth = 450; // Canvas width in portrait
  const canvasHeight = 450; // Canvas height in portrait
  
  // Calculate scaling factors for portrait orientation
  const scaleX = canvasWidth / originalWidth;
  const scaleY = canvasHeight / originalHeight;
  
  // Utility to scale values between 0-100
  const toCanvasScale = (value, isWidth = false) => value * (isWidth ? scaleX : scaleY);
  const toOriginalScale = (value, isWidth = false) => value / (isWidth ? scaleX : scaleY);

  const handleFeatureSelect = (name) => {
    setSelectedFeatureName(name);
  };


  const handleSliderChange = (type) => (event, value) => {
    setFeatureStates((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.name === selectedFeatureName
          ? {
            ...feature,
            [type]: toOriginalScale(value, type === "width" || type === "height"),
          }
          : feature
      )
    );
  };


  // const canProceed = async () => {
  //   try {
  //     const currentUser = loadFromLocalStorage("user");
  //     const membershipData = loadFromLocalStorage("memberships");
  
  //     if (!currentUser || !membershipData) {
  //       alert("Ensure you have a membership.");
  //       return false;
  //     }
  
  //     const { uid: userId } = currentUser;
  //     const { avatarCountRemaining } = membershipData;
  
  //     if (avatarCountRemaining > 0) {
  //       const updatedMembershipData = { ...membershipData, avatarCountRemaining: avatarCountRemaining - 1 };
  //       const membershipRef = doc(db, "memberships", userId);
  
  //       if (updatedMembershipData.avatarCountRemaining === 0) {
  //         await deleteDoc(membershipRef);
  //         saveMembership(null); // Update context and localStorage
  //         alert("Membership has expired. Please renew to continue.");
  //       } else {
  //         await updateDoc(membershipRef, { avatarCountRemaining: updatedMembershipData.avatarCountRemaining });
  //         saveMembership(updatedMembershipData);
  //         console.log("Updated avatar count in Firestore and localStorage.");
  //       }
  
  //       await fetchUserAndMembership(); // Refresh context
  //       return true;
  //     } else {
  //       alert("No avatars remaining. Please renew your membership.");
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Error in canProceed:", error);
  //     alert("An error occurred. Please try again.");
  //     return false;
  //   }
  // };
  
  
  // const downloadCanvasImage = async () => {



  //   const previewSection = document.getElementById("preview-section");
  //   if (!previewSection) {
  //     console.error("Preview section not found.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     // Generate the canvas from the specified section
  //     const canvas = await html2canvas(previewSection, {
  //       useCORS: true,
  //       allowTaint: false,
  //       scale: 2,
  //     });

  //     // Convert canvas to blob
  //     const imageBlob = await new Promise((resolve) =>
  //       canvas.toBlob(resolve, "image/png")
  //     );

  //     // Prepare the FormData for the upload
  //     const formData = new FormData();
  //     formData.append("image", imageBlob, "avatar.png");

  //     // Send the image to the server
  //     const response = await axios.post("https://alphavatar.fun/upload_screenshot/", formData, {
  //       responseType: "blob",
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });


  //     // Handle the server response
  //     const processedBlob = response.data;
  //     const url = URL.createObjectURL(processedBlob);

  //     // Trigger download of the processed image
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = "processed-avatar.png";
  //     link.click();

  //     // Clean up the object URL
  //     URL.revokeObjectURL(url);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error generating or uploading canvas image:", error);
  //     alert("Network error occurred. Please reload the page and try again.");
  //     setLoading(false);
  //   }
  // };


  // const handleDownload = async () => {
  //   try {
  //     setLoading(true);
  //     console.log("Goes to Proceed");
  //     const proceed = await canProceed(); // Ensure `canProceed` is executed and awaited
  //     console.log("proceed", proceed);  
  //     if (proceed) {
  //       await downloadCanvasImage(); // Proceed to download the image if allowed
  //     }
  //     setLoading(false);
  //   } catch (error) {

  //     console.error("Error handling download:", error);
  //     setLoading(false);
  //   }
  // };
  


  const handleDownload = async () => {
    try {
      setLoading(true);
  
      // Check if the user can proceed
      const canProceedResult = await canProceed();
      if (!canProceedResult) {
        setLoading(false);
        return; // Exit if the user cannot proceed
      }
  
      // Attempt to download the canvas image
      const downloadSuccess = await downloadCanvasImage();
      if (downloadSuccess) {

              // Store download data in Firebase
      await storeDownloadData(parsedUser.uid, {
        downloadTimestamp: new Date(),
        itemDownloaded: featureStates, // Replace with actual avatar or item identifier,
        avatarText:text.avatarText,
        userName:parsedUser.displayName,
      });

        // Only update membership if the download succeeds
        await updateMembershipAfterDownload();
      }
  
      setLoading(false);
    } catch (error) {
      console.error("Error handling download:", error);
      setLoading(false);
    }
  };


// Function to store download data in Firebase

const storeDownloadData = async (userId, downloadData) => {
  try {
    // Validate userId and downloadData
    console.log(parsedUser.uid);
    if (!userId) {
      throw new Error("Invalid userId or downloadData");
    }

    // Reference to the document in the 'downloads' collection
    const downloadsRef = doc(collection(db, "downloads"), userId);

    // Write the data to Firestore
    await setDoc(
      downloadsRef,
      {
        downloads: arrayUnion(downloadData), // Add new download data to an array
      },
      { merge: true } // Merge with existing document data
    );

    console.log("Download data successfully stored in Firebase:", downloadData);
  } catch (error) {
    console.error("Error storing download data in Firebase:", error.message || error);
  }
};
  const canProceed = async () => {
    try {
      const currentUser = loadFromLocalStorage("user");
      const membershipData = loadFromLocalStorage("memberships");
  
      if (!currentUser || !membershipData) {
        alert("Ensure you have a membership.");
        return false;
      }
  
      const { avatarCountRemaining } = membershipData;
  
      if (avatarCountRemaining > 0) {
        return true; // Allow user to proceed
      } else {
        alert("No avatars remaining. Please renew your membership.");
        return false;
      }
    } catch (error) {
      console.error("Error in canProceed:", error);
      alert("An error occurred. Please try again.");
      return false;
    }
  };
  
  const downloadCanvasImage = async () => {
    const previewSection = document.getElementById("preview-section");
    if (!previewSection) {
      console.error("Preview section not found.");
      return false; // Indicate failure
    }
  
    try {
      const canvas = await html2canvas(previewSection, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
      });
  
      const imageBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
  
      const formData = new FormData();
      formData.append("image", imageBlob, "avatar.png");
  
      const response = await axios.post("https://alphavatar.fun/upload_screenshot/", formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const processedBlob = response.data;
      const url = URL.createObjectURL(processedBlob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = "processed-avatar.png";
      link.click();
  
      URL.revokeObjectURL(url);
      return true; // Indicate success
    } catch (error) {
      console.error("Error generating or uploading canvas image:", error);
      alert("Network error occurred. Please reload the page and try again.");
      return false; // Indicate failure
    }
  };
  
  const updateMembershipAfterDownload = async () => {
    try {
      const currentUser = loadFromLocalStorage("user");
      const membershipData = loadFromLocalStorage("memberships");
  
      if (!currentUser || !membershipData) {
        console.error("Missing user or membership data.");
        return;
      }
  
      const { uid: userId } = currentUser;
      const { avatarCountRemaining } = membershipData;
  
      const updatedMembershipData = {
        ...membershipData,
        avatarCountRemaining: avatarCountRemaining - 1,
      };
  
      const membershipRef = doc(db, "memberships", userId);
  
      if (updatedMembershipData.avatarCountRemaining === 0) {
        await deleteDoc(membershipRef);
        saveMembership(null);
        alert("Membership has expired. Please renew to continue.");
      } else {
        await updateDoc(membershipRef, {
          avatarCountRemaining: updatedMembershipData.avatarCountRemaining,
        });
        saveMembership(updatedMembershipData);
        // saveToLocalStorage("memberships", updatedMembershipData);
      }
  
      await fetchUserAndMembership(); // Refresh context
      console.log("Membership updated successfully.");
    } catch (error) {
      console.error("Error updating membership after download:", error);
    }
  };
  



  const drawFeaturesOnCanvas = () => {
    const canvas = document.getElementById("mainCanvas");
    if (!canvas) return;
      // Ensure canvas is set to portrait dimensions
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    featureStates.forEach((feature) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `https://alphavatar.fun/${feature.path}`;

      img.onload = () => {
        ctx.drawImage(
          img,
          toCanvasScale(feature.x),
          toCanvasScale(feature.y),
          toCanvasScale(feature.width, true),
          toCanvasScale(feature.height, true)
        );
      };

      img.onerror = () => console.error(`Failed to load image: ${feature.path}`);
    });
  };

  useEffect(() => {
    if (!selectedFeatureName) return;
  
    const selectedFeature = featureStates.find((f) => f.name === selectedFeatureName);
  
    if (!selectedFeature) return;
  
    const draggableElement = `#draggable-${selectedFeatureName}`;
  
    // Avoid multiple initialization of interact.js for the same feature
    const interactInstance = interact(draggableElement);
  
    if (interactInstance._actions?.length) {
      return; // If already initialized, skip re-binding
    }
  
    interactInstance
      .draggable({
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: "#preview-section",
          }),
        ],
        listeners: {
          move: (event) => {
            const { dx, dy } = event;
            setFeatureStates((prevFeatures) =>
              prevFeatures.map((feature) =>
                feature.name === selectedFeatureName
                  ? {
                      ...feature,
                      x: Math.max(0, feature.x + toOriginalScale(dx)),
                      y: Math.max(0, feature.y + toOriginalScale(dy)),
                    }
                  : feature
              )
            );
          },
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: (event) => {
            const { width, height } = event.rect;
            setFeatureStates((prevFeatures) =>
              prevFeatures.map((feature) =>
                feature.name === selectedFeatureName
                  ? {
                      ...feature,
                      width: Math.max(50, toOriginalScale(width, true)),
                      height: Math.max(50, toOriginalScale(height, true)),
                    }
                  : feature
              )
            );
          },
        },
      });
  
    // Cleanup to prevent memory leaks
    return () => interactInstance.unset();
  }, [selectedFeatureName, featureStates]);
  
  

  useEffect(() => {
    drawFeaturesOnCanvas();
  }, [featureStates]);

  return (
    <section className="py-10 overflow-hidden  flex flex-col md:flex-row w-full">
      <Modal open={feedbackOpen} onClose={closeFeedback}>
        <Box
          className="w-[400px] md:w-[800px]"
          sx={{
            backgroundColor: "",
            padding: "16px",
            borderRadius: "8px",
            margin: "auto",
            textAlign: "center",
            padding: "24",
            position: "relative"
          }}
        >  <div   style={{ cursor: "pointer", textAlign: "right" }}>
            <button
              onClick={closeFeedback}
              className="absolute top-[36px] left-[45px] z-50 bg-transparent text-gray-400 font-bold text-5xl"
            >
              ×
            </button>

            <FeedbackForm
              featureStates={featureStates}
              userId={parsedUser.uid}
              userName={parsedUser.displayName}
              onClose={closeFeedback}
            />
          </div>
        </Box>
      </Modal>


      <Modal open={open} onClose={handleModalClose}>
        <Box
          sx={{
            backgroundColor: "",
            padding: "16px",
            borderRadius: "8px",
            width: "600px",
            margin: "auto",
            textAlign: "center",
            position: "relative", // Make sure the parent div is positioned relative
          }}
        >
          <div onClick={handleModalClose} style={{ cursor: "pointer", textAlign: "right" }}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-[36px] left-[4px] z-50 bg-transparent text-gray-400 font-bold text-5xl"

            >
              ×
            </button>

            <AvatarPreview featureArray={featureStates} />
          </div>
        </Box>
      </Modal>





      {/* Control Panel */}
      <div className="gradient-img h-full gap-4  w-full md:w-[40%] rounded-[18px] border-white border-1 flex flex-col justify-center px-3 items-start">
        <div
          className=" gradient-text  text-2xl"
          style={{
            backgroundColor: "#2b1d52",
            borderRadius: 34,
            fontSize: 28,
            fontWeight: 900,
          }}
        >
          CONTROL PANEL
        </div>
        <div className="gradient-text small-dmsans p-0">Select your Feature:</div>
        <RadioGroup aria-labelledby="feature-selection-label" value={selectedFeatureName} onChange={(e) => handleFeatureSelect(e.target.value)}>
          {features.map((feature) => (
            <FormControlLabel
              key={feature.name}
              value={feature.name}
              control={
                <Radio
                  sx={{
                    color: "#fff", // Default color for unselected state
                    "&.Mui-checked": {
                      color: "transparent", // Hide default check color
                    },
                    "&.Mui-checked::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "linear-gradient(to right, #7186FF, #F97689)",
                      boxShadow: "0 0 0 2px #fff", // White border

                    },
                  }}
                />
              }
              label={feature.name}
            />
          ))}

        </RadioGroup>
        {["width", "height", "x-Axis (Horizontal)", "y-Axis (Vertical)"].map((type) => (
          <div key={type} className="w-[70%] flex flex-row items-center justify-center px-2 py-3 items-start">
            <div className="gradient-text" style={{ fontSize: 18 }}>
              {type.toUpperCase()}:
            </div>
            <Slider
              size="large"
              value={toCanvasScale(
                featureStates.find((f) => f.name === selectedFeatureName)?.[type] || 0,
                type === "width" || type === "height"
              )}
              onChange={handleSliderChange(type)}
              min={0}
              max={500}
              valueLabelDisplay="auto"
              sx={{
                color: "transparent", // Hide default color
                "& .MuiSlider-track": {
                  background: "linear-gradient(to right, #7186FF, #F97689)", // Gradient on the track
                },
                "& .MuiSlider-rail": {
                  background: "#ddd", // Rail color
                },
                "& .MuiSlider-thumb": {
                  background: "linear-gradient(to right, #7186FF, #F97689)", // Gradient on the thumb
                  border: "2px solid #fff", // White border around the thumb
                  boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.5)", // Optional: glowing effect
                },
                "& .MuiSlider-valueLabel": {
                  background: "transparent", // To match the design
                  color: "#fff", // Text color for value label
                }
              }}
            />

          </div>
        ))}
      </div>

      {/* Preview Section */}
      <div className="w-full  md:w-[60%] flex flex-col p-10 gap-4">
        <div
          id="preview-section"
          className="rounded-[8px] h-full  bg-white flex  justify-center items-center  w-full  overflow-hidden   "
        >
          <canvas
            id="mainCanvas"
            className="bg-white  "
            width={canvasWidth}
            height={canvasHeight}
            style={{ display: "block" }}
            ref={mainCanvasRef}
          />

        </div>



        <div className="flex gap-12 justify-start">
          <button onClick={handleModalOpen} className=" preview-image-btn w-[50%]">
            Preview Image
          </button>
          <button 
          onClick={handleDownload} className={`h-[49px]  w-[50%] ${loading ? "bg-gray-400 cursor-not-allowed" : "download-img-btn"}`}
          disabled={loading}
          >
            {
              loading ? "DOWNLOADING...." : "DOWNLOAD"
            }
          </button>
        </div>
        <div className=" flex justify-center items-center">
          <button onClick={()=>{(handleFeedbackOpen())}} className=" preview-image-btn w-[50%]">
            Give Feedback
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeatureControlPanel;