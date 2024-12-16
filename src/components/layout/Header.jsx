import React, { useState,useEffect } from "react";
import Button from "../common/Button";
import "./Header.css";
import { useNavigate,useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {useUser} from '../../Context/UserContext'

const Header = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [active, setActive] = useState("");
  const [isSubscriptionPopupVisible, setIsSubscriptionPopupVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const isMembershipPlanPage = location.pathname.includes("/memberships-plan");


  // Consume user context
  const { user, membership, fetchUserAndMembership, logout } = useUser();
  console.log(user?.FirstName)

  const handleSubscriptionPopup = async () => {
    setIsSubscriptionPopupVisible(true);
    setIsPopupVisible(false);
    await fetchUserAndMembership();
  };

  const handleSetActive = (item) => {
    setActive(item);
  };


  useEffect(() => {
    console.log("Membership updated in Header:", membership);
  }, [membership]);
  

  const renewHandler = () => {
    setIsSubscriptionPopupVisible(false);
    navigate("/memberships");
  };

  return (
    <header className="header"> 
      <div className="flex items-center gap-2 justify-between w-full">
      <div
      className="gap-2"
        style={{
          display: "flex",
          alignItems: "center",
        
          width: 250,
        }}
      >
        <div>
          <Link to={`${user ? "/avatar-creation" : "/login"}`}>
            <img
              style={{ width: 50 }}
              src="/assets/images/Layer_1.png"
              alt="Explore"
            />
          </Link>
        </div>
        <Link className="hidden md:block " to={`${user ? "/avatar-creation" : "/login"}`}>
          <div className=" logo">Alphavatar</div>
        </Link>
      </div>


      <div className="flex justify-center md:-ml-24 items-center">
      {
          membership?
          <div className="bg-white cursor-pointer text-lg text-gray-700 px-4 py-1 rounded-full ">You Have {membership.avatarCountRemaining} avatar left </div>
          :<div 
          onClick={()=>navigate('/memberships')}
          className="bg-white cursor-pointer  text-lg text-gray-700 px-4 py-1 rounded-full ">Subscribe Now</div>
        }
        </div>

      <div className="flex gap-7 flex-col md:flex-row justify-center items-center">

      {user ? (
          <>
            <img
              onClick={() => {
                setIsPopupVisible(!isPopupVisible);
                setIsSubscriptionPopupVisible(false);
              }}
              style={{ width: 25, cursor: "pointer" }}
              src="/assets/images/Test Account.png"
              alt="User Account"
            />

            {isPopupVisible && (
              <div
                className="mt-4  z-[50] p-[20px]"
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  top: "40px",
                  right: "20px",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <h1 className="text-[#482BE7]">Hi {user.displayName}! Loving your avatars!?</h1>
                <h1 className="text-gray-700 text-left text-xl font-semibold">{user.displayName}</h1>
                <h1 className="text-gray-700 text-left text-sm -mt-3 font-light">{user.email}</h1>

                <div className="flex flex-col text-gray-700 cursor-pointer gap-8">
                  {/* <div
                    className={`flex gap-8 px-10 py-2 cursor-pointer items-center z-20 ${active === 'profile' ? 'bg-[#BAC4FB]' : ''}`}
                    onClick={() => handleSetActive('profile')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <h1 className="text-lg cursor-pointer z-20">My Profile</h1>
                  </div> */}

                  <div
                    className={`flex gap-8 px-10 py-2 z-20 cursor-pointer items-center ${active === 'subscriptions' ? 'bg-[#BAC4FB]' : ''}`}
                    onClick={handleSubscriptionPopup}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-square-menu"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M7 8h10" />
                      <path d="M7 12h10" />
                      <path d="M7 16h10" />
                    </svg>
                    <h1>My Subscriptions</h1>
                  </div>

                  <div
                    className={`flex px-10 py-2 gap-8 z-20 cursor-pointer items-center ${active === 'logout' ? 'bg-[#BAC4FB]' : ''}`}
                    onClick={()=>{
                      logout();
                      navigate('/login')    
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-log-out"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                    <h1>Log out</h1>
                  </div>
                </div>
              </div>
            )}

            {isSubscriptionPopupVisible && (
              <div
                className="mt-4 z-[50] p-[20px]"
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  top: "40px",
                  right: "20px",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                {membership && !isMembershipPlanPage ? (
                  <>
                    <div className="text-gray-700 flex gap-10 px-12 py-4">
                      <div>Membership Charges</div>
                      <div>C${membership.price || "N/A"}</div>
                    </div>
                    <div className="text-gray-700 flex gap-10 px-12 py-4">
                      <div>Avatar Remaining</div>
                      <div>{membership.avatarCountRemaining || "N/A"}</div>
                    </div>

                  </>
                ) : (
                  <div className="text-gray-700">No subscription data available.</div>
                )}

{
  !membership &&                 <button
  onClick={renewHandler}
  className="cursor-pointer text-center rounded-lg mt-1 py-2 px-[6px] text-white w-[50%] bg-[#7186FF]"
>
 Subscribe
</button>
}
              </div>
            )}
          </>
        ) : (
          <a href="/sign-in" className="hover:text-white" style={{ fontSize: 20, fontWeight: 800 }}>
            Signin
          </a>
        )}
        </div>
        </div>
      <nav>

      </nav>
    </header>
  );
};

export default Header;
