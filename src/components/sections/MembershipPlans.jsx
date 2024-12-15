import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import { useUser } from "../../Context/UserContext";


const stripePromise = loadStripe("pk_test_51QUNISEuYCed5kKZTwu6lUQzZaMEWAdEpuTMjmbGv63GsXbZ9Uw30RSZwR7CR5eNm3xw7w3K4nzLDYKg3RZkndjL00DrM2qrdS");

const MembershipPlans = () => {
  const { user, storeMembershipData,membership } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const { priceId, price, avatarCount } = location.state || {};

  const handleCheckout = async () => {
    setIsProcessing(true);

    // if(membership){
    //   alert("You already have membership");
    //   setIsProcessing(false);
    //   return
    // }
    const stripe = await stripePromise;

    if (!stripe) {
      console.error("Stripe failed to initialize.");
      setIsProcessing(false);
      return;
    }

    // Define success URL
    const successUrl = `${window.location.origin}/success?avatarCount=${avatarCount}&price=${price}&priceId=${priceId}&uid=${user.uid}`;

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      successUrl,
      cancelUrl: `${window.location.origin}/memberships`,
    });

    if (error) {
      console.error("Stripe Checkout error:", error);
    }

    setIsProcessing(false);
  };

  // // Simulated post-purchase handler for demonstration purposes
  // const handlePostPurchase = async () => {
  //   if (!user || !priceId || !avatarCount) {
  //     console.error("Missing required data for membership.");
  //     return;
  //   }
  
  //   const membershipData = {
  //     avatarCountRemaining: avatarCount,
  //     price: price,
  //     priceId: priceId,

  //     createdAt: new Date(),
  //     uid: user.uid,
  //     name: user.displayName,
  //   };
  
  //   try {
  //     await storeMembershipData(user.uid, membershipData);
  //     // console.log("Membership successfully stored with transaction ID:", transactionId);
  //   } catch (error) {
  //     console.error("Failed to store membership data:", error);
  //   }
  // };
  

  // useEffect(() => {
  //   // Simulate membership storage after successful payment (if triggered on success page)
  //   handlePostPurchase();
  // }, [user, priceId, avatarCount]);

  return (
    <div className="flex flex-col bg-[#0b0c10] pt-6 min-h-screen text-white">
      <div className="text-center mb-6">
        <h1 className="gradient-text text-6xl font-bold">Hello, {user?.displayName || ""}</h1><br/>
        <h2 className="gradient-text text-3xl font-bold">Memberships</h2>
      </div>
      <div className="flex flex-col md:flex-row w-full gap-6 px-6">
        <div className="flex-1 membership-gradient-bg flex flex-col items-center text-center py-12 px-6 rounded-lg shadow-lg">
          <h2 className="gradient-text text-2xl font-bold mb-4">{avatarCount} Avatar Plan</h2>
          <ul className="text-lg mb-6 list-none">
            <li>Get {avatarCount} Names to create</li>
            <li>Up to {avatarCount} images can be downloaded</li>
          </ul>
          <p className="text-4xl font-bold">C${price}.00</p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {
          membership? 
          <button
          onClick={handleCheckout}
          disabled
          className={`mt-3 w-96 px-6 py-3 font-bold text-lg rounded-lg shadow-md transition duration-300  bg-gray-400 cursor-not-allowed `}
        >
          You already have membership
        </button>:        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className={`mt-3 w-96 px-6 py-3 font-bold text-lg rounded-lg shadow-md transition duration-300 ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed animate-pulse"
              : "gradient-border"
          }`}
        >
          {isProcessing ? "Processing Payment..." : "Proceed to Pay"}
        </button>
        }
      </div>
    </div>
  );
};

export default MembershipPlans;
