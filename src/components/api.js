import axios from "axios";

const generateAvatar = async (name) => {
  try {
    const response = await axios.post(
      "https://alphavatar.fun/alphavtar/v8/facegeneration",
      {
        Name: name,
        limit: 10,
        page: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error generating avatar:", error);
    throw error;
  }
};

export default generateAvatar;
