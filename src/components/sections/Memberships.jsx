import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path as necessary



const Memberships = () => {
  const navigate = useNavigate();
  const { innerWidth: width, innerHeight: height } = window;
  const priceIds=["price_1QUqdOEuYCed5kKZvepTVkeN",
    "price_1QUqdwEuYCed5kKZ6DzD4QrX",
    "price_1QUqeSEuYCed5kKZeqqxUDFF",
    "price_1QUqfQEuYCed5kKZXV8UkQgL",
    "price_1QUqfvEuYCed5kKZDXGCSX2Z"];


    const handleClick = (idx, price, avatarCount) => {
      navigate("/memberships-plan", {
        state: {
          priceId: priceIds[idx],
          price,
          avatarCount,
        },
      });
    };
    

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#0b0c10",
        gap: 35,
        padding:10,
        
      }}
    >
      <div className="flex flex-col">
        <div className="text-[#7186FF] text-[13px] text-center">PRICING</div>
        <div className="gradient-text  p-0">Simple Memberships </div>
      </div>
      <div className="flex flex-col">
        <div className="small-text ">Use the Startup Framework for free. </div>

        <div
          className="small-text "
          style={{
            fontSize: 24,
            fontWeight: 900,
          }}
        >
          The Framework includes 3 name trials for free !{" "}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="gradient-border w-[100%] md:w-[40%]">
          <div
            onClick={() => {
              navigate("/login");
            }}
            style={{
              background: "#000 !important",
              fontWeight: 400,
              fontSize: 16,
              display: "flex",
            }}
            className="styled-button px-3 py-4 small-text flex flex-col md:flex-row justify-between items-center"
          >
            <div className="w-fit-content ">Already have a subscription ?</div>
            <div
              style={{
                fontSize: 16,
                padding: 0,
                textAlign: "right",
                width: "fit-content",
                textDecoration: "underline",
              }}
              className="gradient-text"
            >
              <img
                style={{ width: 150 }}
                src="/assets/images/Link your accounts.png"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div
          className="gradient-text p-0 "
          style={{ fontSize: 20, fontWeight: 400 }}
        >
          Choose a plan that works for you
        </div>
        <div className="w-fit-content p-0">
          Get Unlimited trials after subscription !
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row justify-center gap-[100px] ">
        {
          [1,2]?.map((item,idx)=>{
            return(
              <div onClick={()=>{handleClick(idx,item==2? "15":"5",item==2? "5":"1")}} id="membershipPlans"
              className="gradient-border  w-[25%] p-[8px] "
              style={{ padding: "3px", width: 360 }}
            >
              <div className="styledMemberships  flex flex-col items-center gap-5">
                <div className="flex flex-col">
                  <div className=" gradient-text p-0" style={{ fontSize: 13 }}>
                    Download
                  </div>
                  <div className="gradient-text p-0" style={{ fontSize: 32 }}>
                    {item==2?"5":"1"}{" "} AVATARS
                  </div>
                </div>
                <div className="flex gap-10">
  {item == 2 && (
    <div className="text-gray-500 bigText line-through">C$25</div>
  )}
  <div className="bigText" style={{ fontSize: 40 }}>
    C${item == 2 ? "15" : "5"}
  </div>
</div>

    
                <div
                className="mb-10"
                  style={{
                    background: "#1C122F",
                    width: "80%",
                    height: 47,
                    padding: "3px",
                    textAlign: "center",
                    border: "1px solid #FFFFFF",
                    borderRadius: 8,
                  }}
                >
                  <div
                    className="gradient-text "
                    style={{ fontSize: 20, fontWeight: 500, padding: 4 }}
                  >
                    {" "}
                    SUBSCRIBE
                  </div>
                </div>
              </div>
            </div>
            )
          })
        }
       
      </div>

      <div className="flex flex-col md:flex-row  items-center justify-center gap-[100px] ">
        {
          [{avatar:10,
            price:50,
            discountedPrice:20
          },{
            avatar:50,
            price:250,
            discountedPrice:75    

          },{
            avatar:100,
            price:500,
            discountedPrice:113

          }]?.map((item,idx)=>{
            return(
              <div onClick={()=>{handleClick(idx+2,item.discountedPrice,item.avatar)}}
                 id="membershipPlans"
              className="gradient-border w-[25%] p-[8px] "
              style={{ padding: "3px", width: 360 ,
            
            }}
            >
              <div className="styledMemberships  flex flex-col items-center gap-5">
                <div className="flex flex-col">
                  <div className="gradient-text p-0" style={{ fontSize: 13 }}>
                    Download
                  </div>
                  <div className="gradient-text p-0" style={{ fontSize: 32 }}>
                    {item.avatar} AVATAR
                  </div>
                </div>
                <div className="flex gap-10">
                <div className="text-gray-500 bigText line-through">
              C${item.price}
            </div> 
                <div className="bigText" style={{ fontSize: 40 }}>
                  C${item.discountedPrice}
                </div>
                </div>

    
                <div
                className="mb-10"
                  style={{
                    background: "#1C122F",
                    width: "80%",
                    height: 47,
                    padding: "3px",
                    textAlign: "center",
                    border: "1px solid #FFFFFF",
                    borderRadius: 8,
                  }}
                >
                  <div
                    className="gradient-text"
                    style={{ fontSize: 20, fontWeight: 500, padding: 4 }}
                  >
                    {" "}
                    SUBSCRIBE
                  </div>
                </div>
              </div>
            </div>
            )
          })
        }
       
      </div>
    </div>
  );
};

export default Memberships;
