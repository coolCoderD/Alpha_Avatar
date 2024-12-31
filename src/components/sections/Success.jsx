import React,{useEffect} from 'react'
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';

const Success = () => {
      const { user, storeMembershipData,membership } = useUser();
      const navigate=useNavigate();
      useEffect(() => {
        const handlePaymentSuccess = async () => {
          try {
            const queryParams = new URLSearchParams(window.location.search);
            const avatarCount = queryParams.get("avatarCount");
            const price = queryParams.get("price");
            const priceId = queryParams.get("priceId");
            const uid = queryParams.get("uid");
      
            if (avatarCount && price && priceId && uid) {
              // Debugging: Log user object
              console.log("User object:", user);
      
              const membershipData = {
                avatarCountRemaining: avatarCount,
                price: price,
                priceId: priceId,
                createdAt: new Date(),
                uid: user?.uid || uid, // Fallback to URL uid if user.uid is undefined
                name: user?.displayName || "Anonymous", // Fallback to 'Anonymous'
              };
      
              await storeMembershipData(uid, membershipData);
              console.log("Membership data stored successfully:", membershipData);
            } else {
              console.error("Some parameters are missing in the URL.");
            }
          } catch (error) {
            console.error("Error handling payment success:", error);
          }
        };
      
        handlePaymentSuccess();
      }, [storeMembershipData, user]);
      // Add dependencies
  return (
    <>
    <Header/>
    <div>
        <div className="flex items-center justify-center">
      <div className=" p-6  md:mx-auto">
        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
            <path fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
            </path>
        </svg>
        <div className="text-center">
            <h3 className="md:text-2xl text-base text-white font-semibold text-center">Payment Done!</h3>
            <p className="text-gray-300 my-2">Thank you for completing your secure online payment.</p>
            <p> Have a great day!  </p>
            <div className="py-10 text-center">
                <a 
                onClick={() => {navigate("/avatar-creation")}}
                href="#" className="px-12 bg-[#7186FF] hover:bg-[#5267df] text-white font-semibold py-3">
                    GO BACK 
               </a>
            </div>
        </div>
    </div>
  </div>
    </div>
    </>
  )
}

export default Success