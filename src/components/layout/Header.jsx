import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import "./Header.css";

const Header = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [active, setActive] = useState("");
  const [isSubscriptionPopupVisible, setIsSubscriptionPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, membership, fetchUserAndMembership, logout } = useUser();

  const isMembershipPlanPage = location.pathname.includes("/memberships-plan");

  const handleSubscriptionPopup = async () => {
    setIsSubscriptionPopupVisible(true);
    setIsPopupVisible(false);
    await fetchUserAndMembership();
  };

  const handleSetActive = (item) => {
    setActive(item);
  };

  const renewHandler = () => {
    setIsSubscriptionPopupVisible(false);
    navigate("/memberships");
  };

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false);
        setIsSubscriptionPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
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
            <Link to="http://alphavatar.ca/">
              <img style={{ width: 50 }} src="/assets/images/Layer_1.png" alt="Explore" />
            </Link>
          </div>
          <Link className="" to={`${user ? "/avatar-creation" : "/login"}`}>
            <div className="logo">Alphavatar</div>
          </Link>
        </div>
        <div className="flex gap-7 flex-col md:flex-row justify-center items-center">
          {user ? (
            <>
              <div
                onClick={() => {
                  setIsPopupVisible(!isPopupVisible);
                  setIsSubscriptionPopupVisible(false);
                }}
                className="cursor-pointer"
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
              </div>

              {isPopupVisible && (
                <div
                  ref={popupRef}
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
                  <h1 className="text-[#482BE7]">
                    Hi {user.displayName ? user.displayName : `${user.firstName} ${user.lastName}`}! Loving your avatars!?
                  </h1>
                  <h1 className="text-gray-700 text-left text-xl font-semibold">
                    {user.displayName ? user.displayName : `${user.firstName} ${user.lastName}`}
                  </h1>
                  <h1 className="text-gray-700 text-left text-sm -mt-3 font-light">{user.email}</h1>
                  <div className="flex flex-col text-gray-700 cursor-pointer gap-8">
                    <div
                      className={`flex gap-8 px-10 py-2 z-20 cursor-pointer items-center ${
                        active === "subscriptions" ? "bg-[#BAC4FB]" : ""
                      }`}
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
                      className={`flex px-10 py-2 gap-8 z-20 cursor-pointer items-center ${
                        active === "logout" ? "bg-[#BAC4FB]" : ""
                      }`}
                      onClick={() => {
                        logout();
                        navigate("/login");
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
                  ref={popupRef}
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
                  {!membership && (
                    <button
                      onClick={renewHandler}
                      className="cursor-pointer text-center rounded-lg mt-1 py-2 px-[6px] text-white w-[50%] bg-[#7186FF]"
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </header>
    {membership ? (
        <div className="flex bg-white cursor-pointer w-full justify-center items-center">
    <div className="bg-white cursor-pointer text-lg text-gray-700 px-4 py-1 rounded-full w-full max-w-md text-center">
      You Have {membership.avatarCountRemaining} avatar left
    </div>
    </div>
  ) : (
    <div className="flex bg-white cursor-pointer w-full justify-center items-center">
    <div
      onClick={() => navigate('/memberships')}
      className="bg-white cursor-pointer text-lg text-gray-700 px-4 py-1 rounded-full w-full max-w-md text-center"
    >
      Subscribe Now
    </div>
    </div>
    
  )}
    </>
  );
};

export default Header;
