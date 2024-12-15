import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("Please Sign In/Sign Up.");
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? children : null;
};

export default ProtectedRoute;
