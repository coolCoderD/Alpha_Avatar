import React, { useState } from "react";
import { db, collection, addDoc } from "../../firebase";

const FeedbackForm = ({ featureStates, onClose,  userId ,userName}) => {
  const [selectedFeature, setSelectedFeature] = useState(""); // For dropdown selection
  const [feedback, setFeedback] = useState(""); // Single feedback input
  const [loading, setLoading] = useState(false);


  const handleFeatureSelect = (event) => {
    setSelectedFeature(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form default behavior

    if (!selectedFeature || !feedback) {
      alert("Please select a feature and provide feedback.");
      return;
    }

    try {
      setLoading(true);

      // Save feedback and image URL to Firestore
      const docRef = await addDoc(collection(db, "feedbacksOfUsers"), {
        userId,
        userName,
        feature: selectedFeature,
        feedback,
        featureStates,
        timestamp: new Date(),
      });

      console.log(userId,feedback);

      alert(`Feedback for "${selectedFeature}" submitted successfully!`);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex px-12 bg-gradient-to-r from-[#0b0c10] to-[#1f1f3a] flex-col gap-6 bg-white p-6 rounded-lg shadow-lg"
    >

      <h2 className="text-lg font-semibold gradient-text">Provide Feedback</h2>
      {/* Dropdown for feature selection */}
      <div className="flex flex-col gap-3">
        <label className="gradient-text text-sm font-medium">Select a Feature:</label>
        <select
          value={selectedFeature}
          onChange={handleFeatureSelect}
          className="styled-input border rounded-lg px-3 py-2 w-full"
          required
        >
          <option value="" disabled>
            -- Select Feature --
          </option>
          {featureStates.map((feature) => (
            <option key={feature.name} value={feature.name}>
              {feature.name}
            </option>
          ))}
        </select>
      </div>

      {/* Feedback text area */}
      <div className="flex flex-col gap-3">
        <label className="gradient-text text-sm font-medium">Feedback:</label>
        <textarea
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full styled-input"
          placeholder="Write your feedback here..."
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center items-center">
      <button
        type="submit"
        disabled={loading}
        className={`rounded-lg py-2 px-4 text-white w-[50%] ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
