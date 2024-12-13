// src/components/sections/HeroSection.js
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import React, { useEffect, useRef } from "react";

const HeroSection = () => {
  const carouselRef1 = useRef(null);
  const carouselRef2 = useRef(null);
  const user = localStorage.getItem('user');
  const parsedUser = JSON.parse(user);
const navigate=useNavigate()
  useEffect(() => {
    const createCarouselAnimation = (carousel, speedRef, positionRef) => {
      if (!carousel) return;

      const moveCarousel = () => {
        positionRef.current -= speedRef.current;

        // Reset position when a card width is reached
        if (positionRef.current < -320) {
          positionRef.current = 0;
          // Move first card to the end
          carousel.appendChild(carousel.firstElementChild);
        }

        // Apply the transform
        carousel.style.transform = `translateX(${positionRef.current}px)`;

        requestAnimationFrame(moveCarousel);
      };

      // Start the animation
      requestAnimationFrame(moveCarousel);

      // Add hover effect to pause/resume animation
      const pauseAnimation = () => (speedRef.current = 0);
      const resumeAnimation = () => (speedRef.current = 1.0);

      carousel.addEventListener("mouseenter", pauseAnimation);
      carousel.addEventListener("mouseleave", resumeAnimation);

      return () => {
        carousel.removeEventListener("mouseenter", pauseAnimation);
        carousel.removeEventListener("mouseleave", resumeAnimation);
      };
    };

    const speed1 = { current: 1.5 };
    const position1 = { current: 0 };
    const cleanup1 = createCarouselAnimation(
      carouselRef1.current,
      speed1,
      position1
    );

    const speed2 = { current: 1.5 };
    const position2 = { current: 0 };
    const cleanup2 = createCarouselAnimation(
      carouselRef2.current,
      speed2,
      position2
    );

    // Cleanup event listeners
    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, []);

  return (
<section className="hero-section gradient-img">
  <div className="gradient-text">
    Create some awesome avatars for your near & dear ones!
  </div>
  <div className="small-text ">
    An AI-enabled SaaS platform that creates unique avatars from a user’s name, giving personalization a new dimension.
  </div>

  <div onClick={()=>{navigate(`${parsedUser ? '/avatar-creation' : '/login'}`)}} style={{cursor:'pointer'}} className="create-your-avatar-btn mt-10">
    <img src="/assets/images/Fantasy.png" alt="Create Avatar" />
    CREATE YOUR AVATAR
  </div>

  <div className="flex flex-col mt-10">
    <div className="small-text" style={{ fontWeight: 600 }}>
      The only AI face avatar generator you need
    </div>
    <div className="small-text" style={{ marginTop: 20, fontWeight: 400 }}>
      Simplify your daily gifting operation with Alphavatar integrated automation.
    </div>
  </div>
{/* First Carousel */}
<div className="carousel-wrapper " style={{ marginTop: "50px" }}>
   <div className="carousel-container">
     <div className="carousel-track" ref={carouselRef1}>
       <div className="carousel-card">
         <img src="/assets/images/image 2.png" alt="Business" />
       </div>
       <div className="carousel-card">
         <img src="/assets/images/image 5.png" alt="Business" />
       </div>
       <div className="carousel-card">
         <img src="/assets/images/image 8.png" alt="Business" />
       </div>
       <div className="carousel-card">
         <img src="/assets/images/image 11.png" alt="Business" />
       </div>
     </div>
   </div>
 </div>

 {/* Second Carousel */}
 <div className="carousel-wrapper" style={{height:200}}>
   <div className="carousel-container">
     <div className="carousel-track" ref={carouselRef2}>
       <div className="carousel-card1">
         <img src="/assets/images/image 7.png" alt="Business" />
       </div>
       <div className="carousel-card1">
         <img src="/assets/images/image 9.png" alt="Business" />
       </div>
       <div className="carousel-card1">
         <img src="/assets/images/image 10.png" alt="Business" />
       </div>
     </div>
   </div>
 </div>

  <footer className="footer mt-10">
    <p className="footer-links">Alphavatar</p>
    <nav>
      <a className="footer-links" href="#terms">All Rights Reserved</a> |
      <a className="footer-links" href="#privacy">Terms of Use</a> |
      <a className="footer-links" href="#privacy">Privacy Policy</a>
    </nav>
  </footer>
</section>
);
  }

export default HeroSection;
