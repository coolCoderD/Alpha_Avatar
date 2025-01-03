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

const FeatureControlPanel = ({ features, imageURL,text,featureInfo }) => {
  console.log(featureInfo.value);
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
  const canvasWidth = 550; // Canvas width in portrait
  const canvasHeight = 550; // Canvas height in portrait
  
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
    <section className="py-10  overflow-hidden flex flex-col -mt-[70px] md:flex-row w-full">
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
        >
          <div style={{ cursor: "pointer", textAlign: "right" }}>
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
          className="w-[400px] md:w-[800px]"
          sx={{
            backgroundColor: "",
            padding: "16px",
            borderRadius: "8px",
           
            margin: "auto",
            textAlign: "center",
            position: "relative"
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
      <div
  className="gap-4 membership-gradient-bg b w-full md:w-[40%] rounded-[18px] border-white border-1 flex flex-col justify-center px-3 items-start"
  style={{
    height: 'auto', // Adjust height dynamically
    minHeight: '300px', // Ensure a minimum height
 
  }}
>
  <div
    className="gradient-text   text-2xl"
    style={{
      backgroundColor: "#2b1d52",
      borderRadius: 34,
      fontSize: 28,
      fontWeight: 900,
    }}
  >
    CONTROL PANEL
  </div>
  <div
    className="text-white px-3 -mt-8"
    style={{
      fontSize: '16px',
    }}
  >
    Select Your Feature:
  </div>
  <RadioGroup
    aria-labelledby="feature-selection-label"
    value={selectedFeatureName}
    onChange={(e) => handleFeatureSelect(e.target.value)}
  >
    <div className="flex px-3 flex-wrap gap-2">
      {features.map((feature) => (
        <FormControlLabel
          key={feature.name}
          value={feature.name}
          control={
            <Radio
              sx={{
                color: "#fff",
                "&.Mui-checked": {
                  color: "transparent",
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
                  boxShadow: "0 0 0 2px #fff",
                },
              }}
            />
          }
          label={feature.name}
        />
      ))}
    </div>
  </RadioGroup>
  {["width", "height", "x-Axis (Horizontal)", "y-Axis (Vertical) "].map((type) => (
    <div
      key={type}
      className="w-[70%]  flex flex-col xl:flex-row items-center justify-between px-1 py-1"
    >
      <div className="gradient-text text-left" style={{ fontSize: 18 }}>
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
          color: "transparent",
          "& .MuiSlider-track": {
            background: "linear-gradient(to right, #7186FF, #F97689)",
          },
          "& .MuiSlider-rail": {
            background: "#ddd",
          },
          "& .MuiSlider-thumb": {
            background: "linear-gradient(to right, #7186FF, #F97689)",
            border: "2px solid #fff",
            boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.5)",
          },
          "& .MuiSlider-valueLabel": {
            background: "transparent",
            color: "#fff",
          },
        }}
      />
    </div>
  ))}
<div
className=""

>
<div
className=""
  style={{
    padding: "6px", // Space for the gradient border
    borderRadius: "10px", // Matches the border-radius of the table
   
  }}
>
<div
className="hidden md:block"
  style={{
    background: "linear-gradient(90deg, #7186ff 0%, #f97689 100%)", // Gradient border effect
    padding: "2px", // Space for the border thickness
    borderRadius: "12px", // Outer border radius
  }}
>
  <table
    className="w-full membership-gradient-bg text-center border-collapse"
    style={{
      borderRadius: "10px", // Inner border radius
      overflow: "hidden", // Ensures no overflow of content
      tableLayout: "fixed", // Consistent column widths
      width: "100%",
      backgroundColor: "#090817 ", // Table background color for contrast
    }}
  >
    <thead>
      <tr>
        {Object.keys(featureInfo.value).map(
          (key) =>
            key !== "features" && (
<th
  key={key}
  className="p-2 relative"
  style={{
    fontWeight: "bold",
    fontSize: "14px",
    color: "#fff",
    textAlign: "center",
    overflow: "hidden", // Ensures no overflow
  }}
>
  <span
    style={{
      position: "relative",
      zIndex: 1, // Keep the text above the pseudo-element
    }}
  >
    {key}
  </span>
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "2px", // Thickness of the bottom border
      background: "linear-gradient(90deg, #7186ff 0%, #f97689 100%)",
    }}
  ></div>
  <div
    style={{
      position: "absolute",
      top: 0,
      right: 0,
      width: "2px", // Thickness of the right border
      height: "100%",
      background: "linear-gradient(180deg, #7186ff 0%, #f97689 100%)",
    }}
  ></div>
</th>

            )
        )}
      </tr>
    </thead>
    <tbody>
    <tr>
  {Object.entries(featureInfo.value).map(
    ([key, value]) =>
      key !== "features" && (
        <td
          key={key}
          className="p-2 relative" // Add `relative` for positioning
          style={{
            fontSize: "14px",
            color: "#fff",
            wordWrap: "break-word",
            textAlign: "center", // Optional for alignment
          }}
        >
          <span
            style={{
              position: "relative",
              zIndex: 1, // Keep the text above the pseudo-element
            }}
          >
            {value[0].toUpperCase()}
          </span>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "2px", // Thickness of the right border
              height: "100%",
              background: "linear-gradient(180deg, #7186ff 0%, #f97689 100%)", // Gradient for the right border
            }}
          ></div>
        </td>
      )
  )}
</tr>

    </tbody>
  </table>
</div>

</div>
</div>


</div>

  
      {/* Preview Section */}
      <div className="w-full -mt-8 md:w-[60%] flex flex-col p-10 gap-4">
        <div id="preview-section" className="rounded-[8px] h-full bg-white flex justify-center items-center w-full overflow-hidden">
          <canvas
            id="mainCanvas"
            className="bg-white"
            width={canvasWidth}
            height={canvasHeight}
            style={{ display: "block", maxWidth: "100%" }}
            ref={mainCanvasRef}
          />
        </div>
  
    <div className="flex flex-col md:flex-row -mt-10 items-center justify-evenly gap-4 px-4 py-4">
  <button
    onClick={handleModalOpen}
    className="preview-image-btn md:w-[30%] h-[50px] rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
  >
    Preview Image
  </button>
  
  <button
    onClick={handleDownload}
    className={`md:w-[30%] h-[50px] rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${loading ? "bg-gray-400 cursor-not-allowed" : "download-img-btn"}`}
    disabled={loading}
  >
    {loading ? "DOWNLOADING...." : "DOWNLOAD"}
  </button>
  
  <button
    onClick={() => handleFeedbackOpen()}
    className="preview-image-btn md:w-[30%] h-[50px] rounded-lg bg-gradient-to-r from-purple-500 to-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
  >
    Give Feedback
  </button>
</div>


      </div>
    </section>
  );
  
};

export default FeatureControlPanel;