import React,{useEffect} from 'react'
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';

const Success = () => {
      const { user, storeMembershipData,membership } = useUser();
      const navigate=useNavigate();
      useEffect(() => {
        // Define an async function
        const handlePaymentSuccess = async () => {
          try {
            // Extract query parameters from the URL
            const queryParams = new URLSearchParams(window.location.search);
            const avatarCount = queryParams.get("avatarCount");
            const price = queryParams.get("price");
            const priceId = queryParams.get("priceId");
            const uid = queryParams.get("uid");
    
            // Check if parameters are present
            if (avatarCount && price && priceId && uid) {
              // Prepare the membership data
              const membershipData = {
                avatarCountRemaining: avatarCount,
                price: price,
                priceId: priceId,
                createdAt: new Date(),
                uid: user.uid,
                name: user.displayName,
              };
    
              // Call the function to store membership data
              await storeMembershipData(uid, membershipData);
              console.log("Membership data stored successfully:", membershipData);
            } else {
              console.error("Some parameters are missing in the URL.");
            }
          } catch (error) {
            console.error("Error handling payment success:", error);
          }
        };
    
        // Call the async function
        handlePaymentSuccess();
      }, [storeMembershipData, user]); // Add dependencies
  return (
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
                href="#" className="px-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3">
                    GO BACK 
               </a>
            </div>
        </div>
    </div>
  </div>
    </div>
  )
}

export default Success