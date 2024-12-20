import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import FeatureControlPanel from "./FeatureControl";
import Header from "../layout/Header";

const EditAvatar = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { imageURL,text } = location.state || {};
  const avatarId = useMemo(() => imageURL?.split(`/`).pop(), [imageURL]);

  useEffect(() => {
    setLoading(true);
    const storedData = JSON.parse(localStorage.getItem("avatars"));
    if (storedData && avatarId) {
      const avatarFeatures = storedData[avatarId]?.features || [];
      setFeatures(avatarFeatures);
    } else {
      console.error("No features found for the given avatarId or localStorage data is missing.");
    }
    setLoading(false);
  }, [avatarId]);



  if (loading) return <div>Loading...</div>;

  return (
    <>
    <Header></Header>
    <section className="py-10 px-4 flex flex-col md:flex-row w-full">
      <FeatureControlPanel features={features} imageURL={imageURL} text={text} />
    </section>
    </>
  );
};

export default EditAvatar;
