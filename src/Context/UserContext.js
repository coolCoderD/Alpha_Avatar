import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db,deleteDoc,updateDoc,setDoc } from "../firebase"; // Adjust the import to match your project structure

// Create the Context
const UserContext = createContext();

// Create the Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);

  // Function to save membership data to localStorage and context
  const saveMembership = (membershipData) => {
    setMembership(membershipData); // Update context state
    localStorage.setItem("memberships", JSON.stringify(membershipData)); // Save to localStorage
  };



  // const canProceed = async () => {
  //   try {
  //     if (!user || !membership) {
  //       console.error("User or membership data is not available in context.");
  //       alert("Please log in and ensure your membership data is available.");
  //       return false;
  //     }
  
  //     const { uid: userId } = user;
  //     const { avatarCountRemaining } = membership;
  
  //     if (avatarCountRemaining === undefined) {
  //       console.error("Membership data is missing the 'avatarCountRemaining' field.");
  //       alert("Membership data is corrupted or incomplete.");
  //       return false;
  //     }
  
  //     if (avatarCountRemaining > 0) {
  //       const updatedMembership = { ...membership, avatarCountRemaining: avatarCountRemaining - 1 };
  
  //       const membershipRef = doc(db, "memberships", userId);
  
  //       if (updatedMembership.avatarCountRemaining === 0) {
  //         // Delete membership entry from Firestore
  //         await deleteDoc(membershipRef);
  //         console.log("Membership entry deleted successfully from Firestore.");
  //         setMembership(null);
  //         localStorage.removeItem("memberships");
  //         alert("Membership has expired. Please renew to continue.");
  //       } else {
  //         // Update Firestore with new avatar count
  //         await updateDoc(membershipRef, { avatarCountRemaining: updatedMembership.avatarCountRemaining });
  //         console.log("Remaining Avatar count updated successfully in Firestore.");
  //         setMembership(updatedMembership);
  
  //         // Update local storage with the new avatar count
  //         localStorage.setItem("memberships", JSON.stringify(updatedMembership));
  //       }
  
  //       return true; // Allow the user to proceed
  //     } else {
  //       console.warn("No avatars left to download.");
  //       alert("You have no avatars remaining to download. Please renew your membership.");
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Error in canProceed function:", error);
  //     alert("An error occurred while checking membership data. Please try again later.");
  //     return false;
  //   }
  // };
  

  // Fetch user and membership data
  const fetchUserAndMembership = async () => {
    try {
      const user = localStorage.getItem("user");

      if (user) {
        const parsedUser = JSON.parse(user);
        setUser(parsedUser);

        if (parsedUser?.uid) {
          const membershipDocRef = doc(db, "memberships", parsedUser.uid);
          const membershipDoc = await getDoc(membershipDocRef);

          if (membershipDoc.exists()) {
            const membershipData = membershipDoc.data();
            saveMembership(membershipData); // Use saveMembership to update both localStorage and context

            // Add membership status to user
            parsedUser.isMember = true;
            localStorage.setItem("user", JSON.stringify(parsedUser));
          } else {
            console.warn("No membership data found.");
            saveMembership(null); // Clear membership in both localStorage and context

            parsedUser.isMember = false;
            localStorage.setItem("user", JSON.stringify(parsedUser));
          }
        }
      } else {
        console.warn("No user found. Redirecting...");
        setUser(null);
        saveMembership(null); // Clear membership in both localStorage and context
      }
    } catch (error) {
      console.error("Error fetching user or membership data:", error);
    }
  };

  // Logout function to clear context and localStorage
  const logout = () => {
    console.log("User logged out");
    setUser(null); // Clear user state in context
    saveMembership(null); // Clear membership in both localStorage and context
    localStorage.clear(); // Clear localStorage

    // Trigger any additional actions like redirecting to login
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUserAndMembership();
  }, []);


  console.log(membership,'membership data');
  console.log(user,'user data');


  const loadFromLocalStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading from localStorage for key ${key}:`, error);
      return null;
    }
  };


  const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage for key ${key}:`, error);
    }
  };
  
  const clearLocalStorage = () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };


  const storeMembershipData = async (userId, membershipData) => {
    try {
      const membershipRef = doc(db, "memberships", userId);
      await setDoc(membershipRef, membershipData);
      saveMembership(membershipData);
      console.log("Membership data stored successfully.");
    } catch (error) {
      console.error("Error storing membership data:", error);
    }
  };
  

  return (
    <UserContext.Provider value={{ user, membership, fetchUserAndMembership, saveMembership, logout,loadFromLocalStorage, saveToLocalStorage, clearLocalStorage,
     storeMembershipData
     }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
